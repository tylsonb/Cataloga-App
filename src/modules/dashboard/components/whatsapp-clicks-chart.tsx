"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export function WhatsappClicksChart({ data }: { data: Array<{ date: string; count: number }> }) {
  if (!data.length) return <div className="rounded-xl border p-8 text-center text-muted-foreground">Sin datos de clicks de WhatsApp</div>;
  return (
    <div className="rounded-xl border p-5">
      <h3 className="mb-4 font-bold">Clicks de WhatsApp</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Bar dataKey="count" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
