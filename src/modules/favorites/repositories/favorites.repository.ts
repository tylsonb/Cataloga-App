import { createClient } from "@/lib/supabase/server";
import { dbError, isNoRowsError } from "@/lib/errors";

export async function toggleFavorite(userId: string, productId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: existing, error: selectError } = await supabase.from("favorites").select("id").eq("user_id", userId).eq("product_id", productId).single();
  if (selectError && !isNoRowsError(selectError)) throw dbError("favorites.toggleFavorite.select", selectError, { userId, productId });
  if (existing) {
    const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
    if (error) throw dbError("favorites.toggleFavorite.delete", error, { userId, productId });
    return false;
  }
  const { error } = await supabase.from("favorites").insert({ user_id: userId, product_id: productId });
  if (error) throw dbError("favorites.toggleFavorite.insert", error, { userId, productId });
  return true;
}

export async function getFavoritesWithProducts(userId: string): Promise<Array<{ product_id: string; products: { id: string; name: string; slug: string; price: number; currency: string; image_url: string | null } | null }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("favorites").select("product_id, products(id, name, slug, price, currency, product_images(url))").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw dbError("favorites.getFavoritesWithProducts", error, { userId });
  return (data ?? []).map((item: { product_id: string; products: unknown }) => {
    const products = Array.isArray(item.products) ? item.products[0] : item.products;
    if (!products) return { product_id: item.product_id, products: null };
    const p = products as { id: string; name: string; slug: string; price: number; currency: string; product_images?: { url: string }[] };
    const images = p.product_images as { url: string }[] | undefined;
    return {
      product_id: item.product_id,
      products: { id: p.id, name: p.name, slug: p.slug, price: p.price, currency: p.currency, image_url: images?.[0]?.url ?? null },
    };
  }) as Array<{ product_id: string; products: { id: string; name: string; slug: string; price: number; currency: string; image_url: string | null } | null }>;
}

export async function checkFavoriteStatus(userId: string, productId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("favorites").select("id").eq("user_id", userId).eq("product_id", productId).single();
  if (error) {
    if (isNoRowsError(error)) return false;
    throw dbError("favorites.checkFavoriteStatus", error, { userId, productId });
  }
  return !!data;
}
