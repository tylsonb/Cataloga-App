"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategoryAction } from "@/modules/admin/actions/admin.actions";
import { DataTable } from "@/modules/shared/components/data-table";
import { FormFeedback } from "@/modules/shared/components/form-feedback";
import { useFormAction } from "@/modules/shared/hooks/use-form-action.hook";

export function CategoriesManager({ categories }: { categories: Array<{ id: string; name: string; slug: string }> }) {
  const { pending, error, submit } = useFormAction((formData) =>
    createCategoryAction({ name: formData.get("name"), slug: formData.get("slug") })
  );

  return (
    <div className="space-y-6">
      <form action={submit} className="flex gap-2">
        <Input name="name" placeholder="Nombre" required />
        <Input name="slug" placeholder="slug" required />
        <Button disabled={pending}>Agregar</Button>
      </form>
      <FormFeedback error={error} />
      <DataTable headers={["Nombre", "Slug"]}>
        {categories.map((c) => (
          <tr key={c.id} className="border-b"><td className="py-2">{c.name}</td><td className="py-2">{c.slug}</td></tr>
        ))}
      </DataTable>
    </div>
  );
}
