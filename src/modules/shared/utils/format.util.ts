import { CURRENCIES } from "@/lib/constants";

const CURRENCY_SYMBOLS: Record<string, string> = Object.fromEntries(CURRENCIES.map((c) => [c.code, c.symbol]));

export function formatPrice(price: number, currency = "CLP"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "$";
  return `${symbol}${price.toLocaleString("es-CL")}`;
}
