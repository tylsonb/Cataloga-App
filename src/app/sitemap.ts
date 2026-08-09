import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/buscar`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  const [{ data: products }, { data: businesses }, { data: categories }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("status", "published").is("deleted_at", null),
    supabase.from("businesses").select("slug, updated_at").eq("is_active", true),
    supabase.from("categories").select("slug").eq("is_active", true),
  ]);

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${SITE_URL}/producto/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const businessUrls: MetadataRoute.Sitemap = (businesses ?? []).map((b) => ({
    url: `${SITE_URL}/negocio/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const categoryUrls: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${SITE_URL}/categoria/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticUrls, ...productUrls, ...businessUrls, ...categoryUrls];
}
