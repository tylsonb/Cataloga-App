"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsappUrl } from "@/modules/shared/utils/whatsapp.util";
import { trackWhatsappClickAction } from "@/modules/analytics/actions/analytics.actions";
import { getSessionId } from "@/modules/analytics/utils/session.util";

export function WhatsAppButton({ phone, productName, productId, businessId }: { phone: string; productName?: string; productId?: string; businessId?: string }) {
  function handleClick() {
    if (productId && businessId) {
      trackWhatsappClickAction(productId, businessId, getSessionId());
    }
  }

  return (
    <a href={buildWhatsappUrl(phone, productName)} target="_blank" rel="noopener noreferrer" onClick={handleClick} className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600">
      <MessageCircle size={20} />
      Contactar por WhatsApp
    </a>
  );
}
