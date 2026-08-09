import { describe, it, expect } from "vitest";
import { createProductSchema, updateProductSchema } from "@/modules/product/schemas/product.schema";
import { slugify } from "@/modules/shared/utils/slug.util";
import { formatPrice } from "@/modules/shared/utils/format.util";

const validUuid = "550e8400-e29b-41d4-a716-446655440000";

describe("product integration — createProductSchema", () => {
  it("accepts valid product input", () => {
    const result = createProductSchema.safeParse({
      business_id: validUuid,
      name: "Soporte Técnico",
      price: 15000,
      currency: "CLP",
      category_id: validUuid,
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = createProductSchema.safeParse({
      business_id: validUuid,
      name: "A",
      price: 100,
      category_id: validUuid,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = createProductSchema.safeParse({
      business_id: validUuid,
      name: "Test Product",
      price: -1,
      category_id: validUuid,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID for business_id", () => {
    const result = createProductSchema.safeParse({
      business_id: "not-a-uuid",
      name: "Test Product",
      price: 100,
      category_id: validUuid,
    });
    expect(result.success).toBe(false);
  });

  it("accepts draft status", () => {
    const result = createProductSchema.safeParse({
      business_id: validUuid,
      name: "Draft Product",
      price: 0,
      category_id: validUuid,
      status: "draft",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status value", () => {
    const result = createProductSchema.safeParse({
      business_id: validUuid,
      name: "Test Product",
      price: 100,
      category_id: validUuid,
      status: "archived",
    });
    expect(result.success).toBe(false);
  });
});

describe("product integration — updateProductSchema", () => {
  it("accepts partial update with only name", () => {
    const result = updateProductSchema.safeParse({ name: "Updated Name" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object (no fields to update)", () => {
    const result = updateProductSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("product integration — slugify edge cases", () => {
  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles string with only special characters", () => {
    expect(slugify("@#$%")).toBe("");
  });

  it("handles multiple spaces and special chars", () => {
    expect(slugify("  Hello   World!  ")).toBe("hello-world");
  });

  it("handles numbers", () => {
    expect(slugify("Product 2024")).toBe("product-2024");
  });

  it("handles leading and trailing dashes after normalization", () => {
    expect(slugify("---test---")).toBe("test");
  });
});

describe("product integration — formatPrice edge cases", () => {
  it("formats zero CLP", () => {
    expect(formatPrice(0, "CLP")).toBe("$0");
  });

  it("formats large number", () => {
    expect(formatPrice(1000000, "CLP")).toBe("$1.000.000");
  });

  it("formats EUR with euro symbol", () => {
    expect(formatPrice(50, "EUR")).toBe("€50");
  });

  it("formats PEN with sol symbol", () => {
    expect(formatPrice(100, "PEN")).toBe("S/100");
  });

  it("defaults to CLP when no currency provided", () => {
    expect(formatPrice(5000)).toBe("$5.000");
  });

  it("falls back to $ for unknown currency", () => {
    expect(formatPrice(100, "GBP")).toBe("$100");
  });
});
