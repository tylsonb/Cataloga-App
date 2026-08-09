import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { searchProductsAction } from "@/modules/search/actions/search-products.action";
import { createSupabaseMock, argsOf, type SupabaseMockOptions, type SupabaseMock } from "../helpers/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const validUuid = "550e8400-e29b-41d4-a716-446655440000";

function useSupabase(options: SupabaseMockOptions = {}): SupabaseMock {
  const supabase = createSupabaseMock(options);
  mockedCreateClient.mockResolvedValue(supabase.client as never);
  return supabase;
}

const row = (overrides: Record<string, unknown> = {}) => ({
  id: "p1",
  name: "Silla",
  slug: "silla",
  price: 1000,
  currency: "CLP",
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("searchProductsAction", () => {
  it("returns an empty result for invalid input", async () => {
    const supabase = useSupabase();
    await expect(searchProductsAction({ page: 0 })).resolves.toEqual({ items: [], total: 0 });
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("maps rows to search results with the first image", async () => {
    useSupabase({
      tables: {
        products: { data: [row({ product_images: [{ url: "a.png" }, { url: "b.png" }] }), row({ id: "p2" })], count: 2 },
      },
    });
    await expect(searchProductsAction({})).resolves.toEqual({
      items: [
        { id: "p1", name: "Silla", slug: "silla", price: 1000, currency: "CLP", image_url: "a.png" },
        { id: "p2", name: "Silla", slug: "silla", price: 1000, currency: "CLP", image_url: undefined },
      ],
      total: 2,
    });
  });

  it("defaults the total to 0 when no count comes back", async () => {
    useSupabase({ tables: { products: { data: null, count: null } } });
    await expect(searchProductsAction({})).resolves.toEqual({ items: [], total: 0 });
  });

  it("applies text, category and price filters", async () => {
    const supabase = useSupabase({ tables: { products: { data: [] } } });
    await searchProductsAction({ q: "silla", category_id: validUuid, minPrice: 100, maxPrice: 500 });
    const query = supabase.queryFor("products");
    expect(argsOf(query, "textSearch")).toEqual([["name", "silla"]]);
    expect(argsOf(query, "eq")).toEqual([["status", "published"], ["category_id", validUuid]]);
    expect(argsOf(query, "gte")).toEqual([["price", 100]]);
    expect(argsOf(query, "lte")).toEqual([["price", 500]]);
  });

  it("keeps a zero minPrice filter", async () => {
    const supabase = useSupabase({ tables: { products: { data: [] } } });
    await searchProductsAction({ minPrice: 0 });
    expect(argsOf(supabase.queryFor("products"), "gte")).toEqual([["price", 0]]);
  });

  it("orders by created_at for the default sort", async () => {
    const supabase = useSupabase({ tables: { products: { data: [] } } });
    await searchProductsAction({});
    expect(argsOf(supabase.queryFor("products"), "order")).toEqual([["created_at", { ascending: false }]]);
  });

  it("orders by price for price sorts", async () => {
    const asc = useSupabase({ tables: { products: { data: [] } } });
    await searchProductsAction({ sort: "price_asc" });
    expect(argsOf(asc.queryFor("products"), "order")).toEqual([["price", { ascending: true }]]);

    const desc = useSupabase({ tables: { products: { data: [] } } });
    await searchProductsAction({ sort: "price_desc" });
    expect(argsOf(desc.queryFor("products"), "order")).toEqual([["price", { ascending: false }]]);
  });

  it("does not order when sorting by relevance", async () => {
    const supabase = useSupabase({ tables: { products: { data: [] } } });
    await searchProductsAction({ sort: "relevance" });
    expect(argsOf(supabase.queryFor("products"), "order")).toEqual([]);
  });

  it("translates page and pageSize into a range", async () => {
    const supabase = useSupabase({ tables: { products: { data: [] } } });
    await searchProductsAction({ page: 3, pageSize: 10 });
    expect(argsOf(supabase.queryFor("products"), "range")).toEqual([[20, 29]]);
  });
});
