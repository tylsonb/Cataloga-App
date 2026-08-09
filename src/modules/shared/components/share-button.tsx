"use client";

import { Share2 } from "lucide-react";
import { logError } from "@/lib/logger";
import { toast } from "@/modules/shared/hooks/use-toast";

/** Thrown by the Web Share API when the user dismisses the share sheet. */
function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function ShareButton({ url, title }: { url: string; title: string }) {
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast({ title: "Enlace copiado" });
    } catch (error) {
      if (isAbort(error)) return;
      logError("shared.shareButton", error, { url });
      toast({ title: "Error", description: "No fue posible compartir el enlace", variant: "destructive" });
    }
  }
  return (
    <button onClick={share} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent">
      <Share2 size={18} />
      <span className="text-sm">Compartir</span>
    </button>
  );
}
