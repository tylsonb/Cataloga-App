"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  useEffect(() => setQuery(initialQuery), [initialQuery]);
  return (
    <form action="/buscar" className="flex gap-2">
      <Input name="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="¿Qué estás buscando?" />
      <Button type="submit"><Search size={18} /></Button>
    </form>
  );
}
