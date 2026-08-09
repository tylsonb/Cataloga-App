"use client";

import { useState } from "react";
import type { Result } from "@/modules/shared/types/result.type";

type Options = {
  successMessage?: string;
  onSuccess?: () => void;
};

export function useFormAction(action: (formData: FormData) => Promise<Result | void>, options: Options = {}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function submit(formData: FormData) {
    setPending(true);
    setError(undefined);
    setMessage(undefined);
    const result = await action(formData);
    setPending(false);
    if (result && !result.success) {
      setError(result.error);
      return;
    }
    if (options.successMessage) setMessage(options.successMessage);
    options.onSuccess?.();
  }

  return { pending, error, message, setError, setPending, submit };
}
