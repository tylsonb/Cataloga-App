"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/modules/auth/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter(); const [error, setError] = useState<string>(); const [pending, setPending] = useState(false);
  async function submit(formData: FormData) { setPending(true); setError(undefined); const result = await loginAction({ email: formData.get("email"), password: formData.get("password") }); setPending(false); if (!result.success) return setError(result.error); router.push("/"); router.refresh(); }
  return <form action={submit} className="space-y-4"><label className="block text-sm font-medium">Correo<Input className="mt-1" name="email" type="email" required autoComplete="email" /></label><label className="block text-sm font-medium">Contraseña<Input className="mt-1" name="password" type="password" required minLength={8} autoComplete="current-password" /></label>{error && <p className="text-sm text-destructive">{error}</p>}<Button className="w-full" disabled={pending}>{pending ? "Ingresando..." : "Iniciar sesión"}</Button><Link href="/recuperar-password" className="block text-center text-sm text-muted-foreground hover:underline">¿Olvidaste tu contraseña?</Link></form>;
}
