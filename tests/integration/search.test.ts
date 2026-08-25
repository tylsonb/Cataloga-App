import { describe, it, expect } from "vitest";
import { buildWhatsappUrl } from "@/modules/shared/utils/whatsapp.util";
import { slugify } from "@/modules/shared/utils/slug.util";
import { formatPrice } from "@/modules/shared/utils/format.util";

describe("search integration — buildWhatsappUrl", () => {
  it("builds URL with product name", () => {
    const url = buildWhatsappUrl("+56912345678", "Soporte Técnico");
    expect(url).toContain("wa.me/56912345678");
    expect(url).toContain(encodeURIComponent("Soporte Técnico"));
  });

  it("builds URL without product name", () => {
    const url = buildWhatsappUrl("+56912345678");
    expect(url).toContain("wa.me/56912345678");
    expect(url).toContain("text=");
  });

  it("strips non-numeric characters from phone", () => {
    const url = buildWhatsappUrl("+56 (9) 1234-5678", "Test");
    expect(url).toContain("wa.me/56912345678");
  });

  it("handles empty phone string", () => {
    const url = buildWhatsappUrl("", "Test");
    expect(url).toContain("wa.me/");
  });

  it("encodes special characters in product name", () => {
    const url = buildWhatsappUrl("56912345678", "Café & Té");
    expect(url).toContain(encodeURIComponent("Café & Té"));
  });
});

describe("search integration — slugify for search URLs", () => {
  it("normalizes accented characters for category slugs", () => {
    expect(slugify("Alimentos y Bebidas")).toBe("alimentos-y-bebidas");
  });

  it("normalizes mixed case", () => {
    expect(slugify("MoDa y CaLzAdO")).toBe("moda-y-calzado");
  });

  it("handles category names with numbers", () => {
    expect(slugify("Tecnología 2024")).toBe("tecnologia-2024");
  });
});

describe("search integration — formatPrice for search results", () => {
  it("formats CLP consistently", () => {
    expect(formatPrice(9990, "CLP")).toBe("🇨🇱 $9.990 CLP");
  });

  it("formats USD with US$ prefix", () => {
    expect(formatPrice(25, "USD")).toBe("🇺🇸 US$25 USD");
  });
});
