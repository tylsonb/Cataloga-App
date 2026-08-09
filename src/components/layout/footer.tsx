import Link from "next/link";

export function Footer() {
  return <footer className="border-t py-8"><div className="container flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"><p>© {new Date().getFullYear()} Catáloga</p><nav className="flex gap-4"><Link href="/terminos">Términos</Link><Link href="/privacidad">Privacidad</Link></nav></div></footer>;
}
