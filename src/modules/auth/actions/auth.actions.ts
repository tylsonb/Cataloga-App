"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { loginSchema, registerSchema, resetPasswordSchema } from "@/modules/auth/schemas/auth.schema";
import { SITE_URL } from "@/lib/constants";
import type { Result } from "@/modules/shared/types/result.type";
import { ERROR_INVALID_INPUT, ERROR_NO_SESSION, fail, ok } from "@/modules/shared/utils/result.util";

export async function loginAction(input: unknown): Promise<Result> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return fail(ERROR_INVALID_INPUT);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  return error ? fail("Credenciales inválidas") : ok();
}

export async function registerAction(input: unknown): Promise<Result> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return fail(ERROR_INVALID_INPUT);
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? SITE_URL;
  const { error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { data: { full_name: parsed.data.fullName }, emailRedirectTo: `${origin}/login` } });
  return error ? fail(error.message) : ok();
}

export async function resetPasswordAction(input: unknown): Promise<Result> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return fail("Ingresa un correo válido");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${SITE_URL}/login` });
  return error ? fail("No fue posible enviar el correo") : ok();
}

export async function signInWithGoogleAction(): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${SITE_URL}/auth/callback` } });
  return error ? fail("No fue posible iniciar sesión con Google") : ok();
}

export async function updatePasswordAction(input: unknown): Promise<Result> {
  const parsed = z.object({ password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres") }).safeParse(input);
  if (!parsed.success) return fail("La contraseña debe tener al menos 8 caracteres");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  return error ? fail("No fue posible actualizar la contraseña") : ok();
}

export async function updateProfileAction(input: unknown): Promise<Result> {
  const parsed = z.object({ fullName: z.string().min(2, "Ingresa tu nombre completo"), phone: z.string().optional(), avatarUrl: z.string().url().optional().or(z.literal("")) }).safeParse(input);
  if (!parsed.success) return fail(ERROR_INVALID_INPUT);
  const user = await getCurrentUser();
  if (!user) return fail(ERROR_NO_SESSION);
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ full_name: parsed.data.fullName, phone: parsed.data.phone ?? null, avatar_url: parsed.data.avatarUrl || null }).eq("id", user.id);
  return error ? fail("No fue posible actualizar el perfil") : ok();
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
