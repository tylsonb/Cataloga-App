"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/modules/favorites/actions/favorites.actions";
import { toast } from "@/modules/shared/hooks/use-toast";

export function FavoriteButton({ productId, initialFavorited = false }: { productId: string; initialFavorited?: boolean }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const result = await toggleFavoriteAction(productId);
      if (!result.success) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        return;
      }
      setFavorited(result.favorited ?? false);
    });
  }

  return (
    <button onClick={toggle} disabled={pending} className={`flex items-center gap-2 rounded-lg border p-2 transition-colors ${favorited ? "border-red-500 text-red-500" : "hover:bg-accent"}`}>
      <Heart size={20} fill={favorited ? "currentColor" : "none"} />
      <span className="text-sm">{favorited ? "Favorito" : "Agregar a favoritos"}</span>
    </button>
  );
}
