export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-dashed p-12 text-center">
      <h3 className="font-bold">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
