export const CURRENCY_FLAGS: Record<string, string> = {
  CLP: "🇨🇱",
  USD: "🇺🇸",
  EUR: "🇪🇺",
  ARS: "🇦🇷",
  MXN: "🇲🇽",
  COP: "🇨🇴",
  PEN: "🇵🇪",
  VES: "🇻🇪",
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  CLP: "$",
  USD: "US$",
  EUR: "€",
  ARS: "$",
  MXN: "$",
  COP: "$",
  PEN: "S/",
  VES: "Bs.",
};

export function formatPrice(price: number, currency = "CLP", includeFlag = true): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "$";
  const flag = includeFlag && CURRENCY_FLAGS[currency] ? `${CURRENCY_FLAGS[currency]} ` : "";
  const formattedNumber = price.toLocaleString("es-CL");
  return `${flag}${symbol}${formattedNumber} ${currency}`.trim();
}

