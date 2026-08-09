"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Store, Settings, ShieldAlert, Users, FolderTree, Flag, BarChart3, Home } from "lucide-react";
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
  const navItems = items ?? (variant === "admin" ? adminNavItems : sellerNavItems);
  return (
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-secondary" : "hover:bg-secondary/50"}`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 mt-2 border-t pt-4">
          <Home size={18} />
          Ver tienda
        </Link>
      </nav>
    </aside>
  );
}
