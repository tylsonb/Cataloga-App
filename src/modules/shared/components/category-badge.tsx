export function CategoryBadge({ name, slug }: { name: string; slug?: string }) {
  return <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium">{name}</span>;
}
