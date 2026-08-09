import { describe, it, expect } from "vitest";
import { searchSchema } from "@/modules/search/schemas/search.schema";

const validUuid = "550e8400-e29b-41d4-a716-446655440000";

describe("searchSchema", () => {
  it("applies defaults for sort, page and pageSize", () => {
    const result = searchSchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.success && result.data).toEqual({ sort: "newest", page: 1, pageSize: 24 });
  });

  it("accepts a full query", () => {
    const result = searchSchema.safeParse({
      q: "soporte",
      category_id: validUuid,
      city: "Santiago",
      minPrice: 1000,
      maxPrice: 5000,
      sort: "price_asc",
      page: 2,
      pageSize: 48,
    });
    expect(result.success).toBe(true);
  });

  it("turns an empty category_id into undefined", () => {
    const result = searchSchema.safeParse({ category_id: "" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.category_id).toBeUndefined();
  });

  it("rejects a category_id that is neither empty nor a uuid", () => {
    expect(searchSchema.safeParse({ category_id: "abc" }).success).toBe(false);
  });

  it("rejects negative prices", () => {
    expect(searchSchema.safeParse({ minPrice: -1 }).success).toBe(false);
    expect(searchSchema.safeParse({ maxPrice: -1 }).success).toBe(false);
  });

  it("rejects unknown sort values", () => {
    expect(searchSchema.safeParse({ sort: "cheapest" }).success).toBe(false);
  });

  it("accepts every supported sort value", () => {
    for (const sort of ["relevance", "price_asc", "price_desc", "newest"]) {
      expect(searchSchema.safeParse({ sort }).success).toBe(true);
    }
  });

  it("rejects a page below 1 or non-integer", () => {
    expect(searchSchema.safeParse({ page: 0 }).success).toBe(false);
    expect(searchSchema.safeParse({ page: 1.5 }).success).toBe(false);
  });

  it("rejects a pageSize above 48", () => {
    expect(searchSchema.safeParse({ pageSize: 49 }).success).toBe(false);
    expect(searchSchema.safeParse({ pageSize: 0 }).success).toBe(false);
  });
});
