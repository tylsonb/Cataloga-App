import { describe, it, expect } from "vitest";
import { createCategorySchema, updateCategorySchema } from "@/modules/admin/schemas/category.schema";

describe("createCategorySchema", () => {
  it("defaults sort_order to 0", () => {
    const result = createCategorySchema.safeParse({ name: "Comida", slug: "comida" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.sort_order).toBe(0);
  });

  it("accepts an icon and an explicit sort_order", () => {
    const result = createCategorySchema.safeParse({ name: "Comida", slug: "comida", icon: "utensils", sort_order: 3 });
    expect(result.success).toBe(true);
  });

  it("rejects a short name", () => {
    const result = createCategorySchema.safeParse({ name: "C", slug: "comida" });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues[0]?.message).toBe("El nombre es obligatorio");
  });

  it("rejects a short slug", () => {
    const result = createCategorySchema.safeParse({ name: "Comida", slug: "c" });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues[0]?.message).toBe("El slug es obligatorio");
  });

  it("rejects a non-integer sort_order", () => {
    expect(createCategorySchema.safeParse({ name: "Comida", slug: "comida", sort_order: 1.5 }).success).toBe(false);
  });
});

describe("updateCategorySchema", () => {
  it("accepts an empty object without applying defaults", () => {
    const result = updateCategorySchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.success && result.data.sort_order).toBeUndefined();
  });

  it("still validates provided fields", () => {
    expect(updateCategorySchema.safeParse({ slug: "c" }).success).toBe(false);
  });
});
