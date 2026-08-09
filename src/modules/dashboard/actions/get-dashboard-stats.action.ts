"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { DashboardStats } from "@/modules/dashboard/types/dashboard.types";

export async function getDashboardStatsAction(): Promise<DashboardStats | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();

  const { data: business } = await supabase.from("businesses").select("id").eq("owner_id", user.id).single();
  if (!business) return null;

  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("business_id", business.id).is("deleted_at", null);

  const { data: topProducts } = await supabase.from("products").select("id, name, view_count").eq("business_id", business.id).is("deleted_at", null).order("view_count", { ascending: false }).limit(5);

  const { data: products } = await supabase.from("products").select("id").eq("business_id", business.id).is("deleted_at", null);
  const productIds = (products ?? []).map((p) => p.id);

  let totalViews = 0;
  let totalFavorites = 0;
  let totalWhatsappClicks = 0;
  let viewsTimeline: Array<{ date: string; count: number }> = [];

  if (productIds.length > 0) {
    const { count: viewsCount } = await supabase.from("product_views").select("*", { count: "exact", head: true }).in("product_id", productIds);
    totalViews = viewsCount ?? 0;

    const { count: favCount } = await supabase.from("favorites").select("*", { count: "exact", head: true }).in("product_id", productIds);
    totalFavorites = favCount ?? 0;

    const { count: waCount } = await supabase.from("whatsapp_clicks").select("*", { count: "exact", head: true }).eq("business_id", business.id);
    totalWhatsappClicks = waCount ?? 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: recentViews } = await supabase.from("product_views").select("created_at").in("product_id", productIds).gte("created_at", sevenDaysAgo.toISOString());

    const viewsByDate = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      viewsByDate.set(d.toISOString().split("T")[0] ?? "", 0);
    }
    (recentViews ?? []).forEach((v) => {
      const date = v.created_at.split("T")[0] ?? "";
      if (viewsByDate.has(date)) viewsByDate.set(date, (viewsByDate.get(date) ?? 0) + 1);
    });
    viewsTimeline = Array.from(viewsByDate.entries()).map(([date, count]) => ({ date, count }));
  }

  return {
    totalViews,
    totalWhatsappClicks,
    totalProducts: totalProducts ?? 0,
    totalFavorites,
    topProducts: topProducts ?? [],
    viewsTimeline,
  };
}
