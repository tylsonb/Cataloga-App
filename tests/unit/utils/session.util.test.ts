import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getSessionId } from "@/modules/analytics/utils/session.util";

function stubBrowser(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  const sessionStorage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => void store.set(key, value)),
  };
  vi.stubGlobal("window", {});
  vi.stubGlobal("sessionStorage", sessionStorage);
  return { store, sessionStorage };
}

describe("getSessionId", () => {
  beforeEach(() => {
    vi.stubGlobal("window", undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns an empty string on the server", () => {
    expect(getSessionId()).toBe("");
  });

  it("generates and persists an id when none exists", () => {
    const { store, sessionStorage } = stubBrowser();
    const id = getSessionId();
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(store.get("session_id")).toBe(id);
    expect(sessionStorage.setItem).toHaveBeenCalledWith("session_id", id);
  });

  it("reuses the stored id", () => {
    const { sessionStorage } = stubBrowser({ session_id: "existing-id" });
    expect(getSessionId()).toBe("existing-id");
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
  });

  it("is stable across calls", () => {
    stubBrowser();
    expect(getSessionId()).toBe(getSessionId());
  });
});
