import { createClient } from "@/lib/supabase/server";
import type { Business, BusinessInsert, BusinessUpdate } from "@/modules/business/types/business.types";

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("businesses").select("*").eq("slug", slug).eq("is_active", true).single();
  return data;
}

export async function getBusinessByOwner(ownerId: string): Promise<Business | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("businesses").select("*").eq("owner_id", ownerId).single();
  return data;
}

export async function createBusiness(input: BusinessInsert): Promise<Business | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("businesses").insert(input).select().single();
  if (error) return null;
  return data;
}

export async function updateBusiness(id: string, input: BusinessUpdate): Promise<Business | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("businesses").update(input).eq("id", id).select().single();
  if (error) return null;
  return data;
}

export async function toggleBusinessStatus(id: string, isActive: boolean): Promise<void> {
  const supabase = await createClient();
  await supabase.from("businesses").update({ is_active: isActive }).eq("id", id);
}
