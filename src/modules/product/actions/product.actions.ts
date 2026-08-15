"use server";

import { revalidatePath } from "next/cache";
import { createProductSchema, updateProductSchema } from "@/modules/product/schemas/product.schema";
import { createProduct, updateProduct, deleteProduct, toggleProductFeatured, getProductBySlug, getProducts, getProductsByBusiness, getRelatedProducts } from "@/modules/product/repositories/product.repository";
import { slugify } from "@/modules/shared/utils/slug.util";
import { getCurrentUser, isAdmin, ownsBusiness, ownsProduct } from "@/lib/auth/guards";
import type { Result } from "@/modules/shared/types/result.type";

const FORBIDDEN: Result = { success: false, error: "No autorizado" };

function revalidateProductPaths() {
  revalidatePath("/");
  revalidatePath("/dashboard/productos");
  revalidatePath("/categoria/[slug]", "page");
  revalidatePath("/negocio/[slug]", "page");
  revalidatePath("/producto/[slug]", "page");
  revalidatePath("/buscar");
}

export async function createProductAction(input: unknown): Promise<Result & { productId?: string }> {
  if (!(await getCurrentUser())) return FORBIDDEN;
  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Revisa los datos ingresados" };
  if (!(await ownsBusiness(parsed.data.business_id))) return FORBIDDEN;
  const slug = slugify(parsed.data.name);
  const { is_featured: _isFeatured, ...safeInput } = parsed.data;
  const product = await createProduct({ ...safeInput, slug } as never);
  if (!product) return { success: false, error: "No fue posible crear el producto" };
  revalidateProductPaths();
  return { success: true, productId: product.id };
}

export async function updateProductAction(id: string, input: unknown): Promise<Result> {
  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Revisa los datos ingresados" };
  if (!(await ownsProduct(id)) && !(await isAdmin())) return FORBIDDEN;
  if (parsed.data.business_id && !(await ownsBusiness(parsed.data.business_id))) return FORBIDDEN;
  const { is_featured: _isFeatured, ...safeInput } = parsed.data;
  const product = await updateProduct(id, safeInput as never);
  if (!product) return { success: false, error: "No fue posible actualizar el producto" };
  revalidateProductPaths();
  return { success: true };
}

export async function deleteProductAction(id: string): Promise<Result> {
  if (!(await ownsProduct(id)) && !(await isAdmin())) return FORBIDDEN;
  await deleteProduct(id);
  revalidateProductPaths();
  return { success: true };
}

export async function toggleProductFeaturedAction(id: string, isFeatured: boolean): Promise<Result> {
  if (!(await isAdmin())) return FORBIDDEN;
  await toggleProductFeatured(id, isFeatured);
  revalidateProductPaths();
  return { success: true };
}

export async function getProductBySlugAction(slug: string) {
  return getProductBySlug(slug);
}

export async function getProductsAction(opts?: Parameters<typeof getProducts>[0]) {
  return getProducts(opts);
}

export async function getProductsByBusinessAction(businessId: string, status?: string) {
  return getProductsByBusiness(businessId, status);
}

export async function getRelatedProductsAction(productId: string, categoryId: string, limit?: number) {
  return getRelatedProducts(productId, categoryId, limit);
}
