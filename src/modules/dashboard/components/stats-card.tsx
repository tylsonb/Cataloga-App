export function StatsCard({ label, value, icon: Icon }: { label: string; value: number | string; icon?: React.ComponentType<{ size?: number }> }) {
  return (
    <div className="rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && <Icon size={20} />}
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
