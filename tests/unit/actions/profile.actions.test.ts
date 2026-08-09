import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { updateProfileAction } from "@/modules/profile/actions/profile.actions";
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

describe("updateProfileAction", () => {
  it("updates the profile of the given user with a fresh timestamp", async () => {
    const supabase = useSupabase({ tables: { profiles: {} } });
    await expect(
      updateProfileAction("u1", { full_name: "Ana", phone: "+56912345678", avatar_url: null })
    ).resolves.toEqual({ success: true });
    const query = supabase.queryFor("profiles");
    const [[payload]] = argsOf(query, "update") as [[Record<string, unknown>]];
    expect(payload).toMatchObject({ full_name: "Ana", phone: "+56912345678", avatar_url: null });
    expect(Number.isNaN(Date.parse(payload.updated_at as string))).toBe(false);
    expect(argsOf(query, "eq")).toEqual([["id", "u1"]]);
  });

  it("forwards undefined fields untouched", async () => {
    const supabase = useSupabase({ tables: { profiles: {} } });
    await updateProfileAction("u1", {});
    const [[payload]] = argsOf(supabase.queryFor("profiles"), "update") as [[Record<string, unknown>]];
    expect(payload.full_name).toBeUndefined();
    expect(payload.phone).toBeUndefined();
  });

  it("reports a write failure", async () => {
    useSupabase({ tables: { profiles: { error: { message: "boom" } } } });
    await expect(updateProfileAction("u1", { full_name: "Ana" })).resolves.toEqual({
      success: false,
      error: "No fue posible actualizar el perfil",
    });
  });
});
