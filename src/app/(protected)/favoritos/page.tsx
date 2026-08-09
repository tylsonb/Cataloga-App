import { getFavoritesAction } from "@/modules/favorites/actions/favorites.actions";
import { FavoritesList } from "@/modules/favorites/components/favorites-list";

export const dynamic = "force-dynamic";

export default async function FavoritosPage() {
  const favorites = await getFavoritesAction();
  const products = favorites
    .map((f) => f.products)
    .filter((p): p is { id: string; name: string; slug: string; price: number; currency: string; image_url: string | null } => p !== null)
    .map((p) => ({ ...p, image_url: p.image_url ?? undefined }));
  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">Mis Favoritos</h1>
      <div className="mt-8">
        <FavoritesList products={products} />
      </div>
    </section>
  );
}
