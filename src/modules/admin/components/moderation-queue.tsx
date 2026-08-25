"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resolveReportAction } from "@/modules/moderation/actions/moderation.actions";
import { Button } from "@/components/ui/button";

export function ModerationQueue({ reports }: { reports: Array<{ id: string; product_name: string; reason: string; status?: string }> }) {
  const [pending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  function handleResolve(reportId: string, resolution: "dismissed" | "resolved", pauseProduct: boolean) {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await resolveReportAction(reportId, resolution, pauseProduct);
      if (!res.success) {
        setErrorMessage(res.error);
        return;
      }
      router.refresh();
    });
  }

  if (!reports.length) return <p className="text-center text-muted-foreground py-10">No hay reportes pendientes. 🎉</p>;

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium">
          {errorMessage}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Producto</th>
              <th className="py-2">Motivo</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => {
              const isPending = (r.status ?? "pending") === "pending";
              return (
                <tr key={r.id} className="border-b">
                  <td className="py-2 font-medium">{r.product_name}</td>
                  <td className="py-2">{r.reason}</td>
                  <td className="py-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${
                      isPending
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        : r.status === "resolved"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    }`}>
                      {isPending ? "Pendiente" : r.status === "resolved" ? "Resuelto" : "Descartado"}
                    </span>
                  </td>
                  <td className="py-2">
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={pending}
                          onClick={() => {
                            if (confirm(`¿Pausar el producto "${r.product_name}" y marcar el reporte como resuelto?`)) {
                              handleResolve(r.id, "resolved", true);
                            }
                          }}
                        >
                          Pausar producto
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={pending}
                          onClick={() => handleResolve(r.id, "dismissed", false)}
                        >
                          Descartar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin acciones</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

