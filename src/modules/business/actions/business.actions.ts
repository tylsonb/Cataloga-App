"use server";

import { createBusinessSchema, updateBusinessSchema } from "@/modules/business/schemas/business.schema";
import { createBusiness, updateBusiness, toggleBusinessStatus, getBusinessBySlug, getBusinessByOwner } from "@/modules/business/repositories/business.repository";
import { slugify } from "@/modules/shared/utils/slug.util";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/modules/shared/types/result.type";

export async function createBusinessAction(input: unknown): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No hay sesión activa" };

  const parsed = createBusinessSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Revisa los datos ingresados" };

  const slug = slugify(parsed.data.name);
  const business = await createBusiness({ ...parsed.data, slug, owner_id: user.id } as never);
  if (!business) return { success: false, error: "No fue posible crear el negocio" };

  return { success: true };
}

export async function updateBusinessAction(id: string, input: unknown): Promise<Result> {
  const parsed = updateBusinessSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Revisa los datos ingresados" };
  const business = await updateBusiness(id, parsed.data as never);
  return business ? { success: true } : { success: false, error: "No fue posible actualizar el negocio" };
}

export async function toggleBusinessStatusAction(id: string, isActive: boolean): Promise<Result> {
  await toggleBusinessStatus(id, isActive);
  return { success: true };
}

export async function getBusinessBySlugAction(slug: string) {
  return getBusinessBySlug(slug);
}

export async function getBusinessByOwnerAction(ownerId: string) {
  return getBusinessByOwner(ownerId);
}
