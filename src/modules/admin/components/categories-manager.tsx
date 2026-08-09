"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategoryAction } from "@/modules/admin/actions/admin.actions";

export function CategoriesManager({ categories }: { categories: Array<{ id: string; name: string; slug: string }> }) {
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    await createCategoryAction({ name: formData.get("name"), slug: formData.get("slug") });
    setPending(false);
  }

  return (
    <div className="space-y-6">
      <form action={submit} className="flex gap-2">
        <Input name="name" placeholder="Nombre" required />
        <Input name="slug" placeholder="slug" required />
        <Button disabled={pending}>Agregar</Button>
      </form>
      <table className="w-full text-sm">
        <thead><tr className="border-b text-left"><th className="py-2">Nombre</th><th className="py-2">Slug</th></tr></thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-b"><td className="py-2">{c.name}</td><td className="py-2">{c.slug}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
