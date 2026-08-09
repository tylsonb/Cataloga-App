import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductsAction } from "@/modules/product/actions/product.actions";
import { ProductGrid } from "@/modules/product/components/product-grid";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name, icon").eq("slug", slug).eq("is_active", true).single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Categoría no encontrada" };
  return { title: category.name, description: `Productos en ${category.name}` };
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsAction({ category_id: category.id, limit: 24 });

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">{category.icon && <span className="mr-2">{category.icon}</span>}{category.name}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{products.length} producto{products.length !== 1 && "s"}</p>
      <div className="mt-8">
        <ProductGrid products={products as never} />
      </div>
    </section>
  );
}
