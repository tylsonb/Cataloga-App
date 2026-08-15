import { BusinessForm } from "@/modules/business/components/business-form";
import { updateBusinessAction } from "@/modules/business/actions/business.actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarNegocioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase.from("businesses").select("id, name, description, whatsapp, city, category_id").eq("owner_id", user.id).eq("is_active", true).single();
  if (!business) redirect("/negocio/crear");

  async function submit(formData: FormData) {
    "use server";
    if (!business) return { success: false as const, error: "No se encontró el negocio" };
    const result = await updateBusinessAction(business.id, {
      name: formData.get("name"),
      whatsapp: formData.get("whatsapp"),
      description: formData.get("description") || undefined,
      city: formData.get("city") || undefined,
      category_id: formData.get("category_id") || undefined,
    });
    if (result.success) redirect("/dashboard/negocio");
    return result;
  }

  const { data: categories } = await supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order");

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Editar negocio</h1>
      <BusinessForm onSubmit={submit} categories={categories ?? []} defaultValues={business} />
    </div>
  );
}
