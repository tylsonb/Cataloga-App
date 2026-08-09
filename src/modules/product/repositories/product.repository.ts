import { createClient } from "@/lib/supabase/server";
import { dbError, isNoRowsError } from "@/lib/errors";
import type { Product, ProductInsert, ProductUpdate, ProductImage } from "@/modules/product/types/product.types";

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).is("deleted_at", null).single();
  if (error) {
    if (isNoRowsError(error)) return null;
    throw dbError("product.getProductBySlug", error, { slug });
  }
  return data;
}

export async function getProducts(opts?: { category_id?: string; business_id?: string; limit?: number; offset?: number; search?: string }): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*, product_images(url)").eq("status", "published").is("deleted_at", null);
  if (opts?.category_id) query = query.eq("category_id", opts.category_id);
  if (opts?.business_id) query = query.eq("business_id", opts.business_id);
  if (opts?.search) query = query.textSearch("name", opts.search);
  if (opts?.limit) query = query.limit(opts.limit);
  if (opts?.offset) query = query.range(opts.offset, opts.offset + (opts.limit ?? 24) - 1);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw dbError("product.getProducts", error, { category_id: opts?.category_id, business_id: opts?.business_id });
  return (data ?? []).map((p) => {
    const images = (p as Record<string, unknown>).product_images as { url: string }[] | undefined;
    return { ...p, image_url: images?.[0]?.url } as Product;
  });
}

export async function getProductsByBusiness(businessId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*, product_images(url)").eq("business_id", businessId).is("deleted_at", null).order("created_at", { ascending: false });
  if (error) throw dbError("product.getProductsByBusiness", error, { businessId });
  return (data ?? []).map((p) => {
    const images = (p as Record<string, unknown>).product_images as { url: string }[] | undefined;
    return { ...p, image_url: images?.[0]?.url } as Product;
  });
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*, product_images(url)").eq("category_id", categoryId).neq("id", productId).eq("status", "published").is("deleted_at", null).limit(limit);
  if (error) throw dbError("product.getRelatedProducts", error, { productId, categoryId });
  return (data ?? []).map((p) => {
    const images = (p as Record<string, unknown>).product_images as { url: string }[] | undefined;
    return { ...p, image_url: images?.[0]?.url } as Product;
  });
}

export async function createProduct(input: ProductInsert): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").insert(input).select().single();
  if (error) throw dbError("product.createProduct", error);
  return data;
}

export async function updateProduct(id: string, input: ProductUpdate): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").update(input).eq("id", id).select().single();
  if (error) throw dbError("product.updateProduct", error, { id });
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw dbError("product.deleteProduct", error, { id });
}

export async function toggleProductFeatured(id: string, isFeatured: boolean): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ is_featured: isFeatured }).eq("id", id);
  if (error) throw dbError("product.toggleProductFeatured", error, { id, isFeatured });
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_images").select("*").eq("product_id", productId).order("sort_order");
  if (error) throw dbError("product.getProductImages", error, { productId });
  return data ?? [];
}
