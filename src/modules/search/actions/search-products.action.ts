"use server";

import { searchSchema } from "@/modules/search/schemas/search.schema";
import type { SearchResult } from "@/modules/search/types/search.types";
import { createClient } from "@/lib/supabase/server";

export async function searchProductsAction(input: unknown): Promise<{ items: SearchResult[]; total: number }> {
  const parsed = searchSchema.safeParse(input);
  if (!parsed.success) return { items: [], total: 0 };
  const { q, category_id, city, minPrice, maxPrice, sort, page, pageSize } = parsed.data;
  const supabase = await createClient();
  const businessJoin = city ? "businesses!inner(city)" : "businesses(city)";
  let query = supabase.from("products").select(`id, name, slug, price, currency, status, deleted_at, category_id, business_id, ${businessJoin}, product_images(url)`, { count: "exact" }).eq("status", "published").is("deleted_at", null);
  if (q) {
    const escaped = q.replace(/[%,()]/g, (c) => `\\${c}`);
    query = query.or(`name.ilike.%${escaped}%,description.ilike.%${escaped}%`);
  }
  if (category_id) query = query.eq("category_id", category_id);
  if (city) query = query.eq("businesses.city", city);
  if (minPrice !== undefined) query = query.gte("price", minPrice);
  if (maxPrice !== undefined) query = query.lte("price", maxPrice);
  switch (sort) {
    case "price_asc": query = query.order("price", { ascending: true }); break;
    case "price_desc": query = query.order("price", { ascending: false }); break;
    case "newest": query = query.order("created_at", { ascending: false }); break;
    default: query = query.order("created_at", { ascending: false }); break;
  }
  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1);
  const { data, count } = await query;
  const items: SearchResult[] = (data ?? []).map((p) => {
    const images = (p as Record<string, unknown>).product_images as { url: string }[] | undefined;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      currency: p.currency,
      image_url: images?.[0]?.url,
    };
  });
  return { items, total: count ?? 0 };
}
