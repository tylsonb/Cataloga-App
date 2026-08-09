"use client";

export function SearchFilters({ categories }: { categories: Array<{ id: string; name: string }> }) {
  return (
    <div className="space-y-4">
      <select name="category_id" className="w-full rounded-lg border p-2">
        <option value="">Todas las categorías</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
  );
}
