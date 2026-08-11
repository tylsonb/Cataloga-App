import { ProductForm } from "@/modules/product/components/product-form";
import { createProductAction } from "@/modules/product/actions/product.actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase.from("businesses").select("id").eq("owner_id", user.id).single();
  if (!business) redirect("/negocio/crear");

  async function submit(formData: FormData) {
    "use server";
    if (!business) return { success: false as const, error: "No se encontró el negocio" };
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

    if (imagesRaw && result.productId) {
      let images: { url: string; alt_text: string }[];
      try {
        images = JSON.parse(imagesRaw) as { url: string; alt_text: string }[];
      } catch {
        images = [];
      }
      if (images.length > 0) {
        const supabase = await createClient();
        const { error: imagesError } = await supabase.from("product_images").insert(images.map((img, i) => ({ product_id: result.productId, url: img.url, alt_text: img.alt_text, sort_order: i })));
        if (imagesError) return { success: false as const, error: "El producto se creó, pero no fue posible guardar las imágenes" };
      }
    }

    redirect("/dashboard/productos");
  }

  const { data: categories } = await supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order");

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Nuevo producto</h1>
      <ProductForm onSubmit={submit} categories={categories ?? []} />
    </div>
  );
}
