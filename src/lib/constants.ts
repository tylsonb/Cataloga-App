export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Catáloga";

export const SITE_DESCRIPTION =
  "Catálogo inteligente para encontrar productos y servicios que se venden en grupos de WhatsApp.";

export const MAX_PRODUCT_IMAGES = 5;

export const MAX_IMAGE_SIZE_MB = 5;

export const DEFAULT_PAGE_SIZE = 24;

export const SEARCH_DEBOUNCE_MS = 300;

export const WHATSAPP_DEFAULT_MESSAGE = "Hola, estoy interesado en este producto que vi en Catáloga";

export const CURRENCIES = [
  { code: "CLP", symbol: "$", label: "Peso Chileno", flag: "🇨🇱" },
  { code: "USD", symbol: "US$", label: "Dólar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", label: "Euro", flag: "🇪🇺" },
  { code: "ARS", symbol: "$", label: "Peso Argentino", flag: "🇦🇷" },
  { code: "MXN", symbol: "$", label: "Peso Mexicano", flag: "🇲🇽" },
  { code: "COP", symbol: "$", label: "Peso Colombiano", flag: "🇨🇴" },
  { code: "PEN", symbol: "S/", label: "Sol Peruano", flag: "🇵🇪" },
  { code: "VES", symbol: "Bs.", label: "Bolívar Venezolano", flag: "🇻🇪" },
] as const;
