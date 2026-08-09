import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import {
  getAdminStatsAction,
  toggleUserStatusAction,
  toggleBusinessStatusAdminAction,
  toggleProductStatusAction,
  deleteProductAdminAction,
  deleteBusinessAdminAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  exportDataAction,
} from "@/modules/admin/actions/admin.actions";
import { createSupabaseMock, argsOf, type SupabaseMockOptions, type SupabaseMock } from "../helpers/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);

function useSupabase(options: SupabaseMockOptions = {}): SupabaseMock {
  const supabase = createSupabaseMock(options);
  mockedCreateClient.mockResolvedValue(supabase.client as never);
  return supabase;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getAdminStatsAction", () => {
  it("aggregates the counts of each table", async () => {
    useSupabase({
      tables: {
        profiles: { count: 7 },
        businesses: { count: 3 },
        products: [{ count: 12 }, { count: 9 }],
      },
    });
    await expect(getAdminStatsAction()).resolves.toEqual({
      totalUsers: 7,
      totalBusinesses: 3,
      totalProducts: 12,
      totalPublished: 9,
    });
  });

  it("defaults missing counts to 0", async () => {
    useSupabase({ tables: { profiles: {}, businesses: {}, products: {} } });
    await expect(getAdminStatsAction()).resolves.toEqual({
      totalUsers: 0,
      totalBusinesses: 0,
      totalProducts: 0,
      totalPublished: 0,
    });
  });
});

describe("toggleUserStatusAction", () => {
  it("updates the profile with a fresh timestamp", async () => {
    const supabase = useSupabase({ tables: { profiles: {} } });
    await expect(toggleUserStatusAction("u1", false)).resolves.toEqual({ success: true });
    const [[payload]] = argsOf(supabase.queryFor("profiles"), "update") as [[Record<string, unknown>]];
    expect(payload.is_active).toBe(false);
    expect(Number.isNaN(Date.parse(payload.updated_at as string))).toBe(false);
    expect(argsOf(supabase.queryFor("profiles"), "eq")).toEqual([["id", "u1"]]);
  });

  it("reports a failure", async () => {
    useSupabase({ tables: { profiles: { error: { message: "boom" } } } });
    await expect(toggleUserStatusAction("u1", true)).resolves.toEqual({
      success: false,
      error: "No fue posible actualizar el usuario",
    });
  });
});

describe("toggleBusinessStatusAdminAction", () => {
  it("updates the business active flag", async () => {
    const supabase = useSupabase({ tables: { businesses: {} } });
    await expect(toggleBusinessStatusAdminAction("b1", true)).resolves.toEqual({ success: true });
    expect(argsOf(supabase.queryFor("businesses"), "update")).toEqual([[{ is_active: true }]]);
  });

  it("reports a failure", async () => {
    useSupabase({ tables: { businesses: { error: { message: "boom" } } } });
    await expect(toggleBusinessStatusAdminAction("b1", true)).resolves.toEqual({
      success: false,
      error: "No fue posible actualizar el negocio",
    });
  });
});

describe("toggleProductStatusAction", () => {
  it("writes the requested status", async () => {
    const supabase = useSupabase({ tables: { products: {} } });
    await expect(toggleProductStatusAction("p1", "draft")).resolves.toEqual({ success: true });
    expect(argsOf(supabase.queryFor("products"), "update")).toEqual([[{ status: "draft" }]]);
  });

  it("reports a failure", async () => {
    useSupabase({ tables: { products: { error: { message: "boom" } } } });
    await expect(toggleProductStatusAction("p1", "published")).resolves.toEqual({
      success: false,
      error: "No fue posible actualizar el producto",
    });
  });
});

describe("deleteProductAdminAction", () => {
  it("soft deletes the product", async () => {
    const supabase = useSupabase({ tables: { products: {} } });
    await expect(deleteProductAdminAction("p1")).resolves.toEqual({ success: true });
    const [[payload]] = argsOf(supabase.queryFor("products"), "update") as [[{ deleted_at: string }]];
    expect(Number.isNaN(Date.parse(payload.deleted_at))).toBe(false);
  });

  it("reports a failure", async () => {
    useSupabase({ tables: { products: { error: { message: "boom" } } } });
    await expect(deleteProductAdminAction("p1")).resolves.toEqual({
      success: false,
      error: "No fue posible eliminar el producto",
    });
  });
});

describe("deleteBusinessAdminAction", () => {
  it("deactivates the business instead of deleting it", async () => {
    const supabase = useSupabase({ tables: { businesses: {} } });
    await expect(deleteBusinessAdminAction("b1")).resolves.toEqual({ success: true });
    expect(argsOf(supabase.queryFor("businesses"), "update")).toEqual([[{ is_active: false }]]);
  });

  it("reports a failure", async () => {
    useSupabase({ tables: { businesses: { error: { message: "boom" } } } });
    await expect(deleteBusinessAdminAction("b1")).resolves.toEqual({
      success: false,
      error: "No fue posible desactivar el negocio",
    });
  });
});

describe("category actions", () => {
  it("inserts a category", async () => {
    const supabase = useSupabase({ tables: { categories: {} } });
    await expect(createCategoryAction({ name: "Comida", slug: "comida" })).resolves.toEqual({ success: true });
    expect(argsOf(supabase.queryFor("categories"), "insert")).toEqual([[{ name: "Comida", slug: "comida" }]]);
  });

  it("reports an insert failure", async () => {
    useSupabase({ tables: { categories: { error: { message: "boom" } } } });
    await expect(createCategoryAction({})).resolves.toEqual({
      success: false,
      error: "No fue posible crear la categoría",
    });
  });

  it("updates a category by id", async () => {
    const supabase = useSupabase({ tables: { categories: {} } });
    await expect(updateCategoryAction("c1", { name: "Bebidas" })).resolves.toEqual({ success: true });
    expect(argsOf(supabase.queryFor("categories"), "eq")).toEqual([["id", "c1"]]);
  });

  it("reports an update failure", async () => {
    useSupabase({ tables: { categories: { error: { message: "boom" } } } });
    await expect(updateCategoryAction("c1", {})).resolves.toEqual({
      success: false,
      error: "No fue posible actualizar la categoría",
    });
  });

  it("deletes a category by id", async () => {
    const supabase = useSupabase({ tables: { categories: {} } });
    await expect(deleteCategoryAction("c1")).resolves.toEqual({ success: true });
    expect(argsOf(supabase.queryFor("categories"), "delete")).toEqual([[]]);
  });

  it("reports a delete failure", async () => {
    useSupabase({ tables: { categories: { error: { message: "boom" } } } });
    await expect(deleteCategoryAction("c1")).resolves.toEqual({
      success: false,
      error: "No fue posible eliminar la categoría",
    });
  });
});

describe("exportDataAction", () => {
  it("returns every row of the requested table", async () => {
    const supabase = useSupabase({ tables: { products: { data: [{ id: "p1" }] } } });
    await expect(exportDataAction("products")).resolves.toEqual({ success: true, data: [{ id: "p1" }] });
    expect(argsOf(supabase.queryFor("products"), "select")).toEqual([["*"]]);
  });

  it("reports an export failure", async () => {
    useSupabase({ tables: { products: { error: { message: "boom" } } } });
    await expect(exportDataAction("products")).resolves.toEqual({
      success: false,
      error: "No fue posible exportar los datos",
    });
  });
});
