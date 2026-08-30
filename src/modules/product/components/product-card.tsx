import Link from "next/link";
import { formatPrice } from "@/modules/shared/utils/format.util";

type CategoryColor = "peach" | "mint" | "lilac" | "lemon";

const categoryColors: Record<string, CategoryColor> = {
  "alimentos": "peach",
  "moda": "mint",
  "tecnologia": "lilac",
  "hogar": "lilac",
  "ofertas": "lemon",
  "novedades": "lemon",
};

export function ProductCard({ name, slug, price, currency, imageUrl, category }: { name: string; slug: string; price: number; currency: string; imageUrl?: string; category?: string }) {
  const catColor = category ? categoryColors[category.toLowerCase()] : undefined;
  const bgColor = catColor ? `bg-category-${catColor}` : "bg-secondary";

  return (
    <Link href={`/producto/${slug}`} className="block overflow-hidden rounded-xl border shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
      <div className={`aspect-square ${bgColor}`}>
        {imageUrl && <img src={imageUrl} alt={name} className="h-full w-full object-cover" />}
      </div>
      <div className="p-4">
        <h3 className="font-medium line-clamp-1">{name}</h3>
        <p className="text-sm font-bold mt-1">{formatPrice(price, currency)}</p>
      </div>
    </Link>
  );
}
