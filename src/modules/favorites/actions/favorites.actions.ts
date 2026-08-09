"use server";

import { createClient } from "@/lib/supabase/server";
import { toggleFavorite, getFavoritesWithProducts, checkFavoriteStatus } from "@/modules/favorites/repositories/favorites.repository";
import type { Result } from "@/modules/shared/types/result.type";

export async function toggleFavoriteAction(productId: string): Promise<Result & { favorited?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No hay sesión activa" };
  try {
    const favorited = await toggleFavorite(user.id, productId);
    return { success: true, favorited };
  } catch {
    return { success: false, error: "No fue posible actualizar tus favoritos" };
  }
}

export async function getFavoritesAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  return getFavoritesWithProducts(user.id);
}

export async function checkFavoriteStatusAction(productId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  return checkFavoriteStatus(user.id, productId);
}
