import Link from "next/link";

export function BusinessCard({ name, slug, description, logoUrl }: { name: string; slug: string; description?: string | null; logoUrl?: string | null }) {
  return (
    <Link href={`/negocio/${slug}`} className="block rounded-xl border p-5 transition-colors hover:bg-accent">
      <div className="flex items-center gap-3">
        {logoUrl && <img src={logoUrl} alt={name} className="h-12 w-12 rounded-full object-cover" />}
        <div>
          <h3 className="font-bold">{name}</h3>
          {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
        </div>
      </div>
    </Link>
  );
}
