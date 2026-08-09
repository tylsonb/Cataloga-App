import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, resetPasswordSchema } from "@/modules/auth/schemas/auth.schema";

describe("loginSchema", () => {
  it("validates correct input", () => {
    const result = loginSchema.safeParse({ email: "test@test.com", password: "12345678" });
    expect(result.success).toBe(true);
  });
  it("rejects short password", () => {
    const result = loginSchema.safeParse({ email: "test@test.com", password: "short" });
    expect(result.success).toBe(false);
  });
  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-email", password: "12345678" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("validates correct input", () => {
    const result = registerSchema.safeParse({ email: "test@test.com", password: "12345678", fullName: "Test User" });
    expect(result.success).toBe(true);
  });
  it("rejects short name", () => {
    const result = registerSchema.safeParse({ email: "test@test.com", password: "12345678", fullName: "A" });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("validates correct email", () => {
    const result = resetPasswordSchema.safeParse({ email: "test@test.com" });
    expect(result.success).toBe(true);
  });
  it("rejects invalid email", () => {
    const result = resetPasswordSchema.safeParse({ email: "nope" });
    expect(result.success).toBe(false);
  });
});
