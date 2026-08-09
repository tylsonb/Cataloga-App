import { BusinessForm } from "@/modules/business/components/business-form";
import { createBusinessAction } from "@/modules/business/actions/business.actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CrearNegocioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  async function submit(formData: FormData) {
    "use server";
    const result = await createBusinessAction({
      name: formData.get("name"),
      whatsapp: formData.get("whatsapp"),
      description: formData.get("description") || undefined,
      city: formData.get("city") || undefined,
      category_id: formData.get("category_id") || undefined,
    });
    if (result.success) redirect("/dashboard");
    return result;
  }

  const { data: categories } = await supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order");

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">Crear tu negocio</h1>
      <div className="mt-8 max-w-md">
        <BusinessForm onSubmit={submit} categories={categories ?? []} />
      </div>
    </section>
  );
}
