"use client";

import { useEffect } from "react";
import { logError } from "@/lib/logger";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error: unknown) => logError("sw.register", error));
    }
  }, []);
  return null;
}
