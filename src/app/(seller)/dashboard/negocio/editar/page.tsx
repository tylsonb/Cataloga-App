import { BusinessForm } from "@/modules/business/components/business-form";
import { updateBusinessAction } from "@/modules/business/actions/business.actions";
import { requireOwnedBusiness } from "@/modules/business/utils/owner-guard.util";
import { getActiveCategories } from "@/modules/shared/repositories/category.repository";

export const dynamic = "force-dynamic";

export default async function EditarNegocioPage() {
  const business = await requireOwnedBusiness({ activeOnly: true });

  async function submit(formData: FormData) {
    "use server";
    return updateBusinessAction(business.id, {
      name: formData.get("name"),
      whatsapp: formData.get("whatsapp"),
      description: formData.get("description") || undefined,
      city: formData.get("city") || undefined,
      category_id: formData.get("category_id") || undefined,
    });
  }

  const categories = await getActiveCategories();

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Editar negocio</h1>
      <BusinessForm onSubmit={submit} categories={categories} defaultValues={business} />
    </div>
  );
}
