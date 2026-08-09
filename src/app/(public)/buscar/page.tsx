import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchResults } from "@/modules/search/components/search-results";
import { searchProductsAction } from "@/modules/search/actions/search-products.action";
import { createClient } from "@/lib/supabase/server";
import { Pagination } from "@/modules/shared/components/pagination";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; sort?: string; category_id?: string }> }) {
  const params = await searchParams;
  const q = params.q ?? "";
  const page = Number(params.page ?? "1");
  const sort = (params.sort as "newest" | "price_asc" | "price_desc" | "relevance") ?? "newest";

  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order");

  const hasFilters = q || params.category_id;
  const { items, total } = hasFilters
    ? await searchProductsAction({ q: q || undefined, page, sort, pageSize: 24, category_id: params.category_id })
    : { items: [], total: 0 };

  const totalPages = Math.ceil(total / 24);

  return <section className="container py-10"><h1 className="text-3xl font-bold">Buscar productos</h1><form className="mt-6 flex max-w-xl gap-2"><Input name="q" defaultValue={q} placeholder="¿Qué estás buscando?" /><select name="category_id" defaultValue={params.category_id ?? ""} className="rounded-lg border bg-background p-2"><option value="">Todas</option>{(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><Button type="submit"><Search size={18} />Buscar</Button></form>{hasFilters && (<><p className="mt-4 text-sm text-muted-foreground">{total} resultado{total !== 1 && "s"}{q && ` para "${q}"`}</p><div className="mt-6">{items.length > 0 ? <SearchResults results={items} /> : <p className="text-muted-foreground">No se encontraron productos.</p>}</div>{totalPages > 1 && <div className="mt-8"><Pagination page={page} totalPages={totalPages} /></div>}</>)}{!hasFilters && <div className="mt-10 rounded-xl border border-dashed p-12 text-center text-muted-foreground">Escribe algo o selecciona una categoría para buscar productos.</div>}</section>;
}
