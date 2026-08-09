import { createClient } from "@/lib/supabase/server";
import { dbError } from "@/lib/errors";
import { ProductsTable } from "@/modules/admin/components/products-table";

export const dynamic = "force-dynamic";

export default async function AdminProductosPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase.from("products").select("id, name, price, status").is("deleted_at", null);
  if (error) throw dbError("admin.productsPage", error);
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Productos</h1>
      <ProductsTable products={products ?? []} />
    </div>
  );
}
