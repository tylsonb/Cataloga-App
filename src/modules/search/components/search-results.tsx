import { ProductCard } from "@/modules/product/components/product-card";

export function SearchResults({ results }: { results: Array<{ name: string; slug: string; price: number; currency: string; image_url?: string }> }) {
  if (!results.length) return <p className="text-center text-muted-foreground">No se encontraron productos.</p>;
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{results.map((p) => <ProductCard key={p.slug} name={p.name} slug={p.slug} price={p.price} currency={p.currency} imageUrl={p.image_url} />)}</div>;
}
