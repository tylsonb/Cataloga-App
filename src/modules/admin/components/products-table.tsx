"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toggleProductStatusAction, deleteProductAdminAction } from "@/modules/admin/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/modules/shared/utils/format.util";

export function ProductsTable({ products }: { products: Array<{ id: string; name: string; price: number; currency?: string; status: string }> }) {
  const [pending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  function handleToggle(productId: string, currentStatus: string) {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await toggleProductStatusAction(productId, currentStatus === "published" ? "draft" : "published");
      if (!res.success) {
        setErrorMessage(res.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete(productId: string, productName: string) {
    if (!confirm(`¿Eliminar el producto "${productName}"?`)) return;
    setErrorMessage(null);
    startTransition(async () => {
      const res = await deleteProductAdminAction(productId);
      if (!res.success) {
        setErrorMessage(res.error);
        return;
      }
      router.refresh();
    });
  }

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
              <th className="py-2">Nombre</th>
              <th className="py-2">Precio</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2 font-medium">{p.name}</td>
                <td className="py-2">{formatPrice(p.price, p.currency ?? "CLP")}</td>
                <td className="py-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    p.status === "published"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}>
                    {p.status === "published" ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={() => handleToggle(p.id, p.status)}
                    >
                      {p.status === "published" ? "Pausar" : "Publicar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={pending}
                      onClick={() => handleDelete(p.id, p.name)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

