"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h2 className="text-2xl font-bold">Algo salió mal</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground">
        Intentar de nuevo
      </button>
    </div>
  );
}
