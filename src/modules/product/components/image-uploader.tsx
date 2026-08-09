"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { logError } from "@/lib/logger";

export type UploadedImage = { url: string; alt_text: string };

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export function ImageUploader({ onUpload, maxImages = 5 }: { onUpload?: (images: UploadedImage[]) => void; maxImages?: number }) {
  const [previews, setPreviews] = useState<{ localUrl: string; uploaded: UploadedImage | null }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList).slice(0, maxImages - previews.length);
    setError(undefined);

    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      setError(`Cada imagen debe pesar máximo 2 MB. ${oversized.length} archivo(s) excede(n) el límite.`);
      return;
    }

    setUploading(true);
    const supabase = createClient();

    const newPreviews: { localUrl: string; uploaded: UploadedImage | null }[] = [];
    const failed: string[] = [];
    for (const file of files) {
      const localUrl = URL.createObjectURL(file);
      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);
      if (uploadError) {
        logError("product.imageUploader.upload", uploadError, { fileName });
        failed.push(file.name);
        newPreviews.push({ localUrl, uploaded: null });
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(fileName);
      newPreviews.push({ localUrl, uploaded: { url: publicUrl, alt_text: file.name.replace(/\.[^.]+$/, "") } });
    }

    if (failed.length > 0) {
      setError(`No se pudo subir ${failed.length} imagen(es): ${failed.join(", ")}. Intenta de nuevo.`);
    }

    setPreviews((prev) => {
      const updated = [...prev, ...newPreviews];
      const validImages = updated.map((p) => p.uploaded).filter((img): img is UploadedImage => img !== null);
      onUpload?.(validImages);
      return updated;
    });
    setUploading(false);
  }

  function removePreview(index: number) {
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const validImages = updated.map((p) => p.uploaded).filter((img): img is UploadedImage => img !== null);
      onUpload?.(validImages);
      return updated;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {previews.map((p, i) => (
          <div key={i} className="relative h-24 w-24 overflow-hidden rounded-lg border">
            <img src={p.localUrl} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => removePreview(i)} className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white">
              <X size={14} />
            </button>
          </div>
        ))}
        {previews.length < maxImages && (
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground hover:bg-accent">
            <Upload size={20} />
            <span>Subir</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </label>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {uploading && <p className="text-sm text-muted-foreground">Subiendo imágenes...</p>}
    </div>
  );
}
