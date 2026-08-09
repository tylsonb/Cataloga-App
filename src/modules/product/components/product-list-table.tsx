import Link from "next/link";
import { DataTable } from "@/modules/shared/components/data-table";
import { formatPrice } from "@/modules/shared/utils/format.util";

export function ProductListTable({ products }: { products: Array<{ id: string; name: string; price: number; status: string; is_featured: boolean }> }) {
  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Aún no has creado productos. Haz click en &quot;Nuevo producto&quot; para empezar.</p>;
  }
  return (
    <DataTable headers={["Nombre", "Precio", "Estado", "Acciones"]}>
      {products.map((p) => (
        <tr key={p.id} className="border-b">
          <td className="py-2">{p.name}</td>
          <td className="py-2">{formatPrice(p.price)}</td>
          <td className="py-2">{p.status === "published" ? "Publicado" : "Borrador"}</td>
          <td className="py-2"><Link href={`/dashboard/productos/${p.id}/editar`} className="text-primary hover:underline">Editar</Link></td>
        </tr>
      ))}
    </DataTable>
  );
}
