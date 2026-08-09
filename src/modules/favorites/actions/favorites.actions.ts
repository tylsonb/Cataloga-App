"use server";

import { getCurrentUser } from "@/lib/supabase/auth";
import { toggleFavorite, getFavoritesWithProducts, checkFavoriteStatus } from "@/modules/favorites/repositories/favorites.repository";
import type { Result } from "@/modules/shared/types/result.type";
import { ERROR_NO_SESSION, fail } from "@/modules/shared/utils/result.util";

export async function toggleFavoriteAction(productId: string): Promise<Result & { favorited?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return fail(ERROR_NO_SESSION);
  const favorited = await toggleFavorite(user.id, productId);
  return { success: true, favorited };
}

export async function getFavoritesAction() {
  const user = await getCurrentUser();
  if (!user) return [];
  return getFavoritesWithProducts(user.id);
}

export async function checkFavoriteStatusAction(productId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return checkFavoriteStatus(user.id, productId);
}
