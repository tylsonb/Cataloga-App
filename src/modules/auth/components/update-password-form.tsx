"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePasswordAction } from "@/modules/auth/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError(undefined);
    const result = await updatePasswordAction({
      password: formData.get("password"),
    });
    setPending(false);
    if (!result.success) return setError(result.error);
    router.push("/");
    router.refresh();
  }

  return (
    <form action={submit} className="space-y-4">
      <label className="block text-sm font-medium">
        Nueva contraseña
        <Input className="mt-1" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" disabled={pending}>
        {pending ? "Guardando..." : "Guardar contraseña"}
      </Button>
    </form>
  );
}
