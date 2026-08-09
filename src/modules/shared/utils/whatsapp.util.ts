import { WHATSAPP_DEFAULT_MESSAGE } from "@/lib/constants";

export function buildWhatsappUrl(phone: string, productName?: string): string {
  const message = productName ? `${WHATSAPP_DEFAULT_MESSAGE}: ${productName}` : WHATSAPP_DEFAULT_MESSAGE;
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
