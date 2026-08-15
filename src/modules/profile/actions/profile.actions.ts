"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/modules/shared/types/result.type";

const profileSchema = z.object({
  full_name: z.string().min(2, "Ingresa tu nombre completo").optional(),
  phone: z.string().max(30).nullable().optional(),
  avatar_url: z.string().url().nullable().optional().or(z.literal("")),
});

export async function updateProfileAction(userId: string, input: unknown): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No hay sesión activa" };
  if (user.id !== userId) return { success: false, error: "No autorizado" };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Revisa los datos ingresados" };

  const { error } = await supabase.from("profiles").update({
    full_name: parsed.data.full_name,
    phone: parsed.data.phone,
    avatar_url: parsed.data.avatar_url || null,
    updated_at: new Date().toISOString(),
  }).eq("id", user.id);
  if (error) return { success: false, error: "No fue posible actualizar el perfil" };
  revalidatePath("/perfil");
  revalidatePath("/", "layout");
  return { success: true };
}
