-- Policies for this local MVP demo.
-- They allow the /admin panel to write with the public anon key and local app login.
-- Do not use this policy set in production.

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
