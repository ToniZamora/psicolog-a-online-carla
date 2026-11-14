alter table public.bookings add column manage_token uuid not null unique default gen_random_uuid();

drop function public.book_slot(uuid, text, text, text);
create function public.book_slot(_slot_id uuid, _name text, _email text, _phone text)
returns uuid language plpgsql security definer set search_path = public
as $$
declare _tok uuid;
begin
  if length(trim(_name)) < 2 or length(_name) > 100 then raise exception 'Nombre no válido'; end if;
  if _email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(_email) > 255 then raise exception 'Email no válido'; end if;
  if length(regexp_replace(_phone, '\D', '', 'g')) < 9 or length(_phone) > 30 then raise exception 'Teléfono no válido'; end if;
  update public.slots set is_booked = true where id = _slot_id and is_booked = false and starts_at > now();
  if not found then raise exception 'Este horario ya no está disponible'; end if;
  insert into public.bookings (slot_id, name, email, phone)
    values (_slot_id, trim(_name), trim(_email), trim(_phone)) returning manage_token into _tok;
  return _tok;
end $$;
revoke all on function public.book_slot(uuid, text, text, text) from public;
grant execute on function public.book_slot(uuid, text, text, text) to anon, authenticated;

create function public.get_booking_by_token(_token uuid)
returns table (name text, starts_at timestamptz)
language sql stable security definer set search_path = public
as $$ select b.name, s.starts_at from public.bookings b join public.slots s on s.id = b.slot_id where b.manage_token = _token $$;
revoke all on function public.get_booking_by_token(uuid) from public;
grant execute on function public.get_booking_by_token(uuid) to anon, authenticated;

create function public.cancel_booking_by_token(_token uuid)
returns void language plpgsql security definer set search_path = public
as $$
begin
  delete from public.bookings b using public.slots s
    where b.manage_token = _token and s.id = b.slot_id and s.starts_at > now();
  if not found then raise exception 'No se puede cancelar esta cita'; end if;
end $$;
revoke all on function public.cancel_booking_by_token(uuid) from public;
grant execute on function public.cancel_booking_by_token(uuid) to anon, authenticated;

create function public.reschedule_booking(_token uuid, _new_slot_id uuid)
returns void language plpgsql security definer set search_path = public
as $$
declare _old uuid;
begin
  select b.slot_id into _old from public.bookings b join public.slots s on s.id = b.slot_id
    where b.manage_token = _token and s.starts_at > now();
  if _old is null then raise exception 'No se puede cambiar esta cita'; end if;
  update public.slots set is_booked = true where id = _new_slot_id and is_booked = false and starts_at > now();
  if not found then raise exception 'Ese horario ya no está disponible'; end if;
  update public.bookings set slot_id = _new_slot_id where manage_token = _token;
  update public.slots set is_booked = false where id = _old;
end $$;
revoke all on function public.reschedule_booking(uuid, uuid) from public;
grant execute on function public.reschedule_booking(uuid, uuid) to anon, authenticated;