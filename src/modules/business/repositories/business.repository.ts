import { createClient } from "@/lib/supabase/server";
import { dbError, isNoRowsError } from "@/lib/errors";
import type { Business, BusinessInsert, BusinessUpdate } from "@/modules/business/types/business.types";

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("businesses").select("*").eq("slug", slug).single();
  if (error) {
    if (isNoRowsError(error)) return null;
    throw dbError("business.getBusinessBySlug", error, { slug });
  }
  return data;
}

export async function getBusinessByOwner(ownerId: string): Promise<Business | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("businesses").select("*").eq("owner_id", ownerId).single();
  if (error) {
    if (isNoRowsError(error)) return null;
    throw dbError("business.getBusinessByOwner", error, { ownerId });
  }
  return data;
}

export async function createBusiness(input: BusinessInsert): Promise<Business> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("businesses").insert(input).select().single();
  if (error) throw dbError("business.createBusiness", error);
  return data;
}

export async function updateBusiness(id: string, input: BusinessUpdate): Promise<Business> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("businesses").update(input).eq("id", id).select().single();
  if (error) throw dbError("business.updateBusiness", error, { id });
  return data;
}

export async function toggleBusinessStatus(id: string, isActive: boolean): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("businesses").update({ is_active: isActive }).eq("id", id);
  if (error) throw dbError("business.toggleBusinessStatus", error, { id, isActive });
}
