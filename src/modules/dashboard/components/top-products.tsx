export function TopProducts({ products }: { products: Array<{ id: string; name: string; view_count: number }> }) {
  if (!products.length) return null;
  return (
    <div className="rounded-xl border p-5">
      <h3 className="mb-4 font-bold">Productos más vistos</h3>
      <ol className="space-y-2">
        {products.map((p, i) => (
          <li key={p.id} className="flex items-center justify-between text-sm">
            <span>{i + 1}. {p.name}</span>
            <span className="text-muted-foreground">{p.view_count} visitas</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
