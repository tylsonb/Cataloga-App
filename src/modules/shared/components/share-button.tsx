"use client";

import { Share2 } from "lucide-react";

export function ShareButton({ url, title }: { url: string; title: string }) {
  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  }
  return (
    <button onClick={share} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent">
      <Share2 size={18} />
      <span className="text-sm">Compartir</span>
    </button>
  );
}
