import { describe, expect, it, vi, afterEach } from "vitest";
import type { PostgrestError } from "@supabase/supabase-js";
import { DataAccessError, dbError, isNoRowsError } from "@/lib/errors";

function makeError(code: string, message = "boom"): PostgrestError {
  return { code, message, details: "", hint: "", name: "PostgrestError" } as PostgrestError;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isNoRowsError", () => {
  it("treats PGRST116 as an expected empty result", () => {
    expect(isNoRowsError(makeError("PGRST116"))).toBe(true);
  });

  it("treats any other code as a real failure", () => {
    expect(isNoRowsError(makeError("42501"))).toBe(false);
  });
});

describe("dbError", () => {
  it("returns a DataAccessError carrying scope, code and message", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const error = dbError("product.getProducts", makeError("42501", "permission denied"));
    expect(error).toBeInstanceOf(DataAccessError);
    expect(error.scope).toBe("product.getProducts");
    expect(error.code).toBe("42501");
    expect(error.message).toBe("product.getProducts: permission denied");
  });

  it("logs the failure with its context so it is never swallowed", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    dbError("product.getProductBySlug", makeError("42501"), { slug: "chair" });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]?.[1]).toMatchObject({ slug: "chair" });
  });
});
