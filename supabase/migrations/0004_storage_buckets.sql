insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true), ('business-logos', 'business-logos', true), ('user-avatars', 'user-avatars', true);

create policy "public product image access" on storage.objects for select using (bucket_id = 'product-images');
create policy "seller product image upload" on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "owner product image delete" on storage.objects for delete using (bucket_id = 'product-images' and auth.uid() = owner);
create policy "public business logo access" on storage.objects for select using (bucket_id = 'business-logos');
create policy "seller business logo upload" on storage.objects for insert with check (bucket_id = 'business-logos' and auth.role() = 'authenticated');
create policy "owner business logo delete" on storage.objects for delete using (bucket_id = 'business-logos' and auth.uid() = owner);
create policy "public avatar access" on storage.objects for select using (bucket_id = 'user-avatars');
create policy "owner avatar upload" on storage.objects for insert with check (bucket_id = 'user-avatars' and auth.uid() = owner);
create policy "owner avatar delete" on storage.objects for delete using (bucket_id = 'user-avatars' and auth.uid() = owner);
