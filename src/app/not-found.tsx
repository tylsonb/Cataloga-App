import Link from "next/link";

export default function NotFound() { return <main className="grid min-h-screen place-items-center p-6 text-center"><div><p className="text-sm font-medium text-muted-foreground">404</p><h1 className="mt-2 text-3xl font-bold">Página no encontrada</h1><p className="mt-3 text-muted-foreground">La página que buscas no existe o ya no está disponible.</p><Link href="/" className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-primary-foreground">Volver al inicio</Link></div></main>; }
