"use server";

import { createClient } from "@/lib/supabase/server";

export async function trackProductViewAction(productId: string, sessionId?: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("product_views").insert({ product_id: productId, user_id: user?.id ?? null, session_id: sessionId ?? null });
}

export async function trackWhatsappClickAction(productId: string, businessId: string, sessionId?: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("whatsapp_clicks").insert({ product_id: productId, business_id: businessId, user_id: user?.id ?? null, session_id: sessionId ?? null });
}

export async function trackBusinessViewAction(businessId: string, sessionId?: string): Promise<void> {
  // business_views table not yet in schema — placeholder for future migration
}

export async function trackSearchAction(query: string, resultsCount: number, sessionId?: string): Promise<void> {
  // search_logs table not yet in schema — placeholder for future migration
}
