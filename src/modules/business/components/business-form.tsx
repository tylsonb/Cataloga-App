"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormFeedback } from "@/modules/shared/components/form-feedback";
import { useFormAction } from "@/modules/shared/hooks/use-form-action.hook";
import type { Result } from "@/modules/shared/types/result.type";

type DefaultValues = { name?: string; description?: string | null; whatsapp?: string; city?: string | null; category_id?: string | null };

export function BusinessForm({ onSubmit, categories = [], defaultValues }: { onSubmit: (data: FormData) => Promise<Result | void>; categories?: Array<{ id: string; name: string }>; defaultValues?: DefaultValues }) {
  const { pending, error, submit } = useFormAction(onSubmit);

  return (
    <form action={submit} className="space-y-4">
      <label className="block text-sm font-medium">Nombre del negocio<Input className="mt-1" name="name" defaultValue={defaultValues?.name} required /></label>
      <label className="block text-sm font-medium">Descripción<Input className="mt-1" name="description" defaultValue={defaultValues?.description ?? ""} /></label>
      <label className="block text-sm font-medium">WhatsApp<Input className="mt-1" name="whatsapp" defaultValue={defaultValues?.whatsapp} required placeholder="+56912345678" /></label>
      <label className="block text-sm font-medium">Ciudad<Input className="mt-1" name="city" defaultValue={defaultValues?.city ?? ""} /></label>
      {categories.length > 0 && (
        <label className="block text-sm font-medium">Categoría
          <select name="category_id" defaultValue={defaultValues?.category_id ?? ""} className="mt-1 w-full rounded-lg border bg-background p-2">
            <option value="">Sin categoría</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      )}
      <FormFeedback error={error} />
      <Button className="w-full" disabled={pending}>{pending ? "Guardando..." : "Guardar negocio"}</Button>
    </form>
  );
}
