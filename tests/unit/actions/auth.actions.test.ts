import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import {
  loginAction,
  registerAction,
  resetPasswordAction,
  signInWithGoogleAction,
  updatePasswordAction,
  updateProfileAction,
  logoutAction,
} from "@/modules/auth/actions/auth.actions";
import { createSupabaseMock, argsOf, type SupabaseMockOptions, type SupabaseMock } from "../helpers/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("next/headers", () => ({ headers: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const mockedHeaders = vi.mocked(headers);

function useSupabase(options: SupabaseMockOptions = {}): SupabaseMock {
  const supabase = createSupabaseMock(options);
  mockedCreateClient.mockResolvedValue(supabase.client as never);
  return supabase;
}

function useOrigin(origin: string | null) {
  mockedHeaders.mockResolvedValue({ get: vi.fn(() => origin) } as never);
}

beforeEach(() => {
  vi.clearAllMocks();
  useOrigin("https://cataloga.test");
});

describe("loginAction", () => {
  it("signs in with the parsed credentials", async () => {
    const supabase = useSupabase();
    await expect(loginAction({ email: "a@b.com", password: "12345678" })).resolves.toEqual({ success: true });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: "a@b.com", password: "12345678" });
  });

  it("rejects invalid input without hitting supabase", async () => {
    const supabase = useSupabase();
    await expect(loginAction({ email: "nope", password: "1" })).resolves.toEqual({
      success: false,
      error: "Revisa los datos ingresados",
    });
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("maps a supabase error to invalid credentials", async () => {
    useSupabase({ authErrors: { signInWithPassword: { message: "Invalid login" } } });
    await expect(loginAction({ email: "a@b.com", password: "12345678" })).resolves.toEqual({
      success: false,
      error: "Credenciales inválidas",
    });
  });
});

describe("registerAction", () => {
  const input = { email: "a@b.com", password: "12345678", fullName: "Ana Pérez" };

  it("signs up with the request origin as redirect", async () => {
    const supabase = useSupabase();
    await expect(registerAction(input)).resolves.toEqual({ success: true });
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: input.email,
      password: input.password,
      options: { data: { full_name: input.fullName }, emailRedirectTo: "https://cataloga.test/login" },
    });
  });

  it("falls back to SITE_URL when there is no origin header", async () => {
    useOrigin(null);
    const supabase = useSupabase();
    await registerAction(input);
    const [{ options }] = supabase.auth.signUp.mock.calls[0] as [{ options: { emailRedirectTo: string } }];
    expect(options.emailRedirectTo).toBe("http://localhost:3000/login");
  });

  it("rejects invalid input", async () => {
    const supabase = useSupabase();
    await expect(registerAction({ ...input, fullName: "A" })).resolves.toEqual({
      success: false,
      error: "Revisa los datos ingresados",
    });
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it("surfaces the supabase error message", async () => {
    useSupabase({ authErrors: { signUp: { message: "User already registered" } } });
    await expect(registerAction(input)).resolves.toEqual({ success: false, error: "User already registered" });
  });
});

describe("resetPasswordAction", () => {
  it("sends the reset email", async () => {
    const supabase = useSupabase();
    await expect(resetPasswordAction({ email: "a@b.com" })).resolves.toEqual({ success: true });
    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith("a@b.com", {
      redirectTo: "http://localhost:3000/login",
    });
  });

  it("rejects an invalid email", async () => {
    await expect(resetPasswordAction({ email: "nope" })).resolves.toEqual({
      success: false,
      error: "Ingresa un correo válido",
    });
  });

  it("reports a send failure", async () => {
    useSupabase({ authErrors: { resetPasswordForEmail: { message: "rate limited" } } });
    await expect(resetPasswordAction({ email: "a@b.com" })).resolves.toEqual({
      success: false,
      error: "No fue posible enviar el correo",
    });
  });
});

describe("signInWithGoogleAction", () => {
  it("starts the google oauth flow", async () => {
    const supabase = useSupabase();
    await expect(signInWithGoogleAction()).resolves.toEqual({ success: true });
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/auth/callback" },
    });
  });

  it("reports an oauth failure", async () => {
    useSupabase({ authErrors: { signInWithOAuth: { message: "provider disabled" } } });
    await expect(signInWithGoogleAction()).resolves.toEqual({
      success: false,
      error: "No fue posible iniciar sesión con Google",
    });
  });
});

describe("updatePasswordAction", () => {
  it("updates the user password", async () => {
    const supabase = useSupabase();
    await expect(updatePasswordAction({ password: "supersecret" })).resolves.toEqual({ success: true });
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: "supersecret" });
  });

  it("rejects a short password", async () => {
    await expect(updatePasswordAction({ password: "short" })).resolves.toEqual({
      success: false,
      error: "La contraseña debe tener al menos 8 caracteres",
    });
  });

  it("reports an update failure", async () => {
    useSupabase({ authErrors: { updateUser: { message: "expired" } } });
    await expect(updatePasswordAction({ password: "supersecret" })).resolves.toEqual({
      success: false,
      error: "No fue posible actualizar la contraseña",
    });
  });
});

describe("updateProfileAction", () => {
  const input = { fullName: "Ana Pérez", phone: "+56912345678", avatarUrl: "https://cdn.test/a.png" };

  it("updates the profile of the current user", async () => {
    const supabase = useSupabase({ user: { id: "u1" }, tables: { profiles: {} } });
    await expect(updateProfileAction(input)).resolves.toEqual({ success: true });
    const query = supabase.queryFor("profiles");
    expect(argsOf(query, "update")).toEqual([
      [{ full_name: "Ana Pérez", phone: "+56912345678", avatar_url: "https://cdn.test/a.png" }],
    ]);
    expect(argsOf(query, "eq")).toEqual([["id", "u1"]]);
  });

  it("nulls out an omitted phone and an empty avatar url", async () => {
    const supabase = useSupabase({ user: { id: "u1" }, tables: { profiles: {} } });
    await updateProfileAction({ fullName: "Ana Pérez", avatarUrl: "" });
    expect(argsOf(supabase.queryFor("profiles"), "update")).toEqual([
      [{ full_name: "Ana Pérez", phone: null, avatar_url: null }],
    ]);
  });

  it("rejects invalid input", async () => {
    await expect(updateProfileAction({ fullName: "A" })).resolves.toEqual({
      success: false,
      error: "Revisa los datos ingresados",
    });
  });

  it("requires an active session", async () => {
    useSupabase({ user: null, tables: { profiles: {} } });
    await expect(updateProfileAction(input)).resolves.toEqual({ success: false, error: "No hay sesión activa" });
  });

  it("reports a write failure", async () => {
    useSupabase({ user: { id: "u1" }, tables: { profiles: { error: { message: "boom" } } } });
    await expect(updateProfileAction(input)).resolves.toEqual({
      success: false,
      error: "No fue posible actualizar el perfil",
    });
  });
});

describe("logoutAction", () => {
  it("signs the user out", async () => {
    const supabase = useSupabase();
    await logoutAction();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
