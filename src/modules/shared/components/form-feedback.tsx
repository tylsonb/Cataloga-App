export function FormFeedback({ error, message }: { error?: string; message?: string }) {
  return (
    <>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
    </>
  );
}
