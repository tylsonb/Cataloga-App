"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";

export function InstallBanner() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA (Android / Desktop Chrome / iOS Safari)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setIsInstalled(true);
    }
  }, []);

  // If the app is already installed and opened as PWA, do not show the install banner
  if (isInstalled) {
    return null;
  }

  return (
    <section className="container py-16 [@media(display-mode:standalone)]:hidden">
      <div className="flex flex-col items-center gap-5 rounded-3xl border-2 border-primary/20 bg-primary/5 p-10 text-center md:p-14">
        <Smartphone size={36} className="text-primary" />
        <h2 className="text-3xl font-bold">Lleva Catáloga en tu teléfono</h2>
        <p className="max-w-xl text-muted-foreground">
          Instala nuestra app en tu Android o iPhone en menos de 30 segundos. Sin tiendas de aplicaciones y con menos de 2 MB.
        </p>
        <Link
          href="/app"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Smartphone size={18} />
          Instalar la App
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
