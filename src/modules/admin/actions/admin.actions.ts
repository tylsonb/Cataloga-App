"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guards";
import { createCategorySchema, updateCategorySchema } from "@/modules/admin/schemas/category.schema";
import type { Result } from "@/modules/shared/types/result.type";
import type { AdminStats } from "@/modules/admin/types/admin.types";

const FORBIDDEN: Result = { success: false, error: "No autorizado" };

const EXPORTABLE_TABLES = ["profiles", "businesses", "products", "categories", "subcategories"] as const;
type ExportableTable = (typeof EXPORTABLE_TABLES)[number];

function isExportableTable(table: string): table is ExportableTable {
  return (EXPORTABLE_TABLES as readonly string[]).includes(table);
}

export async function getAdminStatsAction(): Promise<AdminStats | null> {
  if (!(await requireAdmin())) return null;
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
  try {
    if (!(await requireAdmin())) return FORBIDDEN;
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").update({ is_active: active, updated_at: new Date().toISOString() }).eq("id", userId);
    if (error) return { success: false, error: "No fue posible actualizar el usuario" };
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch {
    return { success: false, error: "Error en el servidor al actualizar el usuario" };
  }
}

export async function deleteUserAdminAction(userId: string): Promise<Result> {
  try {
    if (!(await requireAdmin())) return FORBIDDEN;
    const supabase = await createClient();
    const { error } = await supabase.rpc("delete_user_by_admin", { target_user_id: userId });
    if (error) return { success: false, error: error.message || "No fue posible eliminar el usuario" };
    revalidatePath("/admin/usuarios");
    revalidatePath("/admin/negocios");
    revalidatePath("/admin/productos");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Error en el servidor al eliminar el usuario" };
  }
}

export async function toggleBusinessStatusAdminAction(businessId: string, active: boolean): Promise<Result> {
  try {
    if (!(await requireAdmin())) return FORBIDDEN;
    const supabase = await createClient();
    const { error } = await supabase.from("businesses").update({ is_active: active }).eq("id", businessId);
    if (error) return { success: false, error: "No fue posible actualizar el negocio" };
    revalidatePath("/admin/negocios");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Error en el servidor al actualizar el negocio" };
  }
}

export async function toggleProductStatusAction(productId: string, status: "published" | "draft"): Promise<Result> {
  try {
    if (!(await requireAdmin())) return FORBIDDEN;
    const supabase = await createClient();
    const { error } = await supabase.from("products").update({ status }).eq("id", productId);
    if (error) return { success: false, error: "No fue posible actualizar el producto" };
    revalidatePath("/admin/productos");
    revalidatePath("/");
    revalidatePath("/dashboard/productos");
    return { success: true };
  } catch {
    return { success: false, error: "Error en el servidor al actualizar el producto" };
  }
}

export async function deleteProductAdminAction(productId: string): Promise<Result> {
  try {
    if (!(await requireAdmin())) return FORBIDDEN;
    const supabase = await createClient();
    const { error } = await supabase.from("products").update({ deleted_at: new Date().toISOString() }).eq("id", productId);
    if (error) return { success: false, error: "No fue posible eliminar el producto" };
    revalidatePath("/admin/productos");
    revalidatePath("/");
    revalidatePath("/dashboard/productos");
    return { success: true };
  } catch {
    return { success: false, error: "Error en el servidor al eliminar el producto" };
  }
}

export async function deleteBusinessAdminAction(businessId: string): Promise<Result> {
  if (!(await requireAdmin())) return FORBIDDEN;
  const supabase = await createClient();
  const { error } = await supabase.from("businesses").update({ is_active: false }).eq("id", businessId);
  if (error) return { success: false, error: "No fue posible desactivar el negocio" };
  revalidatePath("/admin/negocios");
  revalidatePath("/");
  return { success: true };
}

export async function createCategoryAction(input: unknown): Promise<Result> {
  if (!(await requireAdmin())) return FORBIDDEN;
  const parsed = createCategorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Revisa los datos ingresados" };
  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(parsed.data as never);
  if (error) return { success: false, error: "No fue posible crear la categoría" };
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/categoria/[slug]", "page");
  return { success: true };
}

export async function updateCategoryAction(id: string, input: unknown): Promise<Result> {
  if (!(await requireAdmin())) return FORBIDDEN;
  const parsed = updateCategorySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Revisa los datos ingresados" };
  const supabase = await createClient();
  const { error } = await supabase.from("categories").update(parsed.data as never).eq("id", id);
  if (error) return { success: false, error: "No fue posible actualizar la categoría" };
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/categoria/[slug]", "page");
  return { success: true };
}

export async function deleteCategoryAction(id: string): Promise<Result> {
  if (!(await requireAdmin())) return FORBIDDEN;
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: "No fue posible eliminar la categoría" };
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/categoria/[slug]", "page");
  return { success: true };
}

export async function exportDataAction(table: string): Promise<Result & { data?: unknown }> {
  if (!(await requireAdmin())) return FORBIDDEN;
  if (!isExportableTable(table)) return { success: false, error: "Tabla no permitida" };
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*");
  if (error) return { success: false, error: "No fue posible exportar los datos" };
  return { success: true, data };
}
