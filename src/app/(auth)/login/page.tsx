import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/modules/auth/components/login-form";

export default function LoginPage() {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Bienvenido de vuelta</h1>
      <p className="mt-1 text-sm text-muted-foreground">Ingresa para continuar en Catáloga.</p>
      <div className="mt-6">
        <Suspense fallback={<div className="h-48 animate-pulse bg-muted rounded" />}>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta? <Link className="underline" href="/registro">Regístrate</Link>
      </p>
    </section>
  );
}
