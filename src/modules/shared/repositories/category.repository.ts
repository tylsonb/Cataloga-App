import { createClient } from "@/lib/supabase/server";

export type CategoryOption = { id: string; name: string };
export type CategoryListItem = CategoryOption & { slug: string; icon: string | null };

export async function getActiveCategories(): Promise<CategoryOption[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order");
  return data ?? [];
}

export async function getActiveCategoriesWithIcon(): Promise<CategoryListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name, slug, icon").eq("is_active", true).order("sort_order");
  return data ?? [];
}
