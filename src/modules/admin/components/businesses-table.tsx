"use client";

import { useTransition } from "react";
import { toggleBusinessStatusAdminAction } from "@/modules/admin/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/modules/shared/hooks/use-toast";

export function BusinessesTable({ businesses }: { businesses: Array<{ id: string; name: string; is_active: boolean; city?: string | null }> }) {
  const [pending, startTransition] = useTransition();

  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b text-left"><th className="py-2">Nombre</th><th className="py-2">Ciudad</th><th className="py-2">Estado</th><th className="py-2">Acciones</th></tr></thead>
      <tbody>
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
                onClick={() => startTransition(async () => {
                  const result = await toggleBusinessStatusAdminAction(b.id, !b.is_active);
                  if (!result.success) {
                    toast({ title: "Error", description: result.error, variant: "destructive" });
                    return;
                  }
                  window.location.reload();
                })}
              >
                {b.is_active ? "Pausar" : "Activar"}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
