export function safeRedirectPath(next: string | null | undefined, fallback = "/"): string {
  if (!next) return fallback;
  if (next[0] !== "/") return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
