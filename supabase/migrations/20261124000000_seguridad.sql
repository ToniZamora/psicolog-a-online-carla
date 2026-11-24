-- ============================================================
-- Endurecimiento de seguridad y privacidad
-- Se aplica sobre las dos migraciones anteriores (las de la web original).
-- ============================================================

-- 1. Nadie se convierte en admin por registrarse.
--    Antes, la primera cuenta creada sin admin existente pasaba a ser admin: si el rol de Carla
--    se perdía, cualquiera que se registrase heredaba el panel. Ahora el rol se da a mano:
--      insert into public.user_roles (user_id, role) values ('<uuid de Carla>', 'admin');
drop trigger if exists on_auth_user_created_admin on auth.users;
drop function if exists public.assign_first_admin();

-- 2. has_role(): solo para usuarios con sesión (lo usan las políticas RLS).
--    Antes cualquier visitante anónimo podía consultar si un usuario era admin.
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select public.has_role(auth.uid(), 'admin') $$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 3. Reserva con límites anti-abuso.
--    Antes un script podía reservar todos los huecos con datos falsos sin ninguna traba.
--    - Máximo 2 citas futuras por correo o teléfono.
--    - Máximo 10 reservas nuevas por hora en total (una consulta individual no lo alcanza).
create or replace function public.book_slot(_slot_id uuid, _name text, _email text, _phone text)
returns uuid language plpgsql security definer set search_path = public
as $$
declare
  _tok uuid;
  _email_n text := lower(trim(coalesce(_email, '')));
  _phone_n text := regexp_replace(coalesce(_phone, ''), '\D', '', 'g');
  _phone_9 text := right(_phone_n, 9); -- sin prefijo internacional: +34 600… = 600…
begin
  if length(trim(coalesce(_name, ''))) < 2 or length(_name) > 100 then raise exception 'Nombre no válido'; end if;
  if _email_n !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(_email_n) > 255 then raise exception 'Email no válido'; end if;
  if length(_phone_n) < 9 or length(_phone) > 30 then raise exception 'Teléfono no válido'; end if;

  if (select count(*) from public.bookings b join public.slots s on s.id = b.slot_id
      where s.starts_at > now()
        and (lower(b.email) = _email_n or right(regexp_replace(b.phone, '\D', '', 'g'), 9) = _phone_9)) >= 2 then
    raise exception 'Ya tienes citas pendientes. Para pedir más, escríbeme por WhatsApp o correo.';
  end if;

  if (select count(*) from public.bookings where created_at > now() - interval '1 hour') >= 10 then
    raise exception 'Ahora mismo hay muchas reservas. Inténtalo más tarde o escríbeme por WhatsApp.';
  end if;

  update public.slots set is_booked = true where id = _slot_id and is_booked = false and starts_at > now();
  if not found then raise exception 'Este horario ya no está disponible'; end if;

  insert into public.bookings (slot_id, name, email, phone)
    values (_slot_id, trim(_name), _email_n, trim(_phone)) returning manage_token into _tok;
  return _tok;
end $$;
revoke all on function public.book_slot(uuid, text, text, text) from public;
grant execute on function public.book_slot(uuid, text, text, text) to anon, authenticated;

-- 4. Cambiar de hora: bloquear la cita para que dos cambios simultáneos no la dejen incoherente.
create or replace function public.reschedule_booking(_token uuid, _new_slot_id uuid)
returns void language plpgsql security definer set search_path = public
as $$
declare _old uuid;
begin
  select b.slot_id into _old from public.bookings b join public.slots s on s.id = b.slot_id
    where b.manage_token = _token and s.starts_at > now()
    for update of b;
  if _old is null then raise exception 'No se puede cambiar esta cita'; end if;
  if _old = _new_slot_id then return; end if;
  update public.slots set is_booked = true where id = _new_slot_id and is_booked = false and starts_at > now();
  if not found then raise exception 'Ese horario ya no está disponible'; end if;
  update public.bookings set slot_id = _new_slot_id where manage_token = _token;
  update public.slots set is_booked = false where id = _old;
end $$;
revoke all on function public.reschedule_booking(uuid, uuid) from public;
grant execute on function public.reschedule_booking(uuid, uuid) to anon, authenticated;

-- 5. Conservación limitada (RGPD): borrar huecos y reservas 90 días después de la cita.
--    Debe coincidir con lo que dice /privacidad/.
create or replace function public.purge_old_bookings()
returns void language sql security definer set search_path = public
as $$ delete from public.slots where ends_at < now() - interval '90 days' $$;
revoke all on function public.purge_old_bookings() from public, anon, authenticated;

-- Programarlo cada día con pg_cron si la extensión está disponible.
do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.schedule('purgar-reservas-antiguas', '30 3 * * *', 'select public.purge_old_bookings()');
  else
    raise notice 'pg_cron no está disponible: programa public.purge_old_bookings() de otra forma.';
  end if;
end $$;
