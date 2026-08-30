import Link from "next/link";
import { Heart, Search, Smartphone, Store } from "lucide-react";
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
      supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
    ]);
    profile = p;
    role = r?.role ?? "buyer";
  }

  return <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur"><div className="container flex h-16 items-center gap-3"><Link href="/" className="flex items-center gap-2 font-bold text-xl"><Store className="text-primary" />Catáloga</Link><Link href="/buscar" className="ml-auto hidden items-center gap-2 text-sm text-muted-foreground md:flex"><Search size={17} />Buscar</Link><Link href="/app" className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex [@media(display-mode:standalone)]:hidden"><Smartphone size={17} />App Móvil</Link><ThemeToggle />{user ? (<><Link href="/favoritos" className="hidden md:flex"><Button variant="ghost" size="icon" aria-label="Favoritos"><Heart size={18} /></Button></Link><UserMenu profile={profile} role={role} /></>) : (<Link href="/login" className="inline-flex min-h-[48px] h-12 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover shadow-md">Ingresar</Link>)}</div></header>;
}
