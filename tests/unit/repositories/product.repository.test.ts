import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import {
  getProductBySlug,
  getProducts,
  getProductsByBusiness,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductFeatured,
  getProductImages,
} from "@/modules/product/repositories/product.repository";
import { createSupabaseMock, argsOf, type SupabaseMockOptions, type SupabaseMock } from "../helpers/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);

function useSupabase(options: SupabaseMockOptions): SupabaseMock {
  const supabase = createSupabaseMock(options);
  mockedCreateClient.mockResolvedValue(supabase.client as never);
  return supabase;
}

/** `getProducts` & friends attach `image_url`, which is not part of the generated row type. */
const imageUrlOf = (product: unknown) => (product as { image_url?: string }).image_url;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getProductBySlug", () => {
  it("filters by slug and excludes deleted rows", async () => {
    const supabase = useSupabase({ tables: { products: { data: { id: "p1", slug: "silla" } } } });
    const product = await getProductBySlug("silla");
    expect(product).toEqual({ id: "p1", slug: "silla" });
    const query = supabase.queryFor("products");
    expect(argsOf(query, "eq")).toEqual([["slug", "silla"]]);
    expect(argsOf(query, "is")).toEqual([["deleted_at", null]]);
  });

  it("returns null when not found", async () => {
    useSupabase({ tables: { products: { data: null } } });
    await expect(getProductBySlug("missing")).resolves.toBeNull();
  });
});

describe("getProducts", () => {
  it("returns published products with the first image flattened", async () => {
    useSupabase({
      tables: {
        products: {
          data: [
            { id: "p1", product_images: [{ url: "a.png" }, { url: "b.png" }] },
            { id: "p2", product_images: [] },
            { id: "p3" },
          ],
        },
      },
    });
    const products = await getProducts();
    expect(products.map(imageUrlOf)).toEqual(["a.png", undefined, undefined]);
  });

  it("returns an empty array when the query yields no data", async () => {
    useSupabase({ tables: { products: { data: null } } });
    await expect(getProducts()).resolves.toEqual([]);
  });

  it("applies category, business, search, limit and offset filters", async () => {
    const supabase = useSupabase({ tables: { products: { data: [] } } });
    await getProducts({ category_id: "c1", business_id: "b1", search: "silla", limit: 10, offset: 20 });
    const query = supabase.queryFor("products");
    expect(argsOf(query, "eq")).toEqual([["status", "published"], ["category_id", "c1"], ["business_id", "b1"]]);
    expect(argsOf(query, "textSearch")).toEqual([["name", "silla"]]);
    expect(argsOf(query, "limit")).toEqual([[10]]);
    expect(argsOf(query, "range")).toEqual([[20, 29]]);
    expect(argsOf(query, "order")).toEqual([["created_at", { ascending: false }]]);
  });

  it("uses the default page size when paginating without a limit", async () => {
    const supabase = useSupabase({ tables: { products: { data: [] } } });
    await getProducts({ offset: 24 });
    expect(argsOf(supabase.queryFor("products"), "range")).toEqual([[24, 47]]);
  });

  it("skips optional filters when no options are given", async () => {
    const supabase = useSupabase({ tables: { products: { data: [] } } });
    await getProducts();
    const query = supabase.queryFor("products");
    expect(argsOf(query, "textSearch")).toEqual([]);
    expect(argsOf(query, "limit")).toEqual([]);
    expect(argsOf(query, "range")).toEqual([]);
  });
});

describe("getProductsByBusiness", () => {
  it("filters by business and flattens images", async () => {
    const supabase = useSupabase({ tables: { products: { data: [{ id: "p1", product_images: [{ url: "a.png" }] }] } } });
    const products = await getProductsByBusiness("b1");
    expect(imageUrlOf(products[0])).toBe("a.png");
    expect(argsOf(supabase.queryFor("products"), "eq")).toEqual([["business_id", "b1"]]);
  });

  it("returns an empty array when there is no data", async () => {
    useSupabase({ tables: { products: { data: null } } });
    await expect(getProductsByBusiness("b1")).resolves.toEqual([]);
  });
});

