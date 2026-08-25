import { ExportPanel } from "@/modules/admin/components/export-panel";

export const dynamic = "force-dynamic";

export default function AdminReportesPage() {
  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reportes</h1>
        <p className="mt-1 text-muted-foreground">Exporta los datos de la plataforma en formato CSV compatible con Excel.</p>
      </div>
      <ExportPanel />
    </div>
  );
}
