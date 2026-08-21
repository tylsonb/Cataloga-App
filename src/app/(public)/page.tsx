import Link from "next/link";
import { ArrowRight, Search, Smartphone, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/modules/product/components/product-card";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: featuredProducts }] = await Promise.all([
    supabase.from("categories").select("id, name, slug, icon").eq("is_active", true).order("sort_order"),
    supabase.from("products").select("id, name, slug, price, currency, business_id, product_images(url)").eq("status", "published").eq("is_featured", true).is("deleted_at", null).order("view_count", { ascending: false }).limit(8),
  ]);

  const mappedFeatured = (featuredProducts ?? []).map((p) => {
    const images = (p as Record<string, unknown>).product_images as { url: string }[] | undefined;
    return { ...p, image_url: images?.[0]?.url };
  });

  return <><section className="container py-20 text-center md:py-32"><span className="rounded-full bg-secondary px-4 py-2 text-sm font-medium">Tu catálogo inteligente para WhatsApp</span><h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">Encuentra lo que buscas sin perderte entre mensajes.</h1><p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Descubre productos y servicios de negocios que venden por WhatsApp. Contacta directamente al vendedor cuando encuentres lo que necesitas.</p><form action="/buscar" className="mx-auto mt-8 flex max-w-2xl gap-2"><Input name="q" placeholder="¿Qué estás buscando?" className="h-12" /><Button size="lg" type="submit"><Search size={18} />Buscar</Button></form></section><section className="container pb-20"><h2 className="text-2xl font-bold">Explora por categoría</h2><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{(categories ?? []).map((category) => <Link href={`/categoria/${category.slug}`} key={category.id} className="rounded-xl border p-5 text-center font-medium transition-colors hover:bg-accent"><span className="mb-2 block text-2xl">{category.icon}</span>{category.name}</Link>)}</div></section>{mappedFeatured.length > 0 && (<section className="border-y bg-secondary/30 py-16"><div className="container"><h2 className="mb-6 text-2xl font-bold">Productos destacados</h2><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{mappedFeatured.map((p) => <ProductCard key={p.id} name={p.name} slug={p.slug} price={p.price} currency={p.currency} imageUrl={p.image_url} />)}</div></div></section>)}<section className="container py-16"><div className="flex flex-col items-center gap-5 rounded-3xl border-2 border-primary/20 bg-primary/5 p-10 text-center md:p-14"><Smartphone size={36} className="text-primary" /><h2 className="text-3xl font-bold">Lleva Catáloga en tu teléfono</h2><p className="max-w-xl text-muted-foreground">Instala nuestra app en tu Android o iPhone en menos de 30 segundos. Sin tiendas de aplicaciones y con menos de 2 MB.</p><Link href="/app" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><Smartphone size={18} />Instalar la App<ArrowRight size={16} /></Link></div></section><section className="py-16"><div className="container flex flex-col items-center gap-5 py-16 text-center"><Store size={36} /><h2 className="text-3xl font-bold">¿Vendes por WhatsApp?</h2><p className="max-w-xl text-muted-foreground">Crea tu catálogo, comparte tus productos y llega a más compradores.</p><Link href="/registro" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-primary/90">Crea tu catálogo gratis <ArrowRight size={18} /></Link></div></section></>;
}
