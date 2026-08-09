import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, price, currency, business_id")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  let businessName = "";
  if (product?.business_id) {
    const { data: business } = await supabase
      .from("businesses")
      .select("name")
      .eq("id", product.business_id)
      .single();
    businessName = business?.name ?? "";
  }

  const productName = product?.name ?? "Catáloga";
  const price = product ? `$${Number(product.price).toLocaleString("es-CL")}` : "";
  const currency = product?.currency === "USD" ? "US$" : "";

  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "60px", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: 28, color: "#94a3b8", fontWeight: 600 }}>
        <span style={{ color: "#22c55e", fontSize: 32, marginRight: 10 }}>Catáloga</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: "white", lineHeight: 1.1, maxWidth: 900 }}>
          {productName}
        </div>
        {price && (
          <div style={{ fontSize: 42, fontWeight: 700, color: "#22c55e" }}>
            {currency}{price}
          </div>
        )}
        {businessName && (
          <div style={{ fontSize: 28, color: "#cbd5e1" }}>
            Vendido por {businessName}
          </div>
        )}
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#64748b" }}>
        Encuentra productos y servicios que se venden por WhatsApp
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
