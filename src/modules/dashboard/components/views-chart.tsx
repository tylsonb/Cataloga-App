"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export function ViewsChart({ data }: { data: Array<{ date: string; count: number }> }) {
  if (!data.length) return <div className="rounded-xl border p-8 text-center text-muted-foreground">Sin datos de visitas</div>;
  return (
    <div className="rounded-xl border p-5">
      <h3 className="mb-4 font-bold">Visitas en el tiempo</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
