"use client";

import { toggleBusinessStatusAdminAction } from "@/modules/admin/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/modules/shared/components/data-table";
import { useRowAction } from "@/modules/shared/hooks/use-row-action.hook";

export function BusinessesTable({ businesses }: { businesses: Array<{ id: string; name: string; is_active: boolean; city?: string | null }> }) {
  const { pending, run } = useRowAction();

  return (
    <DataTable headers={["Nombre", "Ciudad", "Estado", "Acciones"]}>
      {businesses.map((b) => (
        <tr key={b.id} className="border-b">
          <td className="py-2">{b.name}</td>
          <td className="py-2">{b.city ?? "—"}</td>
          <td className="py-2">{b.is_active ? "Activo" : "Pausado"}</td>
          <td className="py-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => run(() => toggleBusinessStatusAdminAction(b.id, !b.is_active))}
            >
              {b.is_active ? "Pausar" : "Activar"}
            </Button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
