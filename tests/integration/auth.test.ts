import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, resetPasswordSchema } from "@/modules/auth/schemas/auth.schema";

describe("auth integration — login flow", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "password123" });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = loginSchema.safeParse({ password: "password123" });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "" });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 chars", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "1234567" });
    expect(result.success).toBe(false);
  });
});

describe("auth integration — register flow", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({ email: "new@example.com", password: "securePass1", fullName: "Jane Doe" });
    expect(result.success).toBe(true);
  });

  it("rejects fullName with only 1 char", () => {
    const result = registerSchema.safeParse({ email: "new@example.com", password: "securePass1", fullName: "J" });
    expect(result.success).toBe(false);
  });

  it("rejects non-email string in email field", () => {
    const result = registerSchema.safeParse({ email: "not-an-email", password: "securePass1", fullName: "Jane" });
    expect(result.success).toBe(false);
  });

  it("rejects when password is exactly 7 chars", () => {
    const result = registerSchema.safeParse({ email: "new@example.com", password: "1234567", fullName: "Jane" });
    expect(result.success).toBe(false);
  });
});

describe("auth integration — password reset flow", () => {
  it("accepts valid email for reset", () => {
    const result = resetPasswordSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects empty email", () => {
    const result = resetPasswordSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects malformed email", () => {
    const result = resetPasswordSchema.safeParse({ email: "user@" });
    expect(result.success).toBe(false);
  });
});
