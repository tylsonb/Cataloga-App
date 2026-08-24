-- Admin delete user function with cascade and self-delete protection
create or replace function public.delete_user_by_admin(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  is_caller_admin boolean;
begin
  select exists(select 1 from public.user_roles where user_id = auth.uid() and role = 'admin') into is_caller_admin;
  if not is_caller_admin then
    raise exception 'No autorizado';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'No puedes eliminar tu propia cuenta de administrador';
  end if;

  delete from auth.users where id = target_user_id;
  return true;
end;
$$;
