import { describe, it, expect } from "vitest";
import { slugify } from "@/modules/shared/utils/slug.util";
import { formatPrice } from "@/modules/shared/utils/format.util";
import { buildWhatsappUrl } from "@/modules/shared/utils/whatsapp.util";

describe("slugify", () => {
  it("removes accents", () => {
    expect(slugify("Café y Té")).toBe("cafe-y-te");
  });
  it("replaces spaces with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("removes special characters", () => {
    expect(slugify("Hello! @World#")).toBe("hello-world");
  });
});

describe("formatPrice", () => {
  it("formats CLP", () => {
    expect(formatPrice(1500, "CLP")).toBe("$1.500");
  });
  it("formats USD", () => {
    expect(formatPrice(99, "USD")).toBe("US$99");
  });
});

describe("buildWhatsappUrl", () => {
  it("builds correct URL", () => {
    const url = buildWhatsappUrl("+56912345678", "Test Product");
    expect(url).toContain("wa.me/56912345678");
    expect(url).toContain(encodeURIComponent("Test Product"));
  });
});
