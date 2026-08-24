"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toggleUserStatusAction, deleteUserAdminAction } from "@/modules/admin/actions/admin.actions";
import { Button } from "@/components/ui/button";

export function UsersTable({ users }: { users: Array<{ id: string; email: string; full_name: string; role: string; created_at: string; is_active?: boolean }> }) {
  const [pending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  function handleToggle(userId: string, activate: boolean) {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await toggleUserStatusAction(userId, activate);
      if (!res.success) {
        setErrorMessage(res.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete(userId: string, userName: string) {
    if (!confirm(`¿Estás seguro de eliminar al usuario "${userName || userId}"?\n\nEsta acción eliminará su cuenta, negocio, productos y fotos asociadas de forma permanente.`)) {
      return;
    }
    setErrorMessage(null);
    startTransition(async () => {
      const res = await deleteUserAdminAction(userId);
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
              <th className="py-2">Email</th>
              <th className="py-2">Rol</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2 font-medium">{u.full_name || "—"}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2 capitalize">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    u.role === "admin"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : u.role === "seller"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    u.is_active === false
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  }`}>
                    {u.is_active === false ? "Inactivo" : "Activo"}
                  </span>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={() => handleToggle(u.id, u.is_active === false)}
                    >
                      {u.is_active === false ? "Activar" : "Desactivar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={pending}
                      onClick={() => handleDelete(u.id, u.full_name || u.email)}
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

