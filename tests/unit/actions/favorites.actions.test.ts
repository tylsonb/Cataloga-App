import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import * as repository from "@/modules/favorites/repositories/favorites.repository";
import {
  toggleFavoriteAction,
  getFavoritesAction,
  checkFavoriteStatusAction,
} from "@/modules/favorites/actions/favorites.actions";
import { createSupabaseMock, type SupabaseMockOptions } from "../helpers/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/modules/favorites/repositories/favorites.repository", () => ({
  toggleFavorite: vi.fn(),
  getFavoritesWithProducts: vi.fn(),
  checkFavoriteStatus: vi.fn(),
}));

const repo = vi.mocked(repository);
const mockedCreateClient = vi.mocked(createClient);

function useSupabase(options: SupabaseMockOptions = {}) {
  const supabase = createSupabaseMock(options);
  mockedCreateClient.mockResolvedValue(supabase.client as never);
  return supabase;
}

beforeEach(() => {
  vi.clearAllMocks();
  useSupabase({ user: { id: "u1" } });
});

describe("toggleFavoriteAction", () => {
  it("returns the new favorite state for the current user", async () => {
    repo.toggleFavorite.mockResolvedValue(true);
    await expect(toggleFavoriteAction("p1")).resolves.toEqual({ success: true, favorited: true });
    expect(repo.toggleFavorite).toHaveBeenCalledWith("u1", "p1");
  });

  it("propagates an unfavorite", async () => {
    repo.toggleFavorite.mockResolvedValue(false);
    await expect(toggleFavoriteAction("p1")).resolves.toEqual({ success: true, favorited: false });
  });

  it("requires an active session", async () => {
    useSupabase({ user: null });
    await expect(toggleFavoriteAction("p1")).resolves.toEqual({ success: false, error: "No hay sesión activa" });
    expect(repo.toggleFavorite).not.toHaveBeenCalled();
  });
});

describe("getFavoritesAction", () => {
  it("returns the favorites of the current user", async () => {
    repo.getFavoritesWithProducts.mockResolvedValue([{ product_id: "p1", products: null }]);
    await expect(getFavoritesAction()).resolves.toEqual([{ product_id: "p1", products: null }]);
    expect(repo.getFavoritesWithProducts).toHaveBeenCalledWith("u1");
  });

  it("returns an empty list for anonymous visitors", async () => {
    useSupabase({ user: null });
    await expect(getFavoritesAction()).resolves.toEqual([]);
    expect(repo.getFavoritesWithProducts).not.toHaveBeenCalled();
  });
});

describe("checkFavoriteStatusAction", () => {
  it("delegates to the repository", async () => {
    repo.checkFavoriteStatus.mockResolvedValue(true);
    await expect(checkFavoriteStatusAction("p1")).resolves.toBe(true);
    expect(repo.checkFavoriteStatus).toHaveBeenCalledWith("u1", "p1");
  });

  it("returns false for anonymous visitors", async () => {
    useSupabase({ user: null });
    await expect(checkFavoriteStatusAction("p1")).resolves.toBe(false);
    expect(repo.checkFavoriteStatus).not.toHaveBeenCalled();
  });
});
