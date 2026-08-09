import { getAdminStatsAction } from "@/modules/admin/actions/admin.actions";
import { AdminStats as AdminStatsComponent } from "@/modules/admin/components/admin-stats";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStatsAction();
  return (
    <div className="container py-10 space-y-8">
      <h1 className="text-3xl font-bold">Panel Admin</h1>
      <AdminStatsComponent stats={stats} />
    </div>
  );
}
