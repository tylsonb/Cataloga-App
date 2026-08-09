import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStatsAction } from "@/modules/dashboard/actions/get-dashboard-stats.action";
import { createSupabaseMock, argsOf, type SupabaseMockOptions, type SupabaseMock } from "../helpers/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);

function useSupabase(options: SupabaseMockOptions = {}): SupabaseMock {
  const supabase = createSupabaseMock(options);
  mockedCreateClient.mockResolvedValue(supabase.client as never);
  return supabase;
}

interface StatsOverrides {
  business?: unknown;
  totalProducts?: number | null;
  topProducts?: unknown;
  productIds?: unknown;
  views?: number | null;
  favorites?: number | null;
  whatsappClicks?: number | null;
  recentViews?: unknown;
}

const DEFAULTS: Required<StatsOverrides> = {
  business: { id: "b1" },
  totalProducts: 2,
  topProducts: [{ id: "p1", name: "Silla", view_count: 5 }],
  productIds: [{ id: "p1" }, { id: "p2" }],
  views: 10,
  favorites: 4,
  whatsappClicks: 6,
  recentViews: [],
};

/** Tables in the order the action queries them. */
function statsTables(overrides: StatsOverrides = {}) {
  const value = <K extends keyof StatsOverrides>(key: K): Required<StatsOverrides>[K] =>
    (key in overrides ? overrides[key] : DEFAULTS[key]) as Required<StatsOverrides>[K];

  return {
    businesses: { data: value("business") },
    products: [
      { count: value("totalProducts") },
      { data: value("topProducts") },
      { data: value("productIds") },
    ],
    product_views: [{ count: value("views") }, { data: value("recentViews") }],
    favorites: { count: value("favorites") },
    whatsapp_clicks: { count: value("whatsappClicks") },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-03-10T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getDashboardStatsAction", () => {
  it("returns null without an active session", async () => {
    const supabase = useSupabase({ user: null });
    await expect(getDashboardStatsAction()).resolves.toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("returns null when the user has no business", async () => {
    useSupabase({ tables: statsTables({ business: null }) });
    await expect(getDashboardStatsAction()).resolves.toBeNull();
  });

  it("aggregates views, clicks, favorites and top products", async () => {
    useSupabase({ tables: statsTables() });
    const stats = await getDashboardStatsAction();
    expect(stats).toMatchObject({
      totalViews: 10,
      totalWhatsappClicks: 6,
      totalProducts: 2,
      totalFavorites: 4,
      topProducts: [{ id: "p1", name: "Silla", view_count: 5 }],
    });
  });

  it("builds a 7-day timeline ending today", async () => {
    useSupabase({ tables: statsTables() });
    const stats = await getDashboardStatsAction();
    expect(stats?.viewsTimeline).toHaveLength(7);
    expect(stats?.viewsTimeline.map((entry) => entry.date)).toEqual([
      "2026-03-04",
      "2026-03-05",
      "2026-03-06",
      "2026-03-07",
      "2026-03-08",
      "2026-03-09",
      "2026-03-10",
    ]);
    expect(stats?.viewsTimeline.every((entry) => entry.count === 0)).toBe(true);
  });

  it("buckets recent views by day and ignores dates outside the window", async () => {
    useSupabase({
      tables: statsTables({
        recentViews: [
          { created_at: "2026-03-10T08:00:00Z" },
          { created_at: "2026-03-10T09:30:00Z" },
          { created_at: "2026-03-08T10:00:00Z" },
          { created_at: "2026-01-01T10:00:00Z" },
        ],
      }),
    });
    const stats = await getDashboardStatsAction();
    const byDate = Object.fromEntries((stats?.viewsTimeline ?? []).map((entry) => [entry.date, entry.count]));
    expect(byDate["2026-03-10"]).toBe(2);
    expect(byDate["2026-03-08"]).toBe(1);
    expect(byDate["2026-01-01"]).toBeUndefined();
  });

  it("skips analytics queries when the business has no products", async () => {
    const supabase = useSupabase({ tables: statsTables({ productIds: [], topProducts: null, totalProducts: null }) });
    const stats = await getDashboardStatsAction();
    expect(stats).toEqual({
      totalViews: 0,
      totalWhatsappClicks: 0,
      totalProducts: 0,
      totalFavorites: 0,
      topProducts: [],
      viewsTimeline: [],
    });
    expect(supabase.queries.product_views).toBeUndefined();
    expect(supabase.queries.favorites).toBeUndefined();
  });

  it("scopes the counts to the products of the business", async () => {
    const supabase = useSupabase({ tables: statsTables() });
    await getDashboardStatsAction();
    expect(argsOf(supabase.queryFor("businesses"), "eq")).toEqual([["owner_id", "user-1"]]);
    expect(argsOf(supabase.queryFor("product_views"), "in")).toEqual([["product_id", ["p1", "p2"]]]);
    expect(argsOf(supabase.queryFor("favorites"), "in")).toEqual([["product_id", ["p1", "p2"]]]);
    expect(argsOf(supabase.queryFor("whatsapp_clicks"), "eq")).toEqual([["business_id", "b1"]]);
    expect(argsOf(supabase.queryFor("product_views", 1), "gte")).toEqual([["created_at", "2026-03-04T00:00:00.000Z"]]);
  });
});
