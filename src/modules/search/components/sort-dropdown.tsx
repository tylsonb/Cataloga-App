"use client";

export function SortDropdown({ value = "newest" }: { value?: string }) {
  return (
    <select name="sort" defaultValue={value} className="rounded-lg border p-2 text-sm">
      <option value="newest">Más recientes</option>
      <option value="price_asc">Precio: menor a mayor</option>
      <option value="price_desc">Precio: mayor a menor</option>
      <option value="relevance">Relevancia</option>
    </select>
  );
}
