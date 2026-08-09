"use client";

import { toggleUserStatusAction } from "@/modules/admin/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/modules/shared/components/data-table";
import { useRowAction } from "@/modules/shared/hooks/use-row-action.hook";

export function UsersTable({ users }: { users: Array<{ id: string; email: string; full_name: string; role: string; created_at: string; is_active?: boolean }> }) {
  const { pending, run } = useRowAction();

  return (
    <DataTable headers={["Nombre", "Email", "Rol", "Estado", "Acciones"]}>
      {users.map((u) => (
        <tr key={u.id} className="border-b">
          <td className="py-2">{u.full_name}</td>
          <td className="py-2">{u.email}</td>
          <td className="py-2 capitalize">{u.role}</td>
          <td className="py-2">{u.is_active === false ? "Inactivo" : "Activo"}</td>
          <td className="py-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => run(() => toggleUserStatusAction(u.id, u.is_active === false))}
            >
              {u.is_active === false ? "Activar" : "Desactivar"}
            </Button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
