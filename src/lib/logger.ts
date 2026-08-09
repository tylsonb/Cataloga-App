type LogContext = Record<string, string | number | boolean | null | undefined>;

export function logError(scope: string, error: unknown, context?: LogContext): void {
  console.error(`[cataloga] ${scope}`, { error, ...context });
}

export function logWarn(scope: string, message: string, context?: LogContext): void {
  console.warn(`[cataloga] ${scope}`, { message, ...context });
}
