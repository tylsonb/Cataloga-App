import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import {
  toggleFavorite,
  getFavoritesWithProducts,
  checkFavoriteStatus,
} from "@/modules/favorites/repositories/favorites.repository";
import { createSupabaseMock, argsOf, type SupabaseMockOptions, type SupabaseMock } from "../helpers/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);

function useSupabase(options: SupabaseMockOptions): SupabaseMock {
  const supabase = createSupabaseMock(options);
  mockedCreateClient.mockResolvedValue(supabase.client as never);
  return supabase;
}

const product = (overrides: Record<string, unknown> = {}) => ({
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

describe("toggleFavorite", () => {
  it("deletes the existing favorite and reports it as unfavorited", async () => {
    const supabase = useSupabase({ tables: { favorites: [{ data: { id: "f1" } }, {}] } });
    await expect(toggleFavorite("u1", "p1")).resolves.toBe(false);
    expect(argsOf(supabase.queryFor("favorites", 1), "delete")).toEqual([[]]);
    expect(argsOf(supabase.queryFor("favorites", 1), "eq")).toEqual([["id", "f1"]]);
  });

  it("inserts a favorite when none exists", async () => {
    const supabase = useSupabase({ tables: { favorites: [{ data: null }, {}] } });
    await expect(toggleFavorite("u1", "p1")).resolves.toBe(true);
    expect(argsOf(supabase.queryFor("favorites", 1), "insert")).toEqual([[{ user_id: "u1", product_id: "p1" }]]);
  });

  it("looks the favorite up by user and product", async () => {
    const supabase = useSupabase({ tables: { favorites: [{ data: null }, {}] } });
    await toggleFavorite("u1", "p1");
    expect(argsOf(supabase.queryFor("favorites"), "eq")).toEqual([["user_id", "u1"], ["product_id", "p1"]]);
  });
});

describe("getFavoritesWithProducts", () => {
  it("flattens the first product image", async () => {
    useSupabase({
      tables: {
        favorites: { data: [{ product_id: "p1", products: product({ product_images: [{ url: "a.png" }, { url: "b.png" }] }) }] },
      },
    });
    const favorites = await getFavoritesWithProducts("u1");
    expect(favorites[0]?.products).toEqual({ id: "p1", name: "Silla", slug: "silla", price: 1000, currency: "CLP", image_url: "a.png" });
  });

  it("uses a null image when the product has none", async () => {
    useSupabase({ tables: { favorites: { data: [{ product_id: "p1", products: product({ product_images: [] }) }] } } });
    const favorites = await getFavoritesWithProducts("u1");
    expect(favorites[0]?.products?.image_url).toBeNull();
  });

  it("unwraps a product returned as an array", async () => {
    useSupabase({ tables: { favorites: { data: [{ product_id: "p1", products: [product()] }] } } });
    const favorites = await getFavoritesWithProducts("u1");
    expect(favorites[0]?.products?.name).toBe("Silla");
  });

  it("keeps entries whose product is missing", async () => {
    useSupabase({ tables: { favorites: { data: [{ product_id: "p1", products: null }, { product_id: "p2", products: [] }] } } });
    const favorites = await getFavoritesWithProducts("u1");
    expect(favorites).toEqual([
      { product_id: "p1", products: null },
      { product_id: "p2", products: null },
    ]);
  });

  it("returns an empty array when there is no data", async () => {
    useSupabase({ tables: { favorites: { data: null } } });
    await expect(getFavoritesWithProducts("u1")).resolves.toEqual([]);
  });

  it("filters by user and orders by creation date", async () => {
    const supabase = useSupabase({ tables: { favorites: { data: [] } } });
    await getFavoritesWithProducts("u1");
    const query = supabase.queryFor("favorites");
    expect(argsOf(query, "eq")).toEqual([["user_id", "u1"]]);
    expect(argsOf(query, "order")).toEqual([["created_at", { ascending: false }]]);
  });
});

describe("checkFavoriteStatus", () => {
  it("returns true when a favorite row exists", async () => {
    useSupabase({ tables: { favorites: { data: { id: "f1" } } } });
    await expect(checkFavoriteStatus("u1", "p1")).resolves.toBe(true);
  });

  it("returns false when no row exists", async () => {
    useSupabase({ tables: { favorites: { data: null } } });
    await expect(checkFavoriteStatus("u1", "p1")).resolves.toBe(false);
  });
});
