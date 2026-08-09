"use client";

import { useState } from "react";
import { resetPasswordAction } from "@/modules/auth/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm() {
  const [message, setMessage] = useState<string>(); const [error, setError] = useState<string>(); const [pending, setPending] = useState(false);
  async function submit(formData: FormData) { setPending(true); setError(undefined); const result = await resetPasswordAction({ email: formData.get("email") }); setPending(false); if (!result.success) return setError(result.error); setMessage("Si el correo existe, recibirás instrucciones para restablecer tu contraseña."); }
  return <form action={submit} className="space-y-4"><label className="block text-sm font-medium">Correo<Input className="mt-1" name="email" type="email" required autoComplete="email" /></label>{error && <p className="text-sm text-destructive">{error}</p>}{message && <p className="text-sm text-green-600">{message}</p>}<Button className="w-full" disabled={pending}>{pending ? "Enviando..." : "Enviar instrucciones"}</Button></form>;
}
