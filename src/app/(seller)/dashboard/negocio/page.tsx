import { getBusinessByOwnerAction } from "@/modules/business/actions/business.actions";
import { createClient } from "@/lib/supabase/server";
import { BusinessInfo } from "@/modules/business/components/business-info";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MiNegocioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const business = await getBusinessByOwnerAction(user.id);
  if (!business) return <div className="p-10 text-center text-muted-foreground">No tienes un negocio. <Link href="/negocio/crear" className="text-primary underline">Crear uno</Link></div>;
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Mi Negocio</h1>
      <BusinessInfo name={business.name} whatsapp={business.whatsapp} city={business.city} address={business.address} />
      <div className="mt-6"><Link href="/dashboard/negocio/editar" className="text-primary hover:underline">Editar negocio</Link></div>
    </div>
  );
}
