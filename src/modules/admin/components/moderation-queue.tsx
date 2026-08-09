import { DataTable } from "@/modules/shared/components/data-table";

export function ModerationQueue({ reports }: { reports: Array<{ id: string; product_name: string; reason: string; status?: string }> }) {
  if (!reports.length) return <p className="text-center text-muted-foreground">No hay reportes pendientes.</p>;
  return (
    <DataTable headers={["Producto", "Motivo", "Estado"]}>
      {reports.map((r) => (
        <tr key={r.id} className="border-b"><td className="py-2">{r.product_name}</td><td className="py-2">{r.reason}</td><td className="py-2 capitalize">{r.status ?? "pending"}</td></tr>
      ))}
    </DataTable>
  );
}
