"use server";

import { createClient } from "@/lib/supabase/server";
import type { DashboardStats } from "@/modules/dashboard/types/dashboard.types";

export async function getDashboardStatsAction(): Promise<DashboardStats | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: business, error: businessError } = await supabase.from("businesses").select("id").eq("owner_id", user.id).single();
  if (businessError || !business) {
    if (businessError && businessError.code !== "PGRST116") console.error("[dashboard.getStats] business lookup failed", businessError);
    return null;
  }

  const { count: totalProducts, error: totalProductsError } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("business_id", business.id).is("deleted_at", null);
  if (totalProductsError) console.error("[dashboard.getStats] totalProducts failed", totalProductsError);

  const { data: topProducts, error: topProductsError } = await supabase.from("products").select("id, name, view_count").eq("business_id", business.id).is("deleted_at", null).order("view_count", { ascending: false }).limit(5);
  if (topProductsError) console.error("[dashboard.getStats] topProducts failed", topProductsError);

  const { data: products, error: productsError } = await supabase.from("products").select("id").eq("business_id", business.id).is("deleted_at", null);
  if (productsError) console.error("[dashboard.getStats] products failed", productsError);
  const productIds = (products ?? []).map((p) => p.id);

  let totalViews = 0;
  let totalFavorites = 0;
  let totalWhatsappClicks = 0;
  let viewsTimeline: Array<{ date: string; count: number }> = [];

  if (productIds.length > 0) {
    const { count: viewsCount, error: viewsError } = await supabase.from("product_views").select("*", { count: "exact", head: true }).in("product_id", productIds);
    if (viewsError) console.error("[dashboard.getStats] views failed", viewsError);
    totalViews = viewsCount ?? 0;

    const { count: favCount, error: favError } = await supabase.from("favorites").select("*", { count: "exact", head: true }).in("product_id", productIds);
    if (favError) console.error("[dashboard.getStats] favorites failed", favError);
    totalFavorites = favCount ?? 0;

    const { count: waCount, error: waError } = await supabase.from("whatsapp_clicks").select("*", { count: "exact", head: true }).eq("business_id", business.id);
    if (waError) console.error("[dashboard.getStats] whatsappClicks failed", waError);
    totalWhatsappClicks = waCount ?? 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: recentViews, error: recentViewsError } = await supabase.from("product_views").select("created_at").in("product_id", productIds).gte("created_at", sevenDaysAgo.toISOString());
    if (recentViewsError) console.error("[dashboard.getStats] recentViews failed", recentViewsError);

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