describe("getRelatedProducts", () => {
  it("excludes the current product and defaults the limit to 4", async () => {
    const supabase = useSupabase({ tables: { products: { data: [] } } });
    await getRelatedProducts("p1", "c1");
    const query = supabase.queryFor("products");
    expect(argsOf(query, "neq")).toEqual([["id", "p1"]]);
    expect(argsOf(query, "eq")).toEqual([["category_id", "c1"], ["status", "published"]]);
    expect(argsOf(query, "limit")).toEqual([[4]]);
  });

  it("honours an explicit limit", async () => {
    const supabase = useSupabase({ tables: { products: { data: [{ id: "p2", product_images: [{ url: "x.png" }] }] } } });
    const products = await getRelatedProducts("p1", "c1", 8);
    expect(imageUrlOf(products[0])).toBe("x.png");
    expect(argsOf(supabase.queryFor("products"), "limit")).toEqual([[8]]);
  });
});

describe("createProduct", () => {
  it("returns the inserted product", async () => {
    const supabase = useSupabase({ tables: { products: { data: { id: "p1" } } } });
    await expect(createProduct({ name: "Silla" } as never)).resolves.toEqual({ id: "p1" });
    expect(argsOf(supabase.queryFor("products"), "insert")).toEqual([[{ name: "Silla" }]]);
  });

  it("returns null on error", async () => {
    useSupabase({ tables: { products: { data: { id: "p1" }, error: { message: "duplicate" } } } });
    await expect(createProduct({ name: "Silla" } as never)).resolves.toBeNull();
  });
});

describe("updateProduct", () => {
  it("updates by id and returns the product", async () => {
    const supabase = useSupabase({ tables: { products: { data: { id: "p1", name: "Nueva" } } } });
    await expect(updateProduct("p1", { name: "Nueva" } as never)).resolves.toEqual({ id: "p1", name: "Nueva" });
    expect(argsOf(supabase.queryFor("products"), "eq")).toEqual([["id", "p1"]]);
  });

  it("returns null on error", async () => {
    useSupabase({ tables: { products: { data: { id: "p1" }, error: { message: "boom" } } } });
    await expect(updateProduct("p1", {} as never)).resolves.toBeNull();
  });
});

describe("deleteProduct", () => {
  it("soft deletes by setting deleted_at", async () => {
    const supabase = useSupabase({ tables: { products: {} } });
    await deleteProduct("p1");
    const [[payload]] = argsOf(supabase.queryFor("products"), "update") as [[{ deleted_at: string }]];
    expect(Number.isNaN(Date.parse(payload.deleted_at))).toBe(false);
    expect(argsOf(supabase.queryFor("products"), "eq")).toEqual([["id", "p1"]]);
  });
});

describe("toggleProductFeatured", () => {
  it("writes the requested featured flag", async () => {
    const supabase = useSupabase({ tables: { products: {} } });
    await toggleProductFeatured("p1", true);
    expect(argsOf(supabase.queryFor("products"), "update")).toEqual([[{ is_featured: true }]]);
  });

  it("can unset the featured flag", async () => {
    const supabase = useSupabase({ tables: { products: {} } });
    await toggleProductFeatured("p1", false);
    expect(argsOf(supabase.queryFor("products"), "update")).toEqual([[{ is_featured: false }]]);
  });
});

describe("getProductImages", () => {
  it("returns images ordered by sort_order", async () => {
    const supabase = useSupabase({ tables: { product_images: { data: [{ id: "i1" }] } } });
    await expect(getProductImages("p1")).resolves.toEqual([{ id: "i1" }]);
    const query = supabase.queryFor("product_images");
    expect(argsOf(query, "eq")).toEqual([["product_id", "p1"]]);
    expect(argsOf(query, "order")).toEqual([["sort_order"]]);
  });

  it("returns an empty array when there is no data", async () => {
    useSupabase({ tables: { product_images: { data: null } } });
    await expect(getProductImages("p1")).resolves.toEqual([]);
  });
});
