import { RegisterForm } from "@/modules/auth/components/register-form";

export default function RegisterPage() { return <section className="rounded-xl border bg-card p-6 shadow-sm"><h1 className="text-2xl font-bold">Crea tu cuenta</h1><p className="mt-1 text-sm text-muted-foreground">Descubre productos y crea tu catálogo.</p><div className="mt-6"><RegisterForm /></div></section>; }
