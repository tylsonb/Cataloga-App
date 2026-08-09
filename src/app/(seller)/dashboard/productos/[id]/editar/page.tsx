import { ProductForm } from "@/modules/product/components/product-form";
import { updateProductAction } from "@/modules/product/actions/product.actions";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { requireOwnedBusiness } from "@/modules/business/utils/owner-guard.util";
import { getActiveCategories } from "@/modules/shared/repositories/category.repository";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await requireOwnedBusiness();
  const supabase = await createClient();

  const { data: product } = await supabase.from("products").select("id, name, description, price, currency, category_id").eq("id", id).eq("business_id", business.id).is("deleted_at", null).single();
  if (!product) notFound();

  async function submit(formData: FormData) {
    "use server";
    const result = await updateProductAction(id, {
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      price: Number(formData.get("price")),
      currency: formData.get("currency") || "CLP",
      category_id: formData.get("category_id"),
    });
    if (result.success) redirect("/dashboard/productos");
    return result;
  }

  const categories = await getActiveCategories();

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Editar producto</h1>
      <ProductForm onSubmit={submit} categories={categories} defaultValues={product} />
    </div>
  );
}
