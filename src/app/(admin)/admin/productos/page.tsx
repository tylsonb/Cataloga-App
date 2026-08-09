import { createClient } from "@/lib/supabase/server";
import { ProductsTable } from "@/modules/admin/components/products-table";

export const dynamic = "force-dynamic";

export default async function AdminProductosPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("id, name, price, status").is("deleted_at", null);
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Productos</h1>
      <ProductsTable products={products ?? []} />
    </div>
  );
}
