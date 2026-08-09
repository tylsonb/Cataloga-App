"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return <Button variant="ghost" size="icon" aria-label="Cambiar tema" onClick={() => setTheme(isDark ? "light" : "dark")}>{isDark ? <Sun size={18} /> : <Moon size={18} />}</Button>;
}
