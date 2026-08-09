import { ProductCard } from "./product-card";

export function ProductRelated({ products }: { products: Array<{ name: string; slug: string; price: number; currency: string; image_url?: string }> }) {
  if (!products.length) return null;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Productos relacionados</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((p) => <ProductCard key={p.slug} name={p.name} slug={p.slug} price={p.price} currency={p.currency} imageUrl={p.image_url} />)}
      </div>
    </div>
  );
}
