"use client";

import { resetPasswordAction } from "@/modules/auth/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormFeedback } from "@/modules/shared/components/form-feedback";
import { useFormAction } from "@/modules/shared/hooks/use-form-action.hook";

export function ResetPasswordForm() {
  const { pending, error, message, submit } = useFormAction(
    (formData) => resetPasswordAction({ email: formData.get("email") }),
    { successMessage: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña." }
  );

  return (
    <form action={submit} className="space-y-4">
      <label className="block text-sm font-medium">Correo<Input className="mt-1" name="email" type="email" required autoComplete="email" /></label>
      <FormFeedback error={error} message={message} />
      <Button className="w-full" disabled={pending}>{pending ? "Enviando..." : "Enviar instrucciones"}</Button>
    </form>
  );
}
