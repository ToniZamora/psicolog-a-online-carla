-- Tests de seguridad y reglas de reserva. Cualquier fallo aborta con ERROR.
\set ON_ERROR_STOP on
\o /dev/null

-- Ayudas ---------------------------------------------------------------
create function pg_temp.ok(cond boolean, nombre text) returns void language plpgsql as $$
begin
  if not coalesce(cond, false) then raise exception 'FALLA: %', nombre; end if;
  raise notice 'ok  %', nombre;
end $$;

-- Ejecuta SQL como un rol y comprueba que falla con el mensaje esperado.
create function pg_temp.falla(rol text, sql text, contiene text, nombre text) returns void language plpgsql as $$
begin
  execute format('set local role %I', rol);
  begin
    execute sql;
  exception when others then
    reset role;
    if position(contiene in sqlerrm) = 0 then
      raise exception 'FALLA: % (error inesperado: %)', nombre, sqlerrm;
    end if;
    raise notice 'ok  %', nombre;
    return;
  end;
  reset role;
  raise exception 'FALLA: % (no dio error)', nombre;
end $$;

create function pg_temp.libre() returns uuid language sql as $$
  select id from public.slots where not is_booked and starts_at > now() order by starts_at limit 1 $$;
grant execute on function pg_temp.libre() to anon;

begin;

-- Datos ----------------------------------------------------------------
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'carla@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'intruso@example.com');
select pg_temp.ok((select count(*) = 0 from public.user_roles), 'registrarse no da rol de admin');
insert into public.user_roles (user_id, role) values ('11111111-1111-1111-1111-111111111111', 'admin');

insert into public.slots (starts_at, ends_at)
  select now() + (i || ' hours')::interval, now() + (i || ' hours')::interval + interval '50 min'
  from generate_series(1, 30) i;
insert into public.slots (starts_at, ends_at)
  values (now() - interval '100 days', now() - interval '100 days' + interval '50 min');

-- Visitante anónimo ----------------------------------------------------
select pg_temp.falla('anon', $q$select public.has_role('11111111-1111-1111-1111-111111111111', 'admin')$q$,
  'permission denied', 'anónimo no puede llamar a has_role');
select pg_temp.falla('anon', 'select public.is_admin()', 'permission denied', 'anónimo no puede llamar a is_admin');
select pg_temp.falla('anon', 'select * from public.bookings', 'permission denied', 'anónimo no lee reservas');
select pg_temp.falla('anon', $q$insert into public.slots (starts_at, ends_at) values (now() + interval '9 days', now() + interval '9 days 50 min')$q$,
  'permission denied', 'anónimo no crea horarios');
select pg_temp.falla('anon', 'select public.purge_old_bookings()', 'permission denied', 'anónimo no puede purgar');

-- Reservas -------------------------------------------------------------
set local role anon;
select public.book_slot(pg_temp.libre(), 'Ana', 'Ana@Example.com', '600 111 222');
select public.book_slot(pg_temp.libre(), 'Ana', 'ana@example.com', '600111222');
reset role;
select pg_temp.ok((select count(*) = 2 from public.bookings), 'dos reservas válidas');
select pg_temp.ok((select bool_and(email = lower(email)) from public.bookings), 'el correo se guarda normalizado');

select pg_temp.falla('anon', $q$select public.book_slot(pg_temp.libre(), 'Ana', 'ana@example.com', '611000000')$q$,
  'Ya tienes citas pendientes', 'máximo 2 citas futuras por correo');
select pg_temp.falla('anon', $q$select public.book_slot(pg_temp.libre(), 'Ana', 'otra@example.com', '+34 600-111-222')$q$,
  'Ya tienes citas pendientes', 'mismo móvil con prefijo +34 cuenta como el mismo');
select pg_temp.falla('anon', $q$select public.book_slot((select id from public.slots where is_booked limit 1), 'Bea', 'bea@example.com', '622000000')$q$,
  'ya no está disponible', 'no se reserva un hueco ocupado');
select pg_temp.falla('anon', $q$select public.book_slot((select id from public.slots where starts_at < now() limit 1), 'Bea', 'bea@example.com', '622000000')$q$,
  'ya no está disponible', 'no se reserva un hueco pasado');
select pg_temp.falla('anon', $q$select public.book_slot(pg_temp.libre(), 'B', 'bea@example.com', '622000000')$q$,
  'Nombre no válido', 'valida el nombre');
select pg_temp.falla('anon', $q$select public.book_slot(pg_temp.libre(), 'Bea', 'no-es-correo', '622000000')$q$,
  'Email no válido', 'valida el correo');
select pg_temp.falla('anon', $q$select public.book_slot(pg_temp.libre(), 'Bea', 'bea@example.com', '12345')$q$,
  'Teléfono no válido', 'valida el teléfono');

-- Límite global: 10 reservas por hora.
set local role anon;
select public.book_slot(pg_temp.libre(), 'Bot', 'bot' || i || '@example.com', '63300000' || i) from generate_series(1, 8) i;
reset role;
select pg_temp.ok((select count(*) = 10 from public.bookings), 'diez reservas en la hora');
select pg_temp.falla('anon', $q$select public.book_slot(pg_temp.libre(), 'Bot', 'bot9@example.com', '644000009')$q$,
  'muchas reservas', 'la undécima reserva de la hora se rechaza');

-- Gestión por enlace ---------------------------------------------------
create temp table t as
  select b.manage_token as tok, b.slot_id as viejo, (select id from public.slots where not is_booked and starts_at > now() order by starts_at desc limit 1) as nuevo
  from public.bookings b where b.email = 'ana@example.com' order by b.created_at, b.id limit 1;
grant select on t to anon;

set local role anon;
select public.reschedule_booking((select tok from t), (select nuevo from t));
reset role;
select pg_temp.ok((select s.is_booked from public.slots s, t where s.id = t.nuevo), 'cambiar hora ocupa el hueco nuevo');
select pg_temp.ok((select not s.is_booked from public.slots s, t where s.id = t.viejo), 'cambiar hora libera el hueco viejo');
select pg_temp.ok((select count(*) from public.slots where is_booked) = (select count(*) from public.bookings), 'huecos ocupados = reservas');

select pg_temp.falla('anon', 'select public.cancel_booking_by_token(gen_random_uuid())',
  'No se puede cancelar', 'un token inventado no cancela nada');
set local role anon;
select public.cancel_booking_by_token((select tok from t));
reset role;
select pg_temp.ok((select count(*) = 0 from public.bookings b, t where b.manage_token = t.tok), 'cancelar borra los datos');
select pg_temp.ok((select not s.is_booked from public.slots s, t where s.id = t.nuevo), 'cancelar libera el hueco');

-- Usuarios con sesión --------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select pg_temp.ok(public.is_admin(), 'Carla es admin');
select pg_temp.ok((select count(*) > 0 from public.bookings), 'Carla ve las reservas');
set local request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select pg_temp.ok(not public.is_admin(), 'otro usuario no es admin');
select pg_temp.ok((select count(*) = 0 from public.bookings), 'otro usuario no ve reservas');
reset role;
select pg_temp.falla('authenticated', $q$insert into public.user_roles (user_id, role) values ('22222222-2222-2222-2222-222222222222', 'admin')$q$,
  'permission denied', 'nadie se puede dar rol de admin');

-- Conservación ---------------------------------------------------------
select public.purge_old_bookings();
select pg_temp.ok((select count(*) = 0 from public.slots where ends_at < now() - interval '90 days'), 'se purgan los huecos de hace más de 90 días');

rollback;
\o
\echo 'Todos los tests de base de datos han pasado.'
