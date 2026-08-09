import { formatPrice } from "@/modules/shared/utils/format.util";

export function PriceDisplay({ price, currency = "CLP" }: { price: number; currency?: string }) {
  return <span className="font-bold">{formatPrice(price, currency)}</span>;
}
