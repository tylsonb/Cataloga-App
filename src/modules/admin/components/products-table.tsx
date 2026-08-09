"use client";

import { useTransition } from "react";
import { toggleProductStatusAction, deleteProductAdminAction } from "@/modules/admin/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/modules/shared/hooks/use-toast";

export function ProductsTable({ products }: { products: Array<{ id: string; name: string; price: number; status: string }> }) {
  const [pending, startTransition] = useTransition();

  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b text-left"><th className="py-2">Nombre</th><th className="py-2">Precio</th><th className="py-2">Estado</th><th className="py-2">Acciones</th></tr></thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b">
            <td className="py-2">{p.name}</td>
            <td className="py-2">${p.price.toLocaleString("es-CL")}</td>
            <td className="py-2">{p.status === "published" ? "Publicado" : "Borrador"}</td>
            <td className="py-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => startTransition(async () => {
                  const result = await toggleProductStatusAction(p.id, p.status === "published" ? "draft" : "published");
                  if (!result.success) {
                    toast({ title: "Error", description: result.error, variant: "destructive" });
                    return;
                  }
                  window.location.reload();
                })}
              >
                {p.status === "published" ? "Pausar" : "Publicar"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={pending}
                onClick={() => {
                  if (!confirm("¿Eliminar este producto?")) return;
                  startTransition(async () => {
                    const result = await deleteProductAdminAction(p.id);
                    if (!result.success) {
                      toast({ title: "Error", description: result.error, variant: "destructive" });
                      return;
                    }
                    window.location.reload();
                  });
                }}
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
