"use client";

import { useTransition } from "react";
import { toggleUserStatusAction } from "@/modules/admin/actions/admin.actions";
import { Button } from "@/components/ui/button";

export function UsersTable({ users }: { users: Array<{ id: string; email: string; full_name: string; role: string; created_at: string; is_active?: boolean }> }) {
  const [pending, startTransition] = useTransition();

  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b text-left"><th className="py-2">Nombre</th><th className="py-2">Email</th><th className="py-2">Rol</th><th className="py-2">Estado</th><th className="py-2">Acciones</th></tr></thead>
      <tbody>
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
                onClick={() => startTransition(async () => {
                  await toggleUserStatusAction(u.id, u.is_active === false);
                  window.location.reload();
                })}
              >
                {u.is_active === false ? "Activar" : "Desactivar"}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
