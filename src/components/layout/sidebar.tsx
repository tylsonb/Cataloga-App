"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Store,
  Settings,
  ShieldAlert,
  Users,
  FolderTree,
  Flag,
  BarChart3,
  Home,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const sellerNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/productos", label: "Mis Productos", icon: Package },
  { href: "/dashboard/negocio", label: "Mi Negocio", icon: Store },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
];

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: ShieldAlert },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/negocios", label: "Negocios", icon: Store },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/moderacion", label: "Moderación", icon: Flag },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
];

export function Sidebar({ items, variant = "seller" }: { items?: NavItem[]; variant?: "seller" | "admin" }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = items ?? (variant === "admin" ? adminNavItems : sellerNavItems);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <Store className="text-primary" size={18} />
          <span>Catáloga</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary font-normal">
            {variant === "admin" ? "Admin" : "Vendedor"}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex w-4/5 max-w-xs flex-col border-r bg-background p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b pb-4">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <Store className="text-primary" size={20} />
                Catáloga
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1.5 pt-4">
              <span className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {variant === "admin" ? "Panel Administrador" : "Panel Vendedor"}
              </span>
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}

              <div className="mt-auto border-t pt-4">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Home size={18} />
                  Volver a la tienda
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r md:block">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Store className="text-primary" size={20} />
            Catáloga
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-secondary text-foreground font-semibold" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 mt-2 border-t pt-4"
          >
            <Home size={18} />
            Ver tienda
          </Link>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t bg-background/95 px-2 backdrop-blur md:hidden">
        {variant === "seller" ? (
          <>
            <Link
              href="/dashboard"
              className={`flex flex-col items-center gap-1 text-xs ${
                pathname === "/dashboard" ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/productos"
              className={`flex flex-col items-center gap-1 text-xs ${
                pathname.startsWith("/dashboard/productos") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <Package size={20} />
              <span>Productos</span>
            </Link>
            <Link
              href="/dashboard/negocio"
              className={`flex flex-col items-center gap-1 text-xs ${
                pathname.startsWith("/dashboard/negocio") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <Store size={20} />
              <span>Negocio</span>
            </Link>
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
            >
              <Home size={20} />
              <span>Tienda</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/admin"
              className={`flex flex-col items-center gap-1 text-xs ${
                pathname === "/admin" ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <ShieldAlert size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/usuarios"
              className={`flex flex-col items-center gap-1 text-xs ${
                pathname.startsWith("/admin/usuarios") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <Users size={20} />
              <span>Usuarios</span>
            </Link>
            <Link
              href="/admin/negocios"
              className={`flex flex-col items-center gap-1 text-xs ${
                pathname.startsWith("/admin/negocios") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <Store size={20} />
              <span>Negocios</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
            >
              <Menu size={20} />
              <span>Más</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
}
