"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleProductStatusAction, deleteProductAdminAction } from "@/modules/admin/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/modules/shared/utils/format.util";

export function ProductsTable({ products }: { products: Array<{ id: string; name: string; price: number; currency?: string; status: string }> }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b text-left"><th className="py-2">Nombre</th><th className="py-2">Precio</th><th className="py-2">Estado</th><th className="py-2">Acciones</th></tr></thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b">
            <td className="py-2">{p.name}</td>
            <td className="py-2">{formatPrice(p.price, p.currency ?? "CLP")}</td>
            <td className="py-2">{p.status === "published" ? "Publicado" : "Borrador"}</td>
            <td className="py-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => startTransition(async () => {
                  await toggleProductStatusAction(p.id, p.status === "published" ? "draft" : "published");
                  router.refresh();
                })}
              >
                {p.status === "published" ? "Pausar" : "Publicar"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={pending}
                onClick={() => { if (confirm("¿Eliminar este producto?")) startTransition(async () => { await deleteProductAdminAction(p.id); router.refresh(); }); }}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
