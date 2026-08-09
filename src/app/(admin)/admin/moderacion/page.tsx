import { createClient } from "@/lib/supabase/server";
import { dbError } from "@/lib/errors";
import { ModerationQueue } from "@/modules/admin/components/moderation-queue";

export const dynamic = "force-dynamic";

export default async function AdminModeracionPage() {
  const supabase = await createClient();
  const { data: reports, error } = await supabase.from("reports")
    .select("id, reason, status, created_at, product_id, products(name)")
    .order("created_at", { ascending: false });
  if (error) throw dbError("admin.moderationPage", error);
  const reportList = (reports ?? []).map((r) => {
    const products = (r as Record<string, unknown>).products as { name: string }[] | { name: string } | null;
    const productName = Array.isArray(products) ? products[0]?.name : products?.name;
    return {
      id: r.id,
      product_name: productName ?? r.product_id,
      reason: r.reason ?? "Sin motivo",
      status: r.status ?? "pending",
    };
  });
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Moderación</h1>
      <ModerationQueue reports={reportList} />
    </div>
  );
}
