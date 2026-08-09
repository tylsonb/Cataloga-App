"use server";

import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/modules/shared/types/result.type";
import type { AdminStats } from "@/modules/admin/types/admin.types";

export async function getAdminStatsAction(): Promise<AdminStats | null> {
  const supabase = await createClient();
  const [usersRes, businessesRes, productsRes, publishedRes] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("businesses").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "published").is("deleted_at", null),
  ]);
  return {
    totalUsers: usersRes.count ?? 0,
    totalBusinesses: businessesRes.count ?? 0,
    totalProducts: productsRes.count ?? 0,
    totalPublished: publishedRes.count ?? 0,
  };
}

export async function toggleUserStatusAction(userId: string, active: boolean): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ is_active: active, updated_at: new Date().toISOString() }).eq("id", userId);
  if (error) return { success: false, error: "No fue posible actualizar el usuario" };
  return { success: true };
}

export async function toggleBusinessStatusAdminAction(businessId: string, active: boolean): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("businesses").update({ is_active: active }).eq("id", businessId);
  if (error) return { success: false, error: "No fue posible actualizar el negocio" };
  return { success: true };
}

export async function toggleProductStatusAction(productId: string, status: "published" | "draft"): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ status }).eq("id", productId);
  if (error) return { success: false, error: "No fue posible actualizar el producto" };
  return { success: true };
}

export async function deleteProductAdminAction(productId: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ deleted_at: new Date().toISOString() }).eq("id", productId);
  if (error) return { success: false, error: "No fue posible eliminar el producto" };
  return { success: true };
}

export async function deleteBusinessAdminAction(businessId: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("businesses").update({ is_active: false }).eq("id", businessId);
  if (error) return { success: false, error: "No fue posible desactivar el negocio" };
  return { success: true };
}

export async function createCategoryAction(input: unknown): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(input as never);
  return error ? { success: false, error: "No fue posible crear la categoría" } : { success: true };
}

export async function updateCategoryAction(id: string, input: unknown): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").update(input as never).eq("id", id);
  return error ? { success: false, error: "No fue posible actualizar la categoría" } : { success: true };
}

export async function deleteCategoryAction(id: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  return error ? { success: false, error: "No fue posible eliminar la categoría" } : { success: true };
}

export async function exportDataAction(table: string): Promise<Result & { data?: unknown }> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*");
  if (error) return { success: false, error: "No fue posible exportar los datos" };
  return { success: true, data };
}
