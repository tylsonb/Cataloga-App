"use client";

import { toggleProductStatusAction, deleteProductAdminAction } from "@/modules/admin/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/modules/shared/components/data-table";
import { useRowAction } from "@/modules/shared/hooks/use-row-action.hook";
import { formatPrice } from "@/modules/shared/utils/format.util";

export function ProductsTable({ products }: { products: Array<{ id: string; name: string; price: number; status: string }> }) {
  const { pending, run, runConfirmed } = useRowAction();

  return (
    <DataTable headers={["Nombre", "Precio", "Estado", "Acciones"]}>
      {products.map((p) => (
        <tr key={p.id} className="border-b">
          <td className="py-2">{p.name}</td>
          <td className="py-2">{formatPrice(p.price)}</td>
          <td className="py-2">{p.status === "published" ? "Publicado" : "Borrador"}</td>
          <td className="py-2 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => run(() => toggleProductStatusAction(p.id, p.status === "published" ? "draft" : "published"))}
            >
              {p.status === "published" ? "Pausar" : "Publicar"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() => runConfirmed("¿Eliminar este producto?", () => deleteProductAdminAction(p.id))}
            >
              Eliminar
            </Button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
