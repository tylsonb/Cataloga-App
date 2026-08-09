"use client";

import Link from "next/link";
import { Home, Search, Heart, User } from "lucide-react";

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background py-2 md:hidden">
      <Link href="/" className="flex flex-col items-center gap-1 text-xs">
        <Home size={20} />
        <span>Inicio</span>
      </Link>
      <Link href="/buscar" className="flex flex-col items-center gap-1 text-xs">
        <Search size={20} />
        <span>Buscar</span>
      </Link>
      <Link href="/favoritos" className="flex flex-col items-center gap-1 text-xs">
        <Heart size={20} />
        <span>Favoritos</span>
      </Link>
      <Link href="/perfil" className="flex flex-col items-center gap-1 text-xs">
        <User size={20} />
        <span>Perfil</span>
      </Link>
    </nav>
  );
}
