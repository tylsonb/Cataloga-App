"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";
import { exportDataAction } from "@/modules/admin/actions/admin.actions";
import { Button } from "@/components/ui/button";

const EXPORTS = [
  { table: "profiles", label: "Usuarios", description: "Perfiles registrados con nombre, correo y teléfono." },
  { table: "businesses", label: "Negocios", description: "Tiendas registradas con WhatsApp, ciudad y estado." },
  { table: "products", label: "Productos", description: "Catálogo completo con precios, monedas y estados." },
  { table: "categories", label: "Categorías", description: "Categorías con slugs y orden de despliegue." },
  { table: "subcategories", label: "Subcategorías", description: "Subcategorías vinculadas a cada categoría." },
] as const;

function toCsv(rows: Record<string, unknown>[]): string {
  const first = rows[0];
  if (!first) return "";
  const headers = Object.keys(first);
  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    const str = typeof value === "object" ? JSON.stringify(value) : String(value);
    return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = [headers.join(","), ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))];
  return "\uFEFF" + lines.join("\r\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ExportPanel() {
  const [pending, startTransition] = useTransition();
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleExport(table: string, label: string) {
    setFeedback(null);
    setActiveTable(table);
    startTransition(async () => {
      const result = await exportDataAction(table);
      setActiveTable(null);
      if (!result.success) {
        setFeedback({ type: "error", text: result.error ?? "No fue posible exportar los datos" });
        return;
      }
      const rows = (result.data ?? []) as Record<string, unknown>[];
      if (!rows.length) {
        setFeedback({ type: "error", text: `No hay datos en "${label}" para exportar.` });
        return;
      }
      const date = new Date().toISOString().slice(0, 10);
      downloadCsv(`cataloga-${table}-${date}.csv`, toCsv(rows));
      setFeedback({ type: "success", text: `Exportación de ${label} completada (${rows.length} registros).` });
    });
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div className={`rounded-lg border p-3 text-sm font-medium ${
          feedback.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
            : "border-destructive/20 bg-destructive/10 text-destructive"
        }`}>
          {feedback.text}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXPORTS.map((item) => (
          <div key={item.table} className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm">
            <div>
              <h3 className="font-semibold">{item.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
            <Button
              className="mt-4 w-full"
              variant="outline"
              disabled={pending}
              onClick={() => handleExport(item.table, item.label)}
            >
              <Download size={16} />
              {pending && activeTable === item.table ? "Exportando..." : "Descargar CSV"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
