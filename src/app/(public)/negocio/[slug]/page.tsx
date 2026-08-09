import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBusinessBySlugAction } from "@/modules/business/actions/business.actions";
import { getProductsByBusinessAction } from "@/modules/product/actions/product.actions";
import { BusinessInfo } from "@/modules/business/components/business-info";
import { ProductGrid } from "@/modules/product/components/product-grid";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlugAction(slug);
  if (!business) return { title: "Negocio no encontrado" };
  return { title: business.name, description: business.description ?? undefined };
}

export default async function NegocioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlugAction(slug);
  if (!business) notFound();
  const products = await getProductsByBusinessAction(business.id);
  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description ?? undefined,
    telephone: business.whatsapp ?? undefined,
    address: business.city ? { "@type": "PostalAddress", addressLocality: business.city, streetAddress: business.address ?? undefined } : undefined,
    url: `${SITE_URL}/negocio/${slug}`,
  };
  return (
    <section className="container py-10">
      <BusinessInfo name={business.name} whatsapp={business.whatsapp} city={business.city} address={business.address} description={business.description} />
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Productos</h2>
        <ProductGrid products={products as never} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
    </section>
  );
}
