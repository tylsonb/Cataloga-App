"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guards";
import type { Result } from "@/modules/shared/types/result.type";

const REPORT_REASONS = [
  "Contenido inapropiado",
  "Producto prohibido",
  "Posible estafa",
  "Precio engañoso",
  "Spam o duplicado",
  "Otro",
] as const;

const reportSchema = z.object({
  productId: z.string().uuid(),
  reason: z.enum(REPORT_REASONS),
});

export async function reportProductAction(input: unknown): Promise<Result> {
  try {
    const parsed = reportSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Selecciona un motivo válido" };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Debes iniciar sesión para reportar un producto" };

    const { data: existing } = await supabase
      .from("reports")
      .select("id")
      .eq("product_id", parsed.data.productId)
      .eq("reporter_id", user.id)
      .eq("status", "pending")
      .maybeSingle();
    if (existing) return { success: false, error: "Ya reportaste este producto. Nuestro equipo lo revisará pronto." };

    const { error } = await supabase.from("reports").insert({
      product_id: parsed.data.productId,
      reporter_id: user.id,
      reason: parsed.data.reason,
      status: "pending",
    });
    if (error) return { success: false, error: "No fue posible enviar el reporte" };
    return { success: true };
  } catch {
    return { success: false, error: "Error en el servidor al enviar el reporte" };
  }
}

export async function resolveReportAction(reportId: string, resolution: "dismissed" | "resolved", pauseProduct: boolean): Promise<Result> {
  try {
    if (!(await requireAdmin())) return { success: false, error: "No autorizado" };
    const supabase = await createClient();

    const { data: report } = await supabase.from("reports").select("id, product_id").eq("id", reportId).maybeSingle();
    if (!report) return { success: false, error: "Reporte no encontrado" };

    if (pauseProduct && report.product_id) {
      const { error: productError } = await supabase.from("products").update({ status: "draft" }).eq("id", report.product_id);
      if (productError) return { success: false, error: "No fue posible pausar el producto" };
    }

    const { error } = await supabase.from("reports").update({ status: resolution }).eq("id", reportId);
    if (error) return { success: false, error: "No fue posible actualizar el reporte" };

    revalidatePath("/admin/moderacion");
    revalidatePath("/admin/productos");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Error en el servidor al resolver el reporte" };
  }
}
