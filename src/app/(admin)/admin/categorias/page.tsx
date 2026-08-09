import { createClient } from "@/lib/supabase/server";
import { CategoriesManager } from "@/modules/admin/components/categories-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name, slug").order("sort_order");
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Categorías</h1>
      <CategoriesManager categories={categories ?? []} />
    </div>
  );
}
