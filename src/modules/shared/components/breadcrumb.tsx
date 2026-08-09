import Link from "next/link";

export function Breadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {item.href ? <Link href={item.href} className="hover:underline">{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
