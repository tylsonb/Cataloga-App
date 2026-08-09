import { getDashboardStatsAction } from "@/modules/dashboard/actions/get-dashboard-stats.action";
import { StatsCard } from "@/modules/dashboard/components/stats-card";
import { TopProducts } from "@/modules/dashboard/components/top-products";
import { Eye, MessageCircle, Package, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStatsAction();
  if (!stats) return <div className="p-10 text-center text-muted-foreground">No tienes un negocio activo.</div>;
  return (
    <div className="container py-10 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Visitas totales" value={stats.totalViews} icon={Eye} />
        <StatsCard label="Clicks WhatsApp" value={stats.totalWhatsappClicks} icon={MessageCircle} />
        <StatsCard label="Productos" value={stats.totalProducts} icon={Package} />
        <StatsCard label="Favoritos" value={stats.totalFavorites} icon={Heart} />
      </div>
      <TopProducts products={stats.topProducts} />
    </div>
  );
}
