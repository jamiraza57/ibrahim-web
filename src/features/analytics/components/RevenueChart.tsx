"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { RevenuePoint } from "../services/analytics.service";

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.13 85)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="oklch(0.7 0.13 85)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.82 0.012 80 / 0.5)" />
        <XAxis
          dataKey="date"
          stroke="oklch(0.46 0.012 75)"
          fontSize={12}
          tickFormatter={(d: string) => d.slice(5)}
          minTickGap={24}
        />
        <YAxis stroke="oklch(0.46 0.012 75)" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "oklch(1 0 0)",
            border: "1px solid oklch(0.82 0.012 80 / 0.6)",
            borderRadius: 8,
          }}
          labelStyle={{ color: "oklch(0.2 0.006 60)" }}
        />
        <Area type="monotone" dataKey="revenue" stroke="oklch(0.7 0.13 85)" strokeWidth={2} fill="url(#goldFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
