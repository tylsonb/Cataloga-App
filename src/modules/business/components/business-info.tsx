import { MessageCircle } from "lucide-react";

export function BusinessInfo({ name, whatsapp, city, address, description, schedule }: { name: string; whatsapp: string; city?: string | null; address?: string | null; description?: string | null; schedule?: unknown }) {
  const waNumber = whatsapp.replace(/[^0-9]/g, "");
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">{name}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <a
        href={`https://wa.me/${waNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        Contactar por WhatsApp
      </a>
      {city && <p className="text-sm text-muted-foreground">{city}{address ? `, ${address}` : ""}</p>}
    </div>
  );
}
