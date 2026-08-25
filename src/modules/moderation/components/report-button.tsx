"use client";

import { useState, useTransition } from "react";
import { Flag } from "lucide-react";
import { reportProductAction } from "@/modules/moderation/actions/moderation.actions";
import { Button } from "@/components/ui/button";

const REASONS = [
  "Contenido inapropiado",
  "Producto prohibido",
  "Posible estafa",
  "Precio engañoso",
  "Spam o duplicado",
  "Otro",
] as const;

export function ReportButton({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submitReport(reason: (typeof REASONS)[number]) {
    setFeedback(null);
    startTransition(async () => {
      const result = await reportProductAction({ productId, reason });
      if (!result.success) {
        setFeedback({ type: "error", text: result.error });
        return;
      }
      setFeedback({ type: "success", text: "Reporte enviado. Gracias por ayudarnos a mantener Catáloga segura." });
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => { setOpen(!open); setFeedback(null); }}>
        <Flag size={15} />
        Reportar
      </Button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border bg-popover p-2 shadow-lg">
          <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">¿Cuál es el problema?</p>
          {REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              disabled={pending}
              onClick={() => submitReport(reason)}
              className="block w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent disabled:opacity-50"
            >
              {reason}
            </button>
          ))}
        </div>
      )}
      {feedback && (
        <p className={`absolute right-0 top-full z-40 mt-2 w-64 rounded-lg border p-2 text-xs shadow-md ${
          feedback.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
            : "border-destructive/20 bg-destructive/10 text-destructive"
        }`}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}
