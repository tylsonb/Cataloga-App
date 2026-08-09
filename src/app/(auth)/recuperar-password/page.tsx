import Link from "next/link";
import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";

export default function ResetPasswordPage() { return <section className="rounded-xl border bg-card p-6 shadow-sm"><h1 className="text-2xl font-bold">Recupera tu contraseña</h1><p className="mt-1 text-sm text-muted-foreground">Te enviaremos un enlace para restablecerla.</p><div className="mt-6"><ResetPasswordForm /></div><Link className="mt-5 block text-center text-sm underline" href="/login">Volver a iniciar sesión</Link></section>; }
