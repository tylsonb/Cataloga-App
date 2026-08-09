"use client";

import { useState } from "react";

export function ProductGallery({ images }: { images: Array<{ url: string; alt_text?: string | null }> }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="aspect-square rounded-xl bg-secondary" />;
  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
        <img src={images[active]?.url} alt={images[active]?.alt_text ?? ""} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${active === i ? "border-primary" : "border-transparent"}`}>
              <img src={img.url} alt={img.alt_text ?? ""} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
