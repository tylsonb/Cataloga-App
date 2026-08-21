import type { Metadata } from "next";
import Link from "next/link";
import {
  Store,
  Search,
  MessageCircle,
  BarChart3,
  Heart,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Package,
} from "lucide-react";
import { InstallGuide } from "@/components/pwa/install-guide";

export const metadata: Metadata = {
  title: "Instala la App | Catáloga",
  description:
    "Instala Catáloga en tu Android, iPhone o computadora. Descubre y vende productos por WhatsApp con tu catálogo inteligente.",
};

const faqs = [
  {
    q: "¿Necesito descargarla de Google Play o App Store?",
    a: "No. Catáloga es una aplicación web progresiva (PWA): se instala directamente desde el navegador en menos de 30 segundos y ocupa menos de 2 MB.",
  },
  {
    q: "¿Cómo compro un producto?",
    a: "Busca el producto, revisa las fotos y el precio, y presiona el botón de WhatsApp. Se abrirá un chat directo con el vendedor con el mensaje del producto ya preparado.",
  },
  {
    q: "¿Cómo vendo mis productos?",
    a: "Crea tu cuenta, registra tu negocio y sube tus productos con fotos y precios. Obtendrás un catálogo con enlace propio para compartir con tus clientes.",
  },
  {
    q: "¿Cómo se actualiza la app?",
    a: "Automáticamente. Cada vez que la abras con internet tendrás la última versión, sin necesidad de descargar actualizaciones manualmente.",
  },
];

export default function AppLandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container flex flex-col items-center py-16 text-center md:py-24">
          <span className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium">
            <Smartphone size={16} className="text-primary" />
            Aplicación disponible para Android, iPhone y PC
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Lleva Catáloga en tu bolsillo: compra y vende por WhatsApp
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Catáloga es el catálogo inteligente que conecta compradores y vendedores por WhatsApp.
            Encuentra productos, guarda favoritos y contacta al vendedor con un solo toque.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#instalar"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Smartphone size={20} />
              Instalar la App
            </a>
            <Link
              href="/buscar"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border px-6 text-base font-medium transition-colors hover:bg-accent"
            >
              <Search size={18} />
              Explorar productos
            </Link>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="container py-16">
        <h2 className="text-center text-3xl font-bold">¿Qué puedes hacer con Catáloga?</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Search size={22} />
              </div>
              <h3 className="text-xl font-bold">Si eres comprador</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Search size={16} className="mt-0.5 shrink-0 text-primary" />
                Busca productos por nombre, categoría  sin perderte entre mensajes.
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-primary" />
                Contacta al vendedor por WhatsApp con el producto ya cargado en el mensaje.
              </li>
              <li className="flex items-start gap-2">
                <Heart size={16} className="mt-0.5 shrink-0 text-primary" />
                Guarda tus productos favoritos para volver a ellos cuando quieras.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" />
                Negocios verificados y moderados para una experiencia segura.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Store size={22} />
              </div>
              <h3 className="text-xl font-bold">Si eres vendedor</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Package size={16} className="mt-0.5 shrink-0 text-primary" />
                Crea tu catálogo digital con fotos, precios y descripciones en minutos.
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-primary" />
                Recibe pedidos directo en tu WhatsApp, sin intermediarios ni comisiones.
              </li>
              <li className="flex items-start gap-2">
                <BarChart3 size={16} className="mt-0.5 shrink-0 text-primary" />
                Mide las visitas y clics de tus productos con estadísticas en tiempo real.
              </li>
              <li className="flex items-start gap-2">
                <Store size={16} className="mt-0.5 shrink-0 text-primary" />
                Comparte el enlace de tu negocio en redes sociales y estados de WhatsApp.
              </li>
            </ul>
            <Link
              href="/registro"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Crear mi catálogo
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Install guide */}
      <section id="instalar" className="border-y bg-secondary/30 py-16 scroll-mt-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Instala la App en tu dispositivo</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Sin tiendas de aplicaciones, sin descargas pesadas. Elige tu dispositivo y sigue los pasos.
          </p>
          <div className="mt-10">
            <InstallGuide />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16">
        <h2 className="text-center text-3xl font-bold">Preguntas frecuentes</h2>
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-xl border bg-card p-5">
              <summary className="cursor-pointer list-none font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                {faq.q}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-primary/5 py-16">
        <div className="container flex flex-col items-center gap-5 text-center">
          <Store size={36} className="text-primary" />
          <h2 className="text-3xl font-bold">Empieza a usar Catáloga hoy</h2>
          <p className="max-w-xl text-muted-foreground">
            Instálala en tu teléfono y descubre una nueva forma de comprar y vender por WhatsApp.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#instalar"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Smartphone size={18} />
              Instalar la App
            </a>
            <Link
              href="/registro"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-6 text-sm font-medium transition-colors hover:bg-accent"
            >
              Crear mi cuenta
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
