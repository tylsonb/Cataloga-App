alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.businesses enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.favorites enable row level security;
alter table public.product_views enable row level security;
alter table public.whatsapp_clicks enable row level security;

create function public.is_admin() returns boolean language sql security definer stable set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = auth.uid() and role = 'admin');
$$;

create policy "profiles select self" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles update self" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "roles select self" on public.user_roles for select using (user_id = auth.uid() or public.is_admin());
create policy "categories public select" on public.categories for select using (is_active or public.is_admin());
create policy "categories admin manage" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "subcategories public select" on public.subcategories for select using (is_active or public.is_admin());
create policy "subcategories admin manage" on public.subcategories for all using (public.is_admin()) with check (public.is_admin());
create policy "businesses public select" on public.businesses for select using (is_active or owner_id = auth.uid() or public.is_admin());
create policy "businesses create own" on public.businesses for insert with check (owner_id = auth.uid());
create policy "businesses update own" on public.businesses for update using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());
create policy "products public select" on public.products for select using ((status = 'published' and deleted_at is null) or business_id in (select id from public.businesses where owner_id = auth.uid()) or public.is_admin());
create policy "products create own" on public.products for insert with check (business_id in (select id from public.businesses where owner_id = auth.uid()));
create policy "products update own" on public.products for update using (business_id in (select id from public.businesses where owner_id = auth.uid()) or public.is_admin());
create policy "images public select" on public.product_images for select using (true);
create policy "images manage own" on public.product_images for all using (product_id in (select p.id from public.products p join public.businesses b on b.id = p.business_id where b.owner_id = auth.uid()));
create policy "favorites own manage" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "views insert" on public.product_views for insert with check (true);
create policy "views seller select" on public.product_views for select using (product_id in (select p.id from public.products p join public.businesses b on b.id = p.business_id where b.owner_id = auth.uid()) or public.is_admin());
create policy "clicks insert" on public.whatsapp_clicks for insert with check (true);
create policy "clicks seller select" on public.whatsapp_clicks for select using (business_id in (select id from public.businesses where owner_id = auth.uid()) or public.is_admin());
