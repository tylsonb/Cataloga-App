import { BusinessForm } from "@/modules/business/components/business-form";
import { createBusinessAction } from "@/modules/business/actions/business.actions";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import { getActiveCategories } from "@/modules/shared/repositories/category.repository";

export const dynamic = "force-dynamic";

export default async function CrearNegocioPage() {
  await requireUser();

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

  const categories = await getActiveCategories();

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">Crear tu negocio</h1>
      <div className="mt-8 max-w-md">
        <BusinessForm onSubmit={submit} categories={categories} />
      </div>
    </section>
  );
}
