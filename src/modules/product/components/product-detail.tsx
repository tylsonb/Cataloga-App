import { formatPrice } from "@/modules/shared/utils/format.util";

export function ProductDetail({ name, description, price, currency }: { name: string; description?: string | null; price: number; currency: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="text-2xl font-bold">{formatPrice(price, currency)}</p>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
