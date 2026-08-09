"use server";

import { createProductSchema, updateProductSchema } from "@/modules/product/schemas/product.schema";
import { createProduct, updateProduct, deleteProduct, toggleProductFeatured, getProductBySlug, getProducts, getProductsByBusiness, getRelatedProducts } from "@/modules/product/repositories/product.repository";
import { slugify } from "@/modules/shared/utils/slug.util";
import type { Result } from "@/modules/shared/types/result.type";
import { ERROR_INVALID_INPUT, fail, ok } from "@/modules/shared/utils/result.util";

export async function createProductAction(input: unknown): Promise<Result> {
  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) return fail(ERROR_INVALID_INPUT);
  const slug = slugify(parsed.data.name);
  const product = await createProduct({ ...parsed.data, slug } as never);
  return product ? ok() : fail("No fue posible crear el producto");
}

export async function updateProductAction(id: string, input: unknown): Promise<Result> {
  const parsed = updateProductSchema.safeParse(input);
  if (!parsed.success) return fail(ERROR_INVALID_INPUT);
  const product = await updateProduct(id, parsed.data as never);
  return product ? ok() : fail("No fue posible actualizar el producto");
}

export async function deleteProductAction(id: string): Promise<Result> {
  await deleteProduct(id);
  return ok();
}

export async function toggleProductFeaturedAction(id: string, isFeatured: boolean): Promise<Result> {
  await toggleProductFeatured(id, isFeatured);
  return ok();
}

export async function getProductBySlugAction(slug: string) {
  return getProductBySlug(slug);
}

export async function getProductsAction(opts?: Parameters<typeof getProducts>[0]) {
  return getProducts(opts);
}

export async function getProductsByBusinessAction(businessId: string) {
  return getProductsByBusiness(businessId);
}

export async function getRelatedProductsAction(productId: string, categoryId: string, limit?: number) {
  return getRelatedProducts(productId, categoryId, limit);
}
