"use server";

import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/modules/shared/types/result.type";
import { fail, ok } from "@/modules/shared/utils/result.util";

export async function updateProfileAction(userId: string, input: { full_name?: string; phone?: string | null; avatar_url?: string | null }): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({
    full_name: input.full_name,
    phone: input.phone,
    avatar_url: input.avatar_url,
    updated_at: new Date().toISOString(),
  }).eq("id", userId);
  return error ? fail("No fue posible actualizar el perfil") : ok();
}
