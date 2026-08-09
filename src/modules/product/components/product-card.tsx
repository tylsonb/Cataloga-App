import Link from "next/link";

export function ProductCard({ name, slug, price, currency, imageUrl }: { name: string; slug: string; price: number; currency: string; imageUrl?: string }) {
  return (
    <Link href={`/producto/${slug}`} className="block overflow-hidden rounded-xl border transition-colors hover:bg-accent">
      <div className="aspect-square bg-secondary">
        {imageUrl && <img src={imageUrl} alt={name} className="h-full w-full object-cover" />}
      </div>
      <div className="p-3">
        <h3 className="font-medium line-clamp-1">{name}</h3>
        <p className="text-sm font-bold">${price.toLocaleString("es-CL")} {currency}</p>
      </div>
    </Link>
  );
}
