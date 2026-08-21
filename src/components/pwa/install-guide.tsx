"use client";

import { useState, useEffect } from "react";
import {
  Smartphone,
  Apple,
  Monitor,
  Download,
  Share2,
  PlusSquare,
  MoreVertical,
  CheckCircle2,
  Zap,
  HardDrive,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallGuide() {
  const [activeTab, setActiveTab] = useState<"android" | "ios" | "desktop">("android");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || "";
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setActiveTab("ios");
    } else if (/android/i.test(userAgent)) {
      setActiveTab("android");
    } else {
      setActiveTab("desktop");
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  }

  const tabs = [
    { id: "android" as const, label: "Android", icon: Smartphone, color: "text-green-500" },
    { id: "ios" as const, label: "iPhone / iPad", icon: Apple, color: "text-neutral-700 dark:text-neutral-200" },
    { id: "desktop" as const, label: "PC / Mac", icon: Monitor, color: "text-blue-500" },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl">
      {deferredPrompt && !isInstalled && (
        <div className="mb-8 rounded-2xl border-2 border-primary/40 bg-primary/5 p-6 text-center shadow-lg">
          <Smartphone className="mx-auto mb-2 text-primary" size={32} />
          <h3 className="text-xl font-bold">¡Tu dispositivo es compatible con instalación directa!</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Presiona el botón para agregar Catáloga a tu pantalla de inicio con 1 solo toque.
          </p>
          <Button size="lg" onClick={handleInstallClick} className="mt-4 gap-2 text-base font-semibold">
            <Download size={20} />
            Instalar Catáloga ahora
          </Button>
        </div>
      )}

      {isInstalled && (
        <div className="mb-8 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-center">
          <CheckCircle2 className="mx-auto mb-1 text-green-600" size={28} />
          <p className="font-semibold text-green-700 dark:text-green-300">¡Catáloga ya está instalada en este dispositivo!</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Ábrela desde tu pantalla de inicio o lista de aplicaciones.</p>
        </div>
      )}

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <HardDrive size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold">Ultra ligera</h4>
            <p className="text-xs text-muted-foreground">Pesa menos de 2 MB. No satura tu teléfono.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <Zap size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold">Acceso inmediato</h4>
            <p className="text-xs text-muted-foreground">Ábrela con un toque desde tu pantalla de inicio.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <Wifi size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold">Siempre actualizada</h4>
            <p className="text-xs text-muted-foreground">Mejoras al instante, sin pasar por tiendas de apps.</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-1 rounded-xl border bg-muted/50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={18} className={tab.color} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "android" && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3 border-b pb-4">
            <div className="rounded-full bg-green-500/10 p-3 text-green-600">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Instalar en Android (Google Chrome)</h3>
              <p className="text-xs text-muted-foreground">Solo 3 pasos y en menos de 30 segundos</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</div>
              <div>
                <h4 className="font-semibold">Abre el menú de Chrome</h4>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Toca el botón de los <strong>tres puntos verticales <MoreVertical className="inline" size={14} /></strong> en la esquina superior derecha del navegador.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</div>
              <div>
                <h4 className="font-semibold">Toca &quot;Agregar a la pantalla principal&quot;</h4>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Busca la opción <strong>&quot;Instalar aplicación&quot;</strong> o <strong>&quot;Agregar a la pantalla principal&quot;</strong> en el menú.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</div>
              <div>
                <h4 className="font-semibold">Confirma con &quot;Instalar&quot;</h4>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Presiona <strong>&quot;Instalar&quot;</strong> en el mensaje emergente. ¡Listo! El icono de Catáloga aparecerá junto a tus demás apps.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ios" && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3 border-b pb-4">
            <div className="rounded-full bg-neutral-500/10 p-3 text-neutral-800 dark:text-neutral-200">
              <Apple size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Instalar en iPhone / iPad (Safari)</h3>
              <p className="text-xs text-muted-foreground">En iOS la instalación se hace desde Safari</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</div>
              <div>
                <h4 className="font-semibold">Abre esta página en Safari</h4>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Asegúrate de usar <strong>Safari</strong>. Si estás en otro navegador, copia el enlace y pégalo en Safari.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</div>
              <div>
                <h4 className="font-semibold">Toca el botón Compartir</h4>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Presiona <strong>Compartir <Share2 className="inline text-blue-500" size={14} /></strong> en la barra inferior (el cuadrado con la flecha hacia arriba).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</div>
              <div>
                <h4 className="font-semibold">Selecciona &quot;Agregar a inicio&quot;</h4>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Desliza hacia abajo, toca <strong>&quot;Agregar a inicio&quot; <PlusSquare className="inline" size={14} /></strong> y confirma con <strong>&quot;Agregar&quot;</strong>. El icono aparecerá en tu pantalla.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "desktop" && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3 border-b pb-4">
            <div className="rounded-full bg-blue-500/10 p-3 text-blue-600">
              <Monitor size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Instalar en Computadora (Chrome o Edge)</h3>
              <p className="text-xs text-muted-foreground">Úsala como una aplicación de escritorio independiente</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</div>
              <div>
                <h4 className="font-semibold">Busca el icono de instalar</h4>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  En el extremo derecho de la barra de direcciones verás el icono <strong>Instalar <Download className="inline text-primary" size={14} /></strong> (una pantalla con flecha hacia abajo).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</div>
              <div>
                <h4 className="font-semibold">Confirma la instalación</h4>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Haz clic y confirma en <strong>&quot;¿Instalar Catáloga?&quot;</strong>. La app se abrirá en su propia ventana, como programa nativo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
