"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type UploadedImage = { url: string; alt_text: string };

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function ImageUploader({ onUpload, maxImages = 5 }: { onUpload?: (images: UploadedImage[]) => void; maxImages?: number }) {
  const [previews, setPreviews] = useState<{ localUrl: string; uploaded: UploadedImage | null }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const previewsRef = useRef(previews);
  previewsRef.current = previews;

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((p) => URL.revokeObjectURL(p.localUrl));
    };
  }, []);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList).slice(0, maxImages - previews.length);
    setError(undefined);

    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      setError(`Cada imagen debe pesar máximo 2 MB. ${oversized.length} archivo(s) excede(n) el límite.`);
      return;
    }

    const invalid = files.filter((f) => !ALLOWED_TYPES[f.type]);
    if (invalid.length > 0) {
      setError("Solo se permiten imágenes JPG, PNG, WEBP o AVIF.");
      return;
    }

    setUploading(true);
    const supabase = createClient();

    const newPreviews: { localUrl: string; uploaded: UploadedImage | null }[] = [];
    for (const file of files) {
      const localUrl = URL.createObjectURL(file);
      const ext = ALLOWED_TYPES[file.type];
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { contentType: file.type });
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(fileName);
        newPreviews.push({ localUrl, uploaded: { url: publicUrl, alt_text: file.name.replace(/\.[^.]+$/, "") } });
      } else {
        newPreviews.push({ localUrl, uploaded: null });
      }
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
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.localUrl);
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
