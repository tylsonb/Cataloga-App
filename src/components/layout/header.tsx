import Link from "next/link";
import { Heart, Search, Store } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let role = "buyer";
  if (user) {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single(),
      supabase.from("user_roles").select("role").eq("user_id", user.id).single(),
    ]);
    profile = p;
    role = r?.role ?? "buyer";
  }

  return <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur"><div className="container flex h-16 items-center gap-3"><Link href="/" className="flex items-center gap-2 font-bold text-xl"><Store className="text-primary" />Catáloga</Link><Link href="/buscar" className="ml-auto hidden items-center gap-2 text-sm text-muted-foreground md:flex"><Search size={17} />Buscar</Link><ThemeToggle />{user ? (<><Link href="/favoritos"><Button variant="ghost" size="icon" aria-label="Favoritos"><Heart size={18} /></Button></Link><UserMenu profile={profile} role={role} /></>) : (<Link href="/login" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Ingresar</Link>)}</div></header>;
}
