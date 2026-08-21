export function formatPrice(price: number, currency = "CLP"): string {
  const symbols: Record<string, string> = { CLP: "$", USD: "US$", EUR: "€", ARS: "$", MXN: "$", COP: "$", PEN: "S/", VES: "Bs." };
  const symbol = symbols[currency] ?? "$";
  return `${symbol}${price.toLocaleString("es-CL")}`;
}
