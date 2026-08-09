"use client";

import { useTransition } from "react";

export function useRowAction() {
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<unknown>) {
    startTransition(async () => {
      await action();
      window.location.reload();
    });
  }

  function runConfirmed(confirmMessage: string, action: () => Promise<unknown>) {
    if (confirm(confirmMessage)) run(action);
  }

  return { pending, run, runConfirmed };
}
