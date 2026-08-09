import { createClient } from "@/lib/supabase/server";
import { dbError } from "@/lib/errors";
import { BusinessesTable } from "@/modules/admin/components/businesses-table";

export const dynamic = "force-dynamic";

export default async function AdminNegociosPage() {
  const supabase = await createClient();
  const { data: businesses, error } = await supabase.from("businesses").select("id, name, is_active, city");
  if (error) throw dbError("admin.businessesPage", error);
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Negocios</h1>
      <BusinessesTable businesses={businesses ?? []} />
    </div>
  );
}
