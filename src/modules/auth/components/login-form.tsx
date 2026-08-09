"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/modules/auth/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormFeedback } from "@/modules/shared/components/form-feedback";
import { useFormAction } from "@/modules/shared/hooks/use-form-action.hook";

export function LoginForm() {
  const router = useRouter();
  const { pending, error, submit } = useFormAction(
    (formData) => loginAction({ email: formData.get("email"), password: formData.get("password") }),
    { onSuccess: () => { router.push("/"); router.refresh(); } }
  );

  return (
    <form action={submit} className="space-y-4">
      <label className="block text-sm font-medium">Correo<Input className="mt-1" name="email" type="email" required autoComplete="email" /></label>
      <label className="block text-sm font-medium">Contraseña<Input className="mt-1" name="password" type="password" required minLength={8} autoComplete="current-password" /></label>
      <FormFeedback error={error} />
      <Button className="w-full" disabled={pending}>{pending ? "Ingresando..." : "Iniciar sesión"}</Button>
      <Link href="/recuperar-password" className="block text-center text-sm text-muted-foreground hover:underline">¿Olvidaste tu contraseña?</Link>
    </form>
  );
}
