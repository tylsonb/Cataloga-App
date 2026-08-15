import { ProductForm } from "@/modules/product/components/product-form";
import { updateProductAction } from "@/modules/product/actions/product.actions";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase.from("businesses").select("id").eq("owner_id", user.id).maybeSingle();
  if (!business) redirect("/negocio/crear");

  const [{ data: product }, { data: images }] = await Promise.all([
    supabase.from("products").select("id, name, description, price, currency, category_id").eq("id", id).eq("business_id", business.id).is("deleted_at", null).maybeSingle(),
    supabase.from("product_images").select("url, alt_text").eq("product_id", id).order("sort_order"),
  ]);
  if (!product) notFound();

  async function submit(formData: FormData) {
    "use server";
    if (!business) return { success: false as const, error: "No se encontró el negocio" };
    const imagesRaw = formData.get("images") as string | null;
    const result = await updateProductAction(id, {
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      price: Number(formData.get("price")),
      currency: formData.get("currency") || "CLP",
      category_id: formData.get("category_id"),
    });
    if (!result.success) return result;

    if (imagesRaw) {
      let parsedImages: { url: string; alt_text: string }[];
      try {
        parsedImages = JSON.parse(imagesRaw) as { url: string; alt_text: string }[];
      } catch {
        parsedImages = [];
      }
      const supabase = await createClient();
      await supabase.from("product_images").delete().eq("product_id", id);
      if (parsedImages.length > 0) {
        const { error: imagesError } = await supabase.from("product_images").insert(
          parsedImages.map((img, i) => ({ product_id: id, url: img.url, alt_text: img.alt_text, sort_order: i }))
        );
        if (imagesError) return { success: false as const, error: "El producto se actualizó, pero no fue posible guardar las imágenes" };
      }
    }

    redirect("/dashboard/productos");
  }

  const { data: categories } = await supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order");

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Editar producto</h1>
      <ProductForm onSubmit={submit} categories={categories ?? []} defaultValues={{ ...product, images: images ?? [] }} />
    </div>
  );
}
