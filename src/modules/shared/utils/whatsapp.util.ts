import { WHATSAPP_DEFAULT_MESSAGE } from "@/lib/constants";

export function formatWhatsappNumber(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, "");
  if (clean.length === 9 && clean.startsWith("9")) {
    clean = `56${clean}`;
  }
  return clean;
}

export function buildWhatsappUrl(phone: string, productName?: string): string {
  const message = productName ? `${WHATSAPP_DEFAULT_MESSAGE}: ${productName}` : WHATSAPP_DEFAULT_MESSAGE;
  const cleanPhone = formatWhatsappNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
