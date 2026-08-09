import { createClient } from "@/lib/supabase/server";
import { dbError } from "@/lib/errors";
import { UsersTable } from "@/modules/admin/components/users-table";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const supabase = await createClient();
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("id, email, full_name, created_at, is_active");
  if (profilesError) throw dbError("admin.usersPage.profiles", profilesError);
  const { data: roles, error: rolesError } = await supabase.from("user_roles").select("user_id, role");
  if (rolesError) throw dbError("admin.usersPage.roles", rolesError);
  const roleMap = new Map((roles ?? []).map((r) => [r.user_id, r.role]));
  const users = (profiles ?? []).map((p) => ({ ...p, role: roleMap.get(p.id) ?? "buyer" }));
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Usuarios</h1>
      <UsersTable users={users} />
    </div>
  );
}
