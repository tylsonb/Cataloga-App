import Link from "next/link";
import { formatPrice } from "@/modules/shared/utils/format.util";

export function ProductListTable({ products }: { products: Array<{ id: string; name: string; price: number; currency?: string; status: string; is_featured: boolean }> }) {
  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Aún no has creado productos. Haz click en "Nuevo producto" para empezar.</p>;
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2">Nombre</th>
          <th className="py-2">Precio</th>
          <th className="py-2">Estado</th>
          <th className="py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b">
            <td className="py-2">{p.name}</td>
            <td className="py-2 font-medium">{formatPrice(p.price, p.currency ?? "CLP")}</td>
            <td className="py-2">{p.status === "published" ? "Publicado" : "Borrador"}</td>
            <td className="py-2"><Link href={`/dashboard/productos/${p.id}/editar`} className="text-primary hover:underline">Editar</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
