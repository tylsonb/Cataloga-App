-- Security and performance hardening migration

-- 1. Secure search_path for mutable function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Revoke execute on trigger / security definer functions from public/anon/authenticated
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.promote_business_owner() from public, anon, authenticated;
revoke execute on function public.increment_product_views() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- 3. Performance: Covering indexes for foreign keys
create index if not exists businesses_category_idx on public.businesses(category_id);
create index if not exists favorites_product_idx on public.favorites(product_id);
create index if not exists product_views_user_idx on public.product_views(user_id);
create index if not exists products_subcategory_idx on public.products(subcategory_id);
create index if not exists whatsapp_clicks_product_idx on public.whatsapp_clicks(product_id);
create index if not exists whatsapp_clicks_user_idx on public.whatsapp_clicks(user_id);
