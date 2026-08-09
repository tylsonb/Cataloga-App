import { describe, it, expect } from "vitest";
import { cn } from "@/modules/shared/utils/cn.util";
import { cn as cnFromLib } from "@/lib/utils";

describe("cn", () => {
  it("re-exports the lib implementation", () => {
    expect(cn).toBe(cnFromLib);
  });

  it("joins class names", () => {
    expect(cn("px-2", "text-sm")).toBe("px-2 text-sm");
  });

  it("drops falsy values", () => {
    expect(cn("px-2", false, undefined, null, "")).toBe("px-2");
  });

  it("resolves conditional objects and arrays", () => {
    expect(cn(["px-2", { hidden: false, block: true }])).toBe("px-2 block");
  });

  it("keeps the last of conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("returns an empty string with no input", () => {
    expect(cn()).toBe("");
  });
});
