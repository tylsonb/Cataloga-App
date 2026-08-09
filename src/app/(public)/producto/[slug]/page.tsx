import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlugAction, getRelatedProductsAction } from "@/modules/product/actions/product.actions";
import { ProductGallery } from "@/modules/product/components/product-gallery";
import { ProductDetail } from "@/modules/product/components/product-detail";
import { ProductRelated } from "@/modules/product/components/product-related";
import { WhatsAppButton } from "@/modules/shared/components/whatsapp-button";
import { FavoriteButton } from "@/modules/favorites/components/favorite-button";
import { ShareButton } from "@/modules/shared/components/share-button";
import { Breadcrumb } from "@/modules/shared/components/breadcrumb";
import { ProductViewTracker } from "@/modules/analytics/components/product-view-tracker";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/constants";
import { serializeJsonLd } from "@/lib/json-ld";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description ?? `${product.name} — $${product.price.toLocaleString("es-CL")}`,
    openGraph: {
      title: product.name,
      description: product.description ?? `${product.name} — $${product.price.toLocaleString("es-CL")}`,
      images: [`${SITE_URL}/api/og/${slug}`],
    },
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);
  if (!product) notFound();

  const supabase = await createClient();
  const [{ data: business }, { data: images }] = await Promise.all([
    supabase.from("businesses").select("name, slug, whatsapp, city").eq("id", product.business_id).single(),
    supabase.from("product_images").select("url, alt_text").eq("product_id", product.id).order("sort_order"),
  ]);

  const related = await getRelatedProductsAction(product.id, product.category_id);
  const productUrl = `${SITE_URL}/producto/${slug}`;

  return (
    <section className="container py-10">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: business?.name ?? "Negocio", href: `/negocio/${business?.slug}` }, { label: product.name }]} />
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <ProductGallery images={images ?? []} />
        <div className="space-y-6">
          <ProductDetail name={product.name} description={product.description} price={product.price} currency={product.currency} />
          {business && <p className="text-sm text-muted-foreground">Vendido por <a href={`/negocio/${business.slug}`} className="text-primary hover:underline">{business.name}</a>{business.city && ` — ${business.city}`}</p>}
          <div className="flex flex-wrap gap-3">
            {business?.whatsapp && <WhatsAppButton phone={business.whatsapp} productName={product.name} productId={product.id} businessId={product.business_id} />}
            <FavoriteButton productId={product.id} />
            <ShareButton url={productUrl} title={product.name} />
          </div>
        </div>
      </div>
      <div className="mt-12">
        <ProductRelated products={related as never} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({ "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description ?? undefined, offers: { "@type": "Offer", price: product.price, priceCurrency: product.currency, availability: product.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" }, brand: { "@type": "Brand", name: business?.name ?? "Catáloga" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: business?.name ?? "Negocio", item: `${SITE_URL}/negocio/${business?.slug}` }, { "@type": "ListItem", position: 3, name: product.name, item: productUrl }] }) }} />
      <ProductViewTracker productId={product.id} />
    </section>
  );
}
