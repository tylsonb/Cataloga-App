import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import { getBusinessByOwner } from "@/modules/business/repositories/business.repository";
import type { Business } from "@/modules/business/types/business.types";

export async function requireOwnedBusiness(options: { activeOnly?: boolean } = {}): Promise<Business> {
  const user = await requireUser();
  const business = await getBusinessByOwner(user.id);
  if (!business || (options.activeOnly && !business.is_active)) redirect("/negocio/crear");
  return business;
}
