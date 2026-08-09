"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader, type UploadedImage } from "@/modules/product/components/image-uploader";
import { CURRENCIES } from "@/lib/constants";

type Result = { success: true } | { success: false; error: string };

type DefaultValues = { name?: string; description?: string | null; price?: number; category_id?: string; currency?: string };

export function ProductForm({ onSubmit, categories = [], defaultValues }: { onSubmit: (data: FormData) => Promise<Result | void>; categories?: Array<{ id: string; name: string }>; defaultValues?: DefaultValues }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const imageUrlsRef = useRef<UploadedImage[]>([]);

  async function submit(formData: FormData) {
    setPending(true);
    setError(undefined);
    const imageJson = JSON.stringify(imageUrlsRef.current);
    formData.append("images", imageJson);
    try {
      const result = await onSubmit(formData);
      if (result && !result.success) setError(result.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={submit} className="space-y-4">
      <label className="block text-sm font-medium">Nombre del producto<Input className="mt-1" name="name" defaultValue={defaultValues?.name} required /></label>
      <label className="block text-sm font-medium">Descripción<Input className="mt-1" name="description" defaultValue={defaultValues?.description ?? ""} /></label>
      <label className="block text-sm font-medium">Precio<div className="mt-1 flex gap-2"><Input name="price" type="number" min={0} defaultValue={defaultValues?.price} required className="flex-1" /><select name="currency" defaultValue={defaultValues?.currency ?? "CLP"} className="rounded-lg border bg-background p-2">{CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}</select></div></label>
      <label className="block text-sm font-medium">Categoría
        <select name="category_id" required defaultValue={defaultValues?.category_id ?? ""} className="mt-1 w-full rounded-lg border bg-background p-2">
          <option value="">Seleccionar categoría</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <ImageUploader onUpload={(images) => { imageUrlsRef.current = images; }} />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" disabled={pending}>{pending ? "Guardando..." : "Guardar producto"}</Button>
    </form>
  );
}
