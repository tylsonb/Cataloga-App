export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      {page > 1 && <a href={`?page=${page - 1}`} className="rounded-lg border px-3 py-1 text-sm">Anterior</a>}
      <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
      {page < totalPages && <a href={`?page=${page + 1}`} className="rounded-lg border px-3 py-1 text-sm">Siguiente</a>}
    </div>
  );
}
