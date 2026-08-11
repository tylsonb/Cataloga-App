"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Result = { success: true } | { success: false; error: string };

type DefaultValues = { name?: string; description?: string | null; whatsapp?: string; city?: string | null; category_id?: string | null };

export function BusinessForm({ onSubmit, categories = [], defaultValues }: { onSubmit: (data: FormData) => Promise<Result | void>; categories?: Array<{ id: string; name: string }>; defaultValues?: DefaultValues }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(formData: FormData) {
    setPending(true);
    setError(undefined);
    try {
      const result = await onSubmit(formData);
      if (result && !result.success) setError(result.error);
    } catch (err) {
      // redirect() throws a special NEXT_REDIRECT error — let it propagate.
      if ((err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setPending(false);
    }
  }

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
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" disabled={pending}>{pending ? "Guardando..." : "Guardar negocio"}</Button>
    </form>
  );
}
