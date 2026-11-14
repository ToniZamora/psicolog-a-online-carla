create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- First account created becomes admin (Carla)
create or replace function public.assign_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.assign_first_admin();

create table public.slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null unique,
  ends_at timestamptz not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.slots to anon, authenticated;
grant insert, update, delete on public.slots to authenticated;
grant all on public.slots to service_role;
alter table public.slots enable row level security;
create policy "Anyone can view slots" on public.slots for select to anon, authenticated using (true);
create policy "Admin inserts slots" on public.slots for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates slots" on public.slots for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes slots" on public.slots for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null unique references public.slots(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);
grant select, delete on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "Admin reads bookings" on public.bookings for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes bookings" on public.bookings for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.book_slot(_slot_id uuid, _name text, _email text, _phone text)
returns uuid language plpgsql security definer set search_path = public
as $$
declare _id uuid;
begin
  if length(trim(_name)) < 2 or length(_name) > 100 then raise exception 'Nombre no válido'; end if;
  if _email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(_email) > 255 then raise exception 'Email no válido'; end if;
  if length(regexp_replace(_phone, '\D', '', 'g')) < 9 or length(_phone) > 30 then raise exception 'Teléfono no válido'; end if;
  update public.slots set is_booked = true
    where id = _slot_id and is_booked = false and starts_at > now();
  if not found then raise exception 'Este horario ya no está disponible'; end if;
  insert into public.bookings (slot_id, name, email, phone)
    values (_slot_id, trim(_name), trim(_email), trim(_phone)) returning id into _id;
  return _id;
end $$;
revoke all on function public.book_slot(uuid, text, text, text) from public;
grant execute on function public.book_slot(uuid, text, text, text) to anon, authenticated;

-- Free the slot when a booking is cancelled
create or replace function public.free_slot_on_cancel()
returns trigger language plpgsql security definer set search_path = public
as $$ begin update public.slots set is_booked = false where id = old.slot_id; return old; end $$;
create trigger on_booking_deleted after delete on public.bookings
for each row execute function public.free_slot_on_cancel();