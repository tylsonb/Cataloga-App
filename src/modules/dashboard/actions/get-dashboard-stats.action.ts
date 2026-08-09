"use server";

import { createClient } from "@/lib/supabase/server";
import { dbError, isNoRowsError } from "@/lib/errors";
import type { DashboardStats } from "@/modules/dashboard/types/dashboard.types";

export async function getDashboardStatsAction(): Promise<DashboardStats | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: business, error: businessError } = await supabase.from("businesses").select("id").eq("owner_id", user.id).single();
  if (businessError) {
    if (isNoRowsError(businessError)) return null;
    throw dbError("dashboard.getStats.business", businessError, { userId: user.id });
  }

  const { count: totalProducts, error: totalProductsError } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("business_id", business.id).is("deleted_at", null);
  if (totalProductsError) throw dbError("dashboard.getStats.totalProducts", totalProductsError, { businessId: business.id });

  const { data: topProducts, error: topProductsError } = await supabase.from("products").select("id, name, view_count").eq("business_id", business.id).is("deleted_at", null).order("view_count", { ascending: false }).limit(5);
  if (topProductsError) throw dbError("dashboard.getStats.topProducts", topProductsError, { businessId: business.id });

  const { data: products, error: productsError } = await supabase.from("products").select("id").eq("business_id", business.id).is("deleted_at", null);
  if (productsError) throw dbError("dashboard.getStats.products", productsError, { businessId: business.id });
  const productIds = (products ?? []).map((p) => p.id);

  let totalViews = 0;
  let totalFavorites = 0;
  let totalWhatsappClicks = 0;
  let viewsTimeline: Array<{ date: string; count: number }> = [];

  if (productIds.length > 0) {
    const { count: viewsCount, error: viewsError } = await supabase.from("product_views").select("*", { count: "exact", head: true }).in("product_id", productIds);
    if (viewsError) throw dbError("dashboard.getStats.views", viewsError, { businessId: business.id });
    totalViews = viewsCount ?? 0;

    const { count: favCount, error: favError } = await supabase.from("favorites").select("*", { count: "exact", head: true }).in("product_id", productIds);
    if (favError) throw dbError("dashboard.getStats.favorites", favError, { businessId: business.id });
    totalFavorites = favCount ?? 0;

    const { count: waCount, error: waError } = await supabase.from("whatsapp_clicks").select("*", { count: "exact", head: true }).eq("business_id", business.id);
    if (waError) throw dbError("dashboard.getStats.whatsappClicks", waError, { businessId: business.id });
    totalWhatsappClicks = waCount ?? 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: recentViews, error: recentViewsError } = await supabase.from("product_views").select("created_at").in("product_id", productIds).gte("created_at", sevenDaysAgo.toISOString());
    if (recentViewsError) throw dbError("dashboard.getStats.recentViews", recentViewsError, { businessId: business.id });

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
