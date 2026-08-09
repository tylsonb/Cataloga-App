"use server";

import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/modules/shared/types/result.type";
import { fail, ok } from "@/modules/shared/utils/result.util";
import type { AdminStats } from "@/modules/admin/types/admin.types";

async function updateRow(table: string, id: string, values: Record<string, unknown>, errorMessage: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from(table).update(values as never).eq("id", id);
  return error ? fail(errorMessage) : ok();
}

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
  return updateRow("profiles", userId, { is_active: active, updated_at: new Date().toISOString() }, "No fue posible actualizar el usuario");
}

export async function toggleBusinessStatusAdminAction(businessId: string, active: boolean): Promise<Result> {
  return updateRow("businesses", businessId, { is_active: active }, "No fue posible actualizar el negocio");
}

export async function toggleProductStatusAction(productId: string, status: "published" | "draft"): Promise<Result> {
  return updateRow("products", productId, { status }, "No fue posible actualizar el producto");
}

export async function deleteProductAdminAction(productId: string): Promise<Result> {
  return updateRow("products", productId, { deleted_at: new Date().toISOString() }, "No fue posible eliminar el producto");
}

export async function deleteBusinessAdminAction(businessId: string): Promise<Result> {
  return updateRow("businesses", businessId, { is_active: false }, "No fue posible desactivar el negocio");
}

export async function createCategoryAction(input: unknown): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(input as never);
  return error ? fail("No fue posible crear la categoría") : ok();
}

export async function updateCategoryAction(id: string, input: unknown): Promise<Result> {
  return updateRow("categories", id, input as Record<string, unknown>, "No fue posible actualizar la categoría");
}

export async function deleteCategoryAction(id: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  return error ? fail("No fue posible eliminar la categoría") : ok();
}

export async function exportDataAction(table: string): Promise<Result & { data?: unknown }> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*");
  if (error) return fail("No fue posible exportar los datos");
  return { success: true, data };
}
