create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url) values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.raw_user_meta_data ->> 'avatar_url');
  insert into public.user_roles (user_id, role) values (new.id, 'buyer');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger categories_updated_at before update on public.categories for each row execute procedure public.set_updated_at();
create trigger subcategories_updated_at before update on public.subcategories for each row execute procedure public.set_updated_at();
create trigger businesses_updated_at before update on public.businesses for each row execute procedure public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute procedure public.set_updated_at();

create function public.promote_business_owner() returns trigger language plpgsql security definer set search_path = public as $$
begin update public.user_roles set role = 'seller' where user_id = new.owner_id and role = 'buyer'; return new; end;
$$;

create trigger business_owner_promoted after insert on public.businesses for each row execute procedure public.promote_business_owner();

create function public.increment_product_views() returns trigger language plpgsql security definer set search_path = public as $$
begin update public.products set view_count = view_count + 1 where id = new.product_id; return new; end;
$$;

create trigger product_view_increment after insert on public.product_views for each row execute procedure public.increment_product_views();
