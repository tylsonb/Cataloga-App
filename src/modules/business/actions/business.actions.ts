"use server";

import { createBusinessSchema, updateBusinessSchema } from "@/modules/business/schemas/business.schema";
import { createBusiness, updateBusiness, toggleBusinessStatus, getBusinessBySlug, getBusinessByOwner } from "@/modules/business/repositories/business.repository";
import { slugify } from "@/modules/shared/utils/slug.util";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { Result } from "@/modules/shared/types/result.type";
import { ERROR_INVALID_INPUT, ERROR_NO_SESSION, fail, ok } from "@/modules/shared/utils/result.util";

export async function createBusinessAction(input: unknown): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return fail(ERROR_NO_SESSION);

  const parsed = createBusinessSchema.safeParse(input);
  if (!parsed.success) return fail(ERROR_INVALID_INPUT);

  const slug = slugify(parsed.data.name);
  const business = await createBusiness({ ...parsed.data, slug, owner_id: user.id } as never);
  if (!business) return fail("No fue posible crear el negocio");

  return ok();
}

export async function updateBusinessAction(id: string, input: unknown): Promise<Result> {
  const parsed = updateBusinessSchema.safeParse(input);
  if (!parsed.success) return fail(ERROR_INVALID_INPUT);
  const business = await updateBusiness(id, parsed.data as never);
  return business ? ok() : fail("No fue posible actualizar el negocio");
}

export async function toggleBusinessStatusAction(id: string, isActive: boolean): Promise<Result> {
  await toggleBusinessStatus(id, isActive);
  return ok();
}

export async function getBusinessBySlugAction(slug: string) {
  return getBusinessBySlug(slug);
}

export async function getBusinessByOwnerAction(ownerId: string) {
  return getBusinessByOwner(ownerId);
}
