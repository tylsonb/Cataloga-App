export function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-xl bg-secondary" />
          <div className="mt-2 h-4 w-3/4 rounded bg-secondary" />
          <div className="mt-1 h-4 w-1/2 rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}
