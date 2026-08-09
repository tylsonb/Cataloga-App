import { StatsCard } from "@/modules/dashboard/components/stats-card";
import { Users, Store, Package, CheckCircle } from "lucide-react";
import type { AdminStats } from "@/modules/admin/types/admin.types";

export function AdminStats({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard label="Usuarios" value={stats.totalUsers} icon={Users} />
      <StatsCard label="Negocios" value={stats.totalBusinesses} icon={Store} />
      <StatsCard label="Productos" value={stats.totalProducts} icon={Package} />
      <StatsCard label="Publicados" value={stats.totalPublished} icon={CheckCircle} />
    </div>
  );
}
