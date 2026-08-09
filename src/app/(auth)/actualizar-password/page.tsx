import { UpdatePasswordForm } from "@/modules/auth/components/update-password-form";

export default function ActualizarPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Restablecer contraseña</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ingresa tu nueva contraseña</p>
      </div>
      <UpdatePasswordForm />
    </div>
  );
}
