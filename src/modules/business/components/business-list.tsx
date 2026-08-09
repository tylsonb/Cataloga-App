import { BusinessCard } from "./business-card";

export function BusinessList({ businesses }: { businesses: Array<{ name: string; slug: string; description?: string | null; logo_url?: string | null }> }) {
  if (!businesses.length) return <p className="text-center text-muted-foreground">No hay negocios para mostrar.</p>;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{businesses.map((b) => <BusinessCard key={b.slug} name={b.name} slug={b.slug} description={b.description} logoUrl={b.logo_url} />)}</div>;
}
