"use client";

import { useRouter } from "next/navigation";
import { updatePasswordAction } from "@/modules/auth/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormFeedback } from "@/modules/shared/components/form-feedback";
import { useFormAction } from "@/modules/shared/hooks/use-form-action.hook";

export function UpdatePasswordForm() {
  const router = useRouter();
  const { pending, error, submit } = useFormAction(
    (formData) => updatePasswordAction({ password: formData.get("password") }),
    { onSuccess: () => { router.push("/"); router.refresh(); } }
  );

  return (
    <form action={submit} className="space-y-4">
      <label className="block text-sm font-medium">
        Nueva contraseña
        <Input className="mt-1" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </label>
      <FormFeedback error={error} />
      <Button className="w-full" disabled={pending}>
        {pending ? "Guardando..." : "Guardar contraseña"}
      </Button>
    </form>
  );
}
