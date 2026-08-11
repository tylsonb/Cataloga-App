import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "@/lib/json-ld";
import { safeRedirectPath } from "@/lib/safe-redirect";

describe("safeRedirectPath", () => {
  it("rejects absolute and protocol-relative URLs", () => {
    expect(safeRedirectPath("https://evil.com")).toBe("/");
    expect(safeRedirectPath("//evil.com")).toBe("/");
    expect(safeRedirectPath("/\\evil.com")).toBe("/");
    expect(safeRedirectPath("javascript:alert(1)")).toBe("/");
  });

  it("allows relative paths", () => {
    expect(safeRedirectPath("/dashboard?tab=1")).toBe("/dashboard?tab=1");
  });

  it("falls back when missing", () => {
    expect(safeRedirectPath(null)).toBe("/");
  });
});

describe("serializeJsonLd", () => {
  it("escapes characters that could break out of a script tag", () => {
    const output = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(output).not.toContain("</script>");
    expect(output).toContain("\\u003c");
  });

  it("escapes line separators that break JS parsing", () => {
    expect(serializeJsonLd({ name: "a\u2028b" })).toContain("\\u2028");
  });

  it("keeps the payload parseable", () => {
    expect(JSON.parse(serializeJsonLd({ name: "<b>&</b>" }))).toEqual({ name: "<b>&</b>" });
  });
});
