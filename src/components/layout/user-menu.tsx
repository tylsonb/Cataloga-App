"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/modules/auth/actions/auth.actions";
import { LogOut, LayoutDashboard, Heart, User, Store } from "lucide-react";

type Profile = { full_name: string; avatar_url: string | null } | null;

export function UserMenu({ profile, role }: { profile: Profile; role: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const result = await logoutAction();
    if (!result.success) return;
    router.push("/");
    router.refresh();
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "U";

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
        aria-label="Menú de usuario"
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          initials
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-background p-1 shadow-lg">
          <div className="border-b px-3 py-2">
            <p className="text-sm font-medium">{profile?.full_name || "Usuario"}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
          <Link href="/perfil" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <User size={16} /> Perfil
          </Link>
          <Link href="/favoritos" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Heart size={16} /> Favoritos
          </Link>
          {(role === "seller" || role === "admin") && (
            <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}
          {role === "buyer" && (
            <Link href="/negocio/crear" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
              <Store size={16} /> Vender
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-accent">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
