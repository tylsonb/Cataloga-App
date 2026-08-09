"use client";

import { useState } from "react";
import Link from "next/link";
import { registerAction } from "@/modules/auth/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const [message, setMessage] = useState<string>(); const [error, setError] = useState<string>(); const [pending, setPending] = useState(false);
  async function submit(formData: FormData) { setPending(true); setError(undefined); const result = await registerAction({ fullName: formData.get("fullName"), email: formData.get("email"), password: formData.get("password") }); setPending(false); if (!result.success) return setError(result.error); setMessage("Revisa tu correo para confirmar tu cuenta."); }
  return <form action={submit} className="space-y-4"><label className="block text-sm font-medium">Nombre completo<Input className="mt-1" name="fullName" required minLength={2} autoComplete="name" /></label><label className="block text-sm font-medium">Correo<Input className="mt-1" name="email" type="email" required autoComplete="email" /></label><label className="block text-sm font-medium">Contraseña<Input className="mt-1" name="password" type="password" required minLength={8} autoComplete="new-password" /></label>{error && <p className="text-sm text-destructive">{error}</p>}{message && <p className="text-sm text-green-600">{message}</p>}<Button className="w-full" disabled={pending}>{pending ? "Creando cuenta..." : "Crear cuenta"}</Button><p className="text-center text-sm text-muted-foreground">¿Ya tienes cuenta? <Link href="/login" className="underline">Inicia sesión</Link></p></form>;
}
