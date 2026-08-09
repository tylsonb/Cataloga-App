import type { Result } from "@/modules/shared/types/result.type";

export function ok(): Result {
  return { success: true };
}

export function fail(error: string): Result {
  return { success: false, error };
}

export const ERROR_INVALID_INPUT = "Revisa los datos ingresados";
export const ERROR_NO_SESSION = "No hay sesión activa";
