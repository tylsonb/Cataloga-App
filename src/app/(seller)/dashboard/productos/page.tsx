import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProductsByBusinessAction } from "@/modules/product/actions/product.actions";
import { getBusinessByOwner } from "@/modules/business/repositories/business.repository";
import { getCurrentUser } from "@/lib/supabase/auth";
import { ProductListTable } from "@/modules/product/components/product-list-table";

export const dynamic = "force-dynamic";

export default async function MisProductosPage() {
  const user = await getCurrentUser();
  const business = user ? await getBusinessByOwner(user.id) : null;
  const products = business ? await getProductsByBusinessAction(business.id) : [];
  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Productos</h1>
        <Link href="/dashboard/productos/nuevo"><Button>Nuevo producto</Button></Link>
      </div>
      <ProductListTable products={products as never} />
    </div>
  );
}
