-- Security hardening for row level security policies.

-- UPDATE policies without WITH CHECK let a row be moved out of the caller's
-- scope (e.g. reassigning a product to another business).
drop policy if exists "products update own" on public.products;
create policy "products update own" on public.products for update
  to authenticated
  using (business_id in (select id from public.businesses where owner_id = auth.uid()) or public.is_admin())
  with check (business_id in (select id from public.businesses where owner_id = auth.uid()) or public.is_admin());

drop policy if exists "images manage own" on public.product_images;
create policy "images manage own" on public.product_images for all
  to authenticated
  using (product_id in (select p.id from public.products p join public.businesses b on b.id = p.business_id where b.owner_id = auth.uid()))
  with check (product_id in (select p.id from public.products p join public.businesses b on b.id = p.business_id where b.owner_id = auth.uid()));

-- Analytics rows must not be attributable to a user other than the caller.
drop policy if exists "views insert" on public.product_views;
create policy "views insert" on public.product_views for insert
  with check (user_id is null or user_id = auth.uid());

drop policy if exists "clicks insert" on public.whatsapp_clicks;
create policy "clicks insert" on public.whatsapp_clicks for insert
  with check (user_id is null or user_id = auth.uid());

-- auth.role() is deprecated and passes for anonymous sign-ins; use TO authenticated.
drop policy if exists "seller product image upload" on storage.objects;
create policy "seller product image upload" on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "seller business logo upload" on storage.objects;
create policy "seller business logo upload" on storage.objects for insert
  to authenticated
  with check (bucket_id = 'business-logos');

drop policy if exists "owner avatar upload" on storage.objects;
create policy "owner avatar upload" on storage.objects for insert
  to authenticated
  with check (bucket_id = 'user-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "owner avatar delete" on storage.objects;
create policy "owner avatar delete" on storage.objects for delete
  to authenticated
  using (bucket_id = 'user-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner avatar update" on storage.objects for update
  to authenticated
  using (bucket_id = 'user-avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'user-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
