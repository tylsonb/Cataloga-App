import { describe, it, expect } from "vitest";
import { createBusinessSchema, updateBusinessSchema } from "@/modules/business/schemas/business.schema";

const validUuid = "550e8400-e29b-41d4-a716-446655440000";
const validInput = { name: "Mi Negocio", whatsapp: "+56912345678" };

describe("createBusinessSchema", () => {
  it("accepts the minimum required fields", () => {
    expect(createBusinessSchema.safeParse(validInput).success).toBe(true);
  });

  it("accepts every optional field", () => {
    const result = createBusinessSchema.safeParse({
      ...validInput,
      description: "Venta de productos",
      category_id: validUuid,
      address: "Calle 123",
      city: "Santiago",
      commune: "Providencia",
      instagram: "https://instagram.com/negocio",
      facebook: "https://facebook.com/negocio",
      logo_url: "https://cdn.test/logo.png",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 chars", () => {
    const result = createBusinessSchema.safeParse({ ...validInput, name: "A" });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues[0]?.message).toBe("El nombre del negocio es obligatorio");
  });

  it("rejects a whatsapp number shorter than 8 chars", () => {
    const result = createBusinessSchema.safeParse({ ...validInput, whatsapp: "1234" });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues[0]?.message).toBe("Ingresa un número de WhatsApp válido");
  });

  it("requires whatsapp", () => {
    expect(createBusinessSchema.safeParse({ name: "Mi Negocio" }).success).toBe(false);
  });

  it("rejects a non-uuid category_id", () => {
    expect(createBusinessSchema.safeParse({ ...validInput, category_id: "abc" }).success).toBe(false);
  });

  it("accepts empty strings for social and logo urls", () => {
    const result = createBusinessSchema.safeParse({ ...validInput, instagram: "", facebook: "", logo_url: "" });
    expect(result.success).toBe(true);
  });

  it("rejects malformed urls", () => {
    expect(createBusinessSchema.safeParse({ ...validInput, instagram: "instagram.com" }).success).toBe(false);
    expect(createBusinessSchema.safeParse({ ...validInput, logo_url: "not-a-url" }).success).toBe(false);
  });
});

describe("updateBusinessSchema", () => {
  it("accepts an empty object", () => {
    expect(updateBusinessSchema.safeParse({}).success).toBe(true);
  });

  it("accepts a partial update", () => {
    expect(updateBusinessSchema.safeParse({ city: "Valparaíso" }).success).toBe(true);
  });

  it("still validates provided fields", () => {
    expect(updateBusinessSchema.safeParse({ name: "A" }).success).toBe(false);
    expect(updateBusinessSchema.safeParse({ whatsapp: "123" }).success).toBe(false);
  });
});
