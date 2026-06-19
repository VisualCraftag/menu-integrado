create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price > 0),
  image_url text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.admins enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
to anon, authenticated
using (true);

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated admins can write categories" on public.categories;
drop policy if exists "Demo admin can write categories" on public.categories;
create policy "Demo admin can write categories"
on public.categories for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can write products" on public.products;
drop policy if exists "Demo admin can write products" on public.products;
create policy "Demo admin can write products"
on public.products for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Admins table is private" on public.admins;
create policy "Admins table is private"
on public.admins for all
to authenticated
using (true)
with check (true);

insert into public.categories (id, name) values
  ('11111111-1111-1111-1111-111111111111', 'Entradas'),
  ('22222222-2222-2222-2222-222222222222', 'Principales'),
  ('33333333-3333-3333-3333-333333333333', 'Pastas'),
  ('44444444-4444-4444-4444-444444444444', 'Postres'),
  ('55555555-5555-5555-5555-555555555555', 'Bebidas')
on conflict (id) do nothing;

insert into public.products (name, description, price, image_url, category_id) values
  ('Burrata con tomates asados', 'Burrata cremosa, tomates confitados, pesto de albahaca y focaccia tostada.', 9200, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80', '11111111-1111-1111-1111-111111111111'),
  ('Croquetas de hongos', 'Croquetas doradas con alioli de ajo negro y hojas frescas.', 7100, 'https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=1200&q=80', '11111111-1111-1111-1111-111111111111'),
  ('Tartar de salmon', 'Salmon fresco, palta, pepino, lima y chips de arroz.', 10800, 'https://images.unsplash.com/photo-1560717845-968823efbee1?auto=format&fit=crop&w=1200&q=80', '11111111-1111-1111-1111-111111111111'),
  ('Ojo de bife grillado', 'Corte premium con papas rotas, chimichurri citrico y vegetales al fuego.', 18500, 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80', '22222222-2222-2222-2222-222222222222'),
  ('Pollo braseado al limon', 'Pollo de campo, salsa de limon y hierbas con pure de calabaza.', 13200, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80', '22222222-2222-2222-2222-222222222222'),
  ('Pesca del dia', 'Filet grillado, crema de hinojo, ensalada tibia y aceite verde.', 16900, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80', '22222222-2222-2222-2222-222222222222'),
  ('Risotto de azafran', 'Arroz carnaroli, azafran, parmesano estacionado y limon.', 12800, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80', '33333333-3333-3333-3333-333333333333'),
  ('Tagliatelle al ragu', 'Pasta fresca con ragu de coccion lenta y queso pecorino.', 12100, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80', '33333333-3333-3333-3333-333333333333'),
  ('Ravioles de calabaza', 'Ravioles caseros, manteca noisette, salvia y semillas tostadas.', 11600, 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?auto=format&fit=crop&w=1200&q=80', '33333333-3333-3333-3333-333333333333'),
  ('Tiramisu de la casa', 'Mascarpone, cafe espresso, cacao amargo y vainillas suaves.', 6200, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80', '44444444-4444-4444-4444-444444444444'),
  ('Flan quemado', 'Flan casero con caramelo tostado y crema batida.', 5400, 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=1200&q=80', '44444444-4444-4444-4444-444444444444'),
  ('Pavlova de estacion', 'Merengue crocante, crema ligera y frutas frescas.', 6900, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80', '44444444-4444-4444-4444-444444444444'),
  ('Limonada de menta', 'Limon exprimido, menta fresca, almibar suave y soda.', 3900, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=1200&q=80', '55555555-5555-5555-5555-555555555555'),
  ('Spritz de pomelo', 'Aperitivo citrico, pomelo rosado, burbujas y romero.', 6200, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1200&q=80', '55555555-5555-5555-5555-555555555555'),
  ('Cafe frio especiado', 'Cold brew, cardamomo, naranja y espuma de leche.', 4300, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80', '55555555-5555-5555-5555-555555555555');

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view menu images" on storage.objects;
create policy "Public can view menu images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'menu-images');

drop policy if exists "Authenticated users can upload menu images" on storage.objects;
drop policy if exists "Demo admin can upload menu images" on storage.objects;
create policy "Demo admin can upload menu images"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'menu-images');

drop policy if exists "Authenticated users can update menu images" on storage.objects;
drop policy if exists "Demo admin can update menu images" on storage.objects;
create policy "Demo admin can update menu images"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'menu-images')
with check (bucket_id = 'menu-images');

drop policy if exists "Authenticated users can delete menu images" on storage.objects;
drop policy if exists "Demo admin can delete menu images" on storage.objects;
create policy "Demo admin can delete menu images"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'menu-images');
