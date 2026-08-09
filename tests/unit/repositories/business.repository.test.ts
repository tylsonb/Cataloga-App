import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import {
  getBusinessBySlug,
  getBusinessByOwner,
  createBusiness,
  updateBusiness,
  toggleBusinessStatus,
} from "@/modules/business/repositories/business.repository";
import { createSupabaseMock, argsOf, type SupabaseMockOptions, type SupabaseMock } from "../helpers/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);

function useSupabase(options: SupabaseMockOptions): SupabaseMock {
  const supabase = createSupabaseMock(options);
  mockedCreateClient.mockResolvedValue(supabase.client as never);
  return supabase;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getBusinessBySlug", () => {
  it("filters by slug", async () => {
    const supabase = useSupabase({ tables: { businesses: { data: { id: "b1", slug: "mi-negocio" } } } });
    await expect(getBusinessBySlug("mi-negocio")).resolves.toEqual({ id: "b1", slug: "mi-negocio" });
    expect(argsOf(supabase.queryFor("businesses"), "eq")).toEqual([["slug", "mi-negocio"]]);
  });

  it("returns null when not found", async () => {
    useSupabase({ tables: { businesses: { data: null } } });
    await expect(getBusinessBySlug("nope")).resolves.toBeNull();
  });
});

describe("getBusinessByOwner", () => {
  it("filters by owner_id", async () => {
    const supabase = useSupabase({ tables: { businesses: { data: { id: "b1" } } } });
    await expect(getBusinessByOwner("u1")).resolves.toEqual({ id: "b1" });
    expect(argsOf(supabase.queryFor("businesses"), "eq")).toEqual([["owner_id", "u1"]]);
  });

  it("returns null when the owner has no business", async () => {
    useSupabase({ tables: { businesses: { data: null } } });
    await expect(getBusinessByOwner("u1")).resolves.toBeNull();
  });
});

describe("createBusiness", () => {
  it("returns the inserted business", async () => {
    const supabase = useSupabase({ tables: { businesses: { data: { id: "b1" } } } });
    await expect(createBusiness({ name: "Mi Negocio" } as never)).resolves.toEqual({ id: "b1" });
    expect(argsOf(supabase.queryFor("businesses"), "insert")).toEqual([[{ name: "Mi Negocio" }]]);
  });

  it("returns null on error", async () => {
    useSupabase({ tables: { businesses: { data: { id: "b1" }, error: { message: "duplicate slug" } } } });
    await expect(createBusiness({ name: "Mi Negocio" } as never)).resolves.toBeNull();
  });
});

describe("updateBusiness", () => {
  it("updates by id", async () => {
    const supabase = useSupabase({ tables: { businesses: { data: { id: "b1", city: "Santiago" } } } });
    await expect(updateBusiness("b1", { city: "Santiago" } as never)).resolves.toEqual({ id: "b1", city: "Santiago" });
    expect(argsOf(supabase.queryFor("businesses"), "eq")).toEqual([["id", "b1"]]);
  });

  it("returns null on error", async () => {
    useSupabase({ tables: { businesses: { data: { id: "b1" }, error: { message: "boom" } } } });
    await expect(updateBusiness("b1", {} as never)).resolves.toBeNull();
  });
});

describe("toggleBusinessStatus", () => {
  it("writes the requested active flag", async () => {
    const supabase = useSupabase({ tables: { businesses: {} } });
    await toggleBusinessStatus("b1", false);
    expect(argsOf(supabase.queryFor("businesses"), "update")).toEqual([[{ is_active: false }]]);
    expect(argsOf(supabase.queryFor("businesses"), "eq")).toEqual([["id", "b1"]]);
  });
});
