import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import {
  trackProductViewAction,
  trackWhatsappClickAction,
  trackBusinessViewAction,
  trackSearchAction,
} from "@/modules/analytics/actions/analytics.actions";
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

describe("trackProductViewAction", () => {
  it("records the view for the signed-in user", async () => {
    const supabase = useSupabase({ user: { id: "u1" }, tables: { product_views: {} } });
    await trackProductViewAction("p1", "s1");
    expect(argsOf(supabase.queryFor("product_views"), "insert")).toEqual([
      [{ product_id: "p1", user_id: "u1", session_id: "s1" }],
    ]);
  });

  it("records an anonymous view with null ids", async () => {
    const supabase = useSupabase({ user: null, tables: { product_views: {} } });
    await trackProductViewAction("p1");
    expect(argsOf(supabase.queryFor("product_views"), "insert")).toEqual([
      [{ product_id: "p1", user_id: null, session_id: null }],
    ]);
  });
});

describe("trackWhatsappClickAction", () => {
  it("records the click with product and business", async () => {
    const supabase = useSupabase({ user: { id: "u1" }, tables: { whatsapp_clicks: {} } });
    await trackWhatsappClickAction("p1", "b1", "s1");
    expect(argsOf(supabase.queryFor("whatsapp_clicks"), "insert")).toEqual([
      [{ product_id: "p1", business_id: "b1", user_id: "u1", session_id: "s1" }],
    ]);
  });

  it("records an anonymous click with null ids", async () => {
    const supabase = useSupabase({ user: null, tables: { whatsapp_clicks: {} } });
    await trackWhatsappClickAction("p1", "b1");
    expect(argsOf(supabase.queryFor("whatsapp_clicks"), "insert")).toEqual([
      [{ product_id: "p1", business_id: "b1", user_id: null, session_id: null }],
    ]);
  });
});

describe("not-yet-implemented trackers", () => {
  it("are no-ops that do not touch supabase", async () => {
    const supabase = useSupabase();
    await expect(trackBusinessViewAction("b1", "s1")).resolves.toBeUndefined();
    await expect(trackSearchAction("silla", 3, "s1")).resolves.toBeUndefined();
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
