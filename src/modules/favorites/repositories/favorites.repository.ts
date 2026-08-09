import { createClient } from "@/lib/supabase/server";
import type { Favorite } from "@/modules/favorites/types/favorites.types";
import { getPrimaryImageUrl } from "@/modules/product/utils/product-image.util";

export async function toggleFavorite(userId: string, productId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("favorites").select("id").eq("user_id", userId).eq("product_id", productId).single();
  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return false;
  }
  await supabase.from("favorites").insert({ user_id: userId, product_id: productId });
  return true;
}

export async function getFavoritesWithProducts(userId: string): Promise<Array<{ product_id: string; products: { id: string; name: string; slug: string; price: number; currency: string; image_url: string | null } | null }>> {
  const supabase = await createClient();
  const { data } = await supabase.from("favorites").select("product_id, products(id, name, slug, price, currency, product_images(url))").eq("user_id", userId).order("created_at", { ascending: false });
  return (data ?? []).map((item: { product_id: string; products: unknown }) => {
    const products = Array.isArray(item.products) ? item.products[0] : item.products;
    if (!products) return { product_id: item.product_id, products: null };
    const p = products as { id: string; name: string; slug: string; price: number; currency: string; product_images?: { url: string }[] };
    return {
      product_id: item.product_id,
      products: { id: p.id, name: p.name, slug: p.slug, price: p.price, currency: p.currency, image_url: getPrimaryImageUrl(p) ?? null },
    };
  }) as Array<{ product_id: string; products: { id: string; name: string; slug: string; price: number; currency: string; image_url: string | null } | null }>;
}

export async function checkFavoriteStatus(userId: string, productId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.from("favorites").select("id").eq("user_id", userId).eq("product_id", productId).single();
  return !!data;
}
