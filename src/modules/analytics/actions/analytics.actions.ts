"use server";

import { createClient } from "@/lib/supabase/server";
import { logError, logWarn } from "@/lib/logger";

export async function trackProductViewAction(productId: string, sessionId?: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from("product_views").insert({ product_id: productId, user_id: user?.id ?? null, session_id: sessionId ?? null });
  if (error) logError("analytics.trackProductView", error, { productId });
}

export async function trackWhatsappClickAction(productId: string, businessId: string, sessionId?: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from("whatsapp_clicks").insert({ product_id: productId, business_id: businessId, user_id: user?.id ?? null, session_id: sessionId ?? null });
  if (error) logError("analytics.trackWhatsappClick", error, { productId, businessId });
}

export async function trackBusinessViewAction(businessId: string, sessionId?: string): Promise<void> {
  // business_views table not yet in schema — placeholder for future migration
  logWarn("analytics.trackBusinessView", "no-op: business_views table missing", { businessId, sessionId });
}

export async function trackSearchAction(query: string, resultsCount: number, sessionId?: string): Promise<void> {
  // search_logs table not yet in schema — placeholder for future migration
  logWarn("analytics.trackSearch", "no-op: search_logs table missing", { query, resultsCount, sessionId });
}
