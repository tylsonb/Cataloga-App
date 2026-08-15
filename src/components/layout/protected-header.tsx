import Link from "next/link";
import { Store, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export async function ProtectedHeader() {
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

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Store className="text-primary" />
          Catáloga
        </Link>
        <Link href="/" className="ml-auto hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:flex">
          <ArrowLeft size={17} />
          Volver a la tienda
        </Link>
        <ThemeToggle />
        {user && <UserMenu profile={profile} role={role} />}
      </div>
    </header>
  );
}
