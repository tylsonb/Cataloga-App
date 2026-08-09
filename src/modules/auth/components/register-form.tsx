"use client";

import Link from "next/link";
import { registerAction } from "@/modules/auth/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormFeedback } from "@/modules/shared/components/form-feedback";
import { useFormAction } from "@/modules/shared/hooks/use-form-action.hook";

export function RegisterForm() {
  const { pending, error, message, submit } = useFormAction(
    (formData) => registerAction({ fullName: formData.get("fullName"), email: formData.get("email"), password: formData.get("password") }),
    { successMessage: "Revisa tu correo para confirmar tu cuenta." }
  );

  return (
    <form action={submit} className="space-y-4">
      <label className="block text-sm font-medium">Nombre completo<Input className="mt-1" name="fullName" required minLength={2} autoComplete="name" /></label>
      <label className="block text-sm font-medium">Correo<Input className="mt-1" name="email" type="email" required autoComplete="email" /></label>
      <label className="block text-sm font-medium">Contraseña<Input className="mt-1" name="password" type="password" required minLength={8} autoComplete="new-password" /></label>
      <FormFeedback error={error} message={message} />
      <Button className="w-full" disabled={pending}>{pending ? "Creando cuenta..." : "Crear cuenta"}</Button>
      <p className="text-center text-sm text-muted-foreground">¿Ya tienes cuenta? <Link href="/login" className="underline">Inicia sesión</Link></p>
    </form>
  );
}
