import { ProductForm } from "@/modules/product/components/product-form";
import { createProductAction } from "@/modules/product/actions/product.actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { requireOwnedBusiness } from "@/modules/business/utils/owner-guard.util";
import { getActiveCategories } from "@/modules/shared/repositories/category.repository";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const business = await requireOwnedBusiness();

  async function submit(formData: FormData) {
    "use server";
    const imagesRaw = formData.get("images") as string | null;
    const result = await createProductAction({
      business_id: business.id,
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      price: Number(formData.get("price")),
      currency: formData.get("currency") || "CLP",
      category_id: formData.get("category_id"),
    });
    if (!result.success) return result;

    if (imagesRaw) {
      const images = JSON.parse(imagesRaw) as { url: string; alt_text: string }[];
      if (images.length > 0) {
        const supabase = await createClient();
        const { data: product } = await supabase.from("products").select("id").eq("business_id", business.id).order("created_at", { ascending: false }).limit(1).single();
        if (product) {
          await supabase.from("product_images").insert(images.map((img, i) => ({ product_id: product.id, url: img.url, alt_text: img.alt_text, sort_order: i })));
        }
      }
    }

    redirect("/dashboard/productos");
  }

  const categories = await getActiveCategories();

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Nuevo producto</h1>
      <ProductForm onSubmit={submit} categories={categories} />
    </div>
  );
}
