"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, resetPasswordSchema } from "@/modules/auth/schemas/auth.schema";
import { SITE_URL } from "@/lib/constants";

type Result = { success: true } | { success: false; error: string };

export async function loginAction(input: unknown): Promise<Result> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Revisa los datos ingresados" };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  return error ? { success: false, error: "Credenciales inválidas" } : { success: true };
}

export async function registerAction(input: unknown): Promise<Result> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Revisa los datos ingresados" };
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? SITE_URL;
  const { error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { data: { full_name: parsed.data.fullName }, emailRedirectTo: `${origin}/login` } });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function resetPasswordAction(input: unknown): Promise<Result> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Ingresa un correo válido" };
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${SITE_URL}/login` });
  return error ? { success: false, error: "No fue posible enviar el correo" } : { success: true };
}

export async function signInWithGoogleAction(): Promise<Result & { url?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${SITE_URL}/auth/callback` } });
  if (error || !data.url) return { success: false, error: "No fue posible iniciar sesión con Google" };
  return { success: true, url: data.url };
}

export async function updatePasswordAction(input: unknown): Promise<Result> {
  const parsed = z.object({ password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres") }).safeParse(input);
  if (!parsed.success) return { success: false, error: "La contraseña debe tener al menos 8 caracteres" };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  return error ? { success: false, error: "No fue posible actualizar la contraseña" } : { success: true };
}

export async function updateProfileAction(input: unknown): Promise<Result> {
  const parsed = z.object({ fullName: z.string().min(2, "Ingresa tu nombre completo"), phone: z.string().optional(), avatarUrl: z.string().url().optional().or(z.literal("")) }).safeParse(input);
  if (!parsed.success) return { success: false, error: "Revisa los datos ingresados" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No hay sesión activa" };
  const { error } = await supabase.from("profiles").update({ full_name: parsed.data.fullName, phone: parsed.data.phone ?? null, avatar_url: parsed.data.avatarUrl || null }).eq("id", user.id);
  return error ? { success: false, error: "No fue posible actualizar el perfil" } : { success: true };
}

export async function logoutAction(): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  return error ? { success: false, error: "No fue posible cerrar sesión" } : { success: true };
}
