"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Simple fake JSON data - no complex logic
const fakeAnalyticsData = {
  orders: [
    { date: "2025-01-01", value: 245 },
    { date: "2025-01-02", value: 189 },
    { date: "2025-01-03", value: 312 },
    { date: "2025-01-04", value: 278 },
    { date: "2025-01-05", value: 356 },
    { date: "2025-01-06", value: 198 },
    { date: "2025-01-07", value: 167 },
    { date: "2025-01-08", value: 289 },
    { date: "2025-01-09", value: 334 },
    { date: "2025-01-10", value: 401 },
    { date: "2025-01-11", value: 378 },
    { date: "2025-01-12", value: 445 },
    { date: "2025-01-13", value: 267 },
    { date: "2025-01-14", value: 223 },
    { date: "2025-01-15", value: 389 },
    { date: "2025-01-16", value: 412 },
    { date: "2025-01-17", value: 298 },
    { date: "2025-01-18", value: 356 },
    { date: "2025-01-19", value: 467 },
    { date: "2025-01-20", value: 234 },
    { date: "2025-01-21", value: 189 },
    { date: "2025-01-22", value: 345 },
    { date: "2025-01-23", value: 423 },
    { date: "2025-01-24", value: 378 },
    { date: "2025-01-25", value: 512 },
    { date: "2025-01-26", value: 289 },
    { date: "2025-01-27", value: 167 },
    { date: "2025-01-28", value: 334 },
    { date: "2025-01-29", value: 445 },
    { date: "2025-01-30", value: 523 },
  ],
  revenue: [
    { date: "2025-01-01", value: 12450 },
    { date: "2025-01-02", value: 8920 },
    { date: "2025-01-03", value: 15680 },
    { date: "2025-01-04", value: 13420 },
    { date: "2025-01-05", value: 18920 },
    { date: "2025-01-06", value: 9780 },
    { date: "2025-01-07", value: 8230 },
    { date: "2025-01-08", value: 14560 },
    { date: "2025-01-09", value: 16780 },
    { date: "2025-01-10", value: 20150 },
    { date: "2025-01-11", value: 18920 },
    { date: "2025-01-12", value: 22340 },
    { date: "2025-01-13", value: 13450 },
    { date: "2025-01-14", value: 11230 },
    { date: "2025-01-15", value: 19450 },
    { date: "2025-01-16", value: 20680 },
    { date: "2025-01-17", value: 14920 },
    { date: "2025-01-18", value: 17890 },
    { date: "2025-01-19", value: 23450 },
    { date: "2025-01-20", value: 11780 },
    { date: "2025-01-21", value: 9450 },
    { date: "2025-01-22", value: 17230 },
    { date: "2025-01-23", value: 21150 },
    { date: "2025-01-24", value: 18920 },
    { date: "2025-01-25", value: 25670 },
    { date: "2025-01-26", value: 14450 },
    { date: "2025-01-27", value: 8340 },
    { date: "2025-01-28", value: 16780 },
    { date: "2025-01-29", value: 22340 },
    { date: "2025-01-30", value: 26150 },
  ],
  conversionRate: [
    { date: "2025-01-01", value: 3.2 },
    { date: "2025-01-02", value: 2.8 },
    { date: "2025-01-03", value: 3.5 },
    { date: "2025-01-04", value: 3.1 },
    { date: "2025-01-05", value: 3.8 },
    { date: "2025-01-06", value: 2.9 },
    { date: "2025-01-07", value: 2.5 },
    { date: "2025-01-08", value: 3.4 },
    { date: "2025-01-09", value: 3.7 },
    { date: "2025-01-10", value: 4.1 },
    { date: "2025-01-11", value: 3.9 },
    { date: "2025-01-12", value: 4.3 },
    { date: "2025-01-13", value: 3.2 },
    { date: "2025-01-14", value: 2.9 },
    { date: "2025-01-15", value: 3.8 },
    { date: "2025-01-16", value: 4.0 },
    { date: "2025-01-17", value: 3.3 },
    { date: "2025-01-18", value: 3.6 },
    { date: "2025-01-19", value: 4.2 },
    { date: "2025-01-20", value: 3.1 },
    { date: "2025-01-21", value: 2.7 },
    { date: "2025-01-22", value: 3.5 },
    { date: "2025-01-23", value: 4.1 },
    { date: "2025-01-24", value: 3.8 },
    { date: "2025-01-25", value: 4.5 },
    { date: "2025-01-26", value: 3.4 },
    { date: "2025-01-27", value: 2.6 },
    { date: "2025-01-28", value: 3.7 },
    { date: "2025-01-29", value: 4.2 },
    { date: "2025-01-30", value: 4.6 },
  ],
  categories: [
    { date: "Dresses", value: 1250 },
    { date: "Tops", value: 980 },
    { date: "Bottoms", value: 850 },
    { date: "Accessories", value: 650 },
    { date: "Shoes", value: 720 },
    { date: "Outerwear", value: 420 },
  ],
  dailyActiveUsers: [
    { date: "2025-01-01", value: 2450 },
    { date: "2025-01-02", value: 1890 },
    { date: "2025-01-03", value: 3120 },
    { date: "2025-01-04", value: 2780 },
    { date: "2025-01-05", value: 3560 },
    { date: "2025-01-06", value: 1980 },
    { date: "2025-01-07", value: 1670 },
    { date: "2025-01-08", value: 2890 },
    { date: "2025-01-09", value: 3340 },
    { date: "2025-01-10", value: 4010 },
    { date: "2025-01-11", value: 3780 },
    { date: "2025-01-12", value: 4450 },
    { date: "2025-01-13", value: 2670 },
    { date: "2025-01-14", value: 2230 },
    { date: "2025-01-15", value: 3890 },
    { date: "2025-01-16", value: 4120 },
    { date: "2025-01-17", value: 2980 },
    { date: "2025-01-18", value: 3560 },
    { date: "2025-01-19", value: 4670 },
    { date: "2025-01-20", value: 2340 },
    { date: "2025-01-21", value: 1890 },
    { date: "2025-01-22", value: 3450 },
    { date: "2025-01-23", value: 4230 },
    { date: "2025-01-24", value: 3780 },
    { date: "2025-01-25", value: 5120 },
    { date: "2025-01-26", value: 2890 },
    { date: "2025-01-27", value: 1670 },
    { date: "2025-01-28", value: 3340 },
    { date: "2025-01-29", value: 4450 },
    { date: "2025-01-30", value: 5230 },
  ],
  userGrowth: [
    { date: "2025-01-01", value: 85 },
    { date: "2025-01-02", value: 72 },
    { date: "2025-01-03", value: 94 },
    { date: "2025-01-04", value: 81 },
    { date: "2025-01-05", value: 103 },
    { date: "2025-01-06", value: 68 },
    { date: "2025-01-07", value: 59 },
    { date: "2025-01-08", value: 87 },
    { date: "2025-01-09", value: 96 },
    { date: "2025-01-10", value: 108 },
    { date: "2025-01-11", value: 101 },
    { date: "2025-01-12", value: 115 },
    { date: "2025-01-13", value: 78 },
    { date: "2025-01-14", value: 65 },
    { date: "2025-01-15", value: 99 },
    { date: "2025-01-16", value: 105 },
    { date: "2025-01-17", value: 82 },
    { date: "2025-01-18", value: 91 },
    { date: "2025-01-19", value: 112 },
    { date: "2025-01-20", value: 73 },
    { date: "2025-01-21", value: 61 },
    { date: "2025-01-22", value: 89 },
    { date: "2025-01-23", value: 107 },
    { date: "2025-01-24", value: 98 },
    { date: "2025-01-25", value: 125 },
    { date: "2025-01-26", value: 84 },
    { date: "2025-01-27", value: 58 },
    { date: "2025-01-28", value: 92 },
    { date: "2025-01-29", value: 113 },
    { date: "2025-01-30", value: 132 },
  ],
  transactionStatus: [
    {
      date: "2025-01-01",
      Completed: 120,
      Processing: 25,
      Pending: 15,
      Failed: 8,
    },
    {
      date: "2025-01-02",
      Completed: 98,
      Processing: 18,
      Pending: 12,
      Failed: 6,
    },
    {
      date: "2025-01-03",
      Completed: 145,
      Processing: 32,
      Pending: 18,
      Failed: 12,
    },
    {
      date: "2025-01-04",
      Completed: 132,
      Processing: 28,
      Pending: 16,
      Failed: 10,
    },
    {
      date: "2025-01-05",
      Completed: 168,
      Processing: 35,
      Pending: 22,
      Failed: 15,
    },
    {
      date: "2025-01-06",
      Completed: 89,
      Processing: 19,
      Pending: 11,
      Failed: 7,
    },
    {
      date: "2025-01-07",
      Completed: 75,
      Processing: 16,
      Pending: 9,
      Failed: 5,
    },
    {
      date: "2025-01-08",
      Completed: 138,
      Processing: 29,
      Pending: 17,
      Failed: 11,
    },
    {
      date: "2025-01-09",
      Completed: 156,
      Processing: 33,
      Pending: 19,
      Failed: 13,
    },
    {
      date: "2025-01-10",
      Completed: 185,
      Processing: 38,
      Pending: 24,
      Failed: 16,
    },
    {
      date: "2025-01-11",
      Completed: 172,
      Processing: 36,
      Pending: 21,
      Failed: 14,
    },
    {
      date: "2025-01-12",
      Completed: 201,
      Processing: 42,
      Pending: 26,
      Failed: 18,
    },
    {
      date: "2025-01-13",
      Completed: 118,
      Processing: 25,
      Pending: 15,
      Failed: 9,
    },
    {
      date: "2025-01-14",
      Completed: 95,
      Processing: 20,
      Pending: 12,
      Failed: 7,
    },
    {
      date: "2025-01-15",
      Completed: 164,
      Processing: 34,
      Pending: 20,
      Failed: 13,
    },
    {
      date: "2025-01-16",
      Completed: 178,
      Processing: 37,
      Pending: 23,
      Failed: 15,
    },
    {
      date: "2025-01-17",
      Completed: 125,
      Processing: 26,
      Pending: 16,
      Failed: 10,
    },
    {
      date: "2025-01-18",
      Completed: 149,
      Processing: 31,
      Pending: 18,
      Failed: 12,
    },
    {
      date: "2025-01-19",
      Completed: 195,
      Processing: 41,
      Pending: 25,
      Failed: 17,
    },
    {
      date: "2025-01-20",
      Completed: 102,
      Processing: 21,
      Pending: 13,
      Failed: 8,
    },
    {
      date: "2025-01-21",
      Completed: 78,
      Processing: 16,
      Pending: 10,
      Failed: 6,
    },
    {
      date: "2025-01-22",
      Completed: 142,
      Processing: 30,
      Pending: 18,
      Failed: 11,
    },
    {
      date: "2025-01-23",
      Completed: 174,
      Processing: 36,
      Pending: 22,
      Failed: 14,
    },
    {
      date: "2025-01-24",
      Completed: 158,
      Processing: 33,
      Pending: 20,
      Failed: 12,
    },
    {
      date: "2025-01-25",
      Completed: 213,
      Processing: 45,
      Pending: 28,
      Failed: 19,
    },
    {
      date: "2025-01-26",
      Completed: 128,
      Processing: 27,
      Pending: 16,
      Failed: 10,
    },
    {
      date: "2025-01-27",
      Completed: 74,
      Processing: 15,
      Pending: 9,
      Failed: 5,
    },
    {
      date: "2025-01-28",
      Completed: 147,
      Processing: 31,
      Pending: 18,
      Failed: 12,
    },
    {
      date: "2025-01-29",
      Completed: 183,
      Processing: 38,
      Pending: 23,
      Failed: 15,
    },
    {
      date: "2025-01-30",
      Completed: 215,
      Processing: 45,
      Pending: 28,
      Failed: 19,
    },
  ],
  customerLifetimeValue: [
    { date: "2025-01-01", value: 185 },
    { date: "2025-01-02", value: 172 },
    { date: "2025-01-03", value: 198 },
    { date: "2025-01-04", value: 181 },
    { date: "2025-01-05", value: 203 },
    { date: "2025-01-06", value: 168 },
    { date: "2025-01-07", value: 159 },
    { date: "2025-01-08", value: 187 },
    { date: "2025-01-09", value: 196 },
    { date: "2025-01-10", value: 208 },
    { date: "2025-01-11", value: 201 },
    { date: "2025-01-12", value: 215 },
    { date: "2025-01-13", value: 178 },
    { date: "2025-01-14", value: 165 },
    { date: "2025-01-15", value: 199 },
    { date: "2025-01-16", value: 205 },
    { date: "2025-01-17", value: 182 },
    { date: "2025-01-18", value: 191 },
    { date: "2025-01-19", value: 212 },
    { date: "2025-01-20", value: 173 },
    { date: "2025-01-21", value: 161 },
    { date: "2025-01-22", value: 189 },
    { date: "2025-01-23", value: 207 },
    { date: "2025-01-24", value: 198 },
    { date: "2025-01-25", value: 225 },
    { date: "2025-01-26", value: 184 },
    { date: "2025-01-27", value: 158 },
    { date: "2025-01-28", value: 192 },
    { date: "2025-01-29", value: 213 },
    { date: "2025-01-30", value: 232 },
  ],
};

const statusPalette = [
  "hsl(var(--color-primary))",
  "hsl(var(--color-accent))",
  "#8b5cf6",
  "#34d399",
  "#f59e0b",
];

const vibrantColors = {
  primary: "hsl(var(--color-primary))",
  secondary: "hsl(var(--color-accent))",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  pink: "#ec4899",
  indigo: "#6366f1",
  emerald: "#10b981",
  orange: "#f97316",
};

export default function AnalyticsCharts() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple loading simulation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const tooltipStyle = {
    backgroundColor: "hsl(var(--color-background))",
    borderRadius: "16px",
    border: "1px solid hsl(var(--color-border))",
    color: "hsl(var(--color-foreground))",
    boxShadow: "0px 18px 60px rgba(8, 24, 8, 0.25)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  if (loading) {
    return (
      <div className="grid gap-6 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`analytics-skeleton-${index}`}
            className="h-[320px] animate-pulse rounded-3xl border border-border/60 bg-muted/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Orders & Revenue */}
      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="relative overflow-hidden rounded-3xl border-border/60 bg-card/85 shadow-xl shadow-primary/10 transition-all duration-500 hover:-translate-y-1 xl:col-span-3">
          <div className="absolute -right-16 top-0 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Orders • last 30 days
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fakeAnalyticsData.orders}>
                <defs>
                  <linearGradient
                    id="ordersGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95} />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 8"
                  stroke="hsl(var(--color-border)/0.3)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 11,
                  }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--color-primary)/0.15)" }}
                  contentStyle={{
                    ...tooltipStyle,
                    border: "1px solid hsl(var(--color-primary)/0.2)",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
                  }}
                  labelStyle={{
                    color: "hsl(var(--color-foreground))",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                  formatter={(value: number) => [
                    <span
                      style={{ color: vibrantColors.primary, fontWeight: 600 }}
                    >
                      {value.toLocaleString()} orders
                    </span>,
                    "Daily Orders",
                  ]}
                />
                <Bar
                  dataKey="value"
                  fill="url(#ordersGradient)"
                  radius={[8, 8, 4, 4]}
                  name="Orders placed"
                  stroke={vibrantColors.primary}
                  strokeWidth={1}
                  strokeOpacity={0.3}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/90 shadow-xl transition-all duration-500 hover:-translate-y-1 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Revenue • last 30 days
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={fakeAnalyticsData.revenue}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--color-accent))"
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--color-accent))"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 8"
                  stroke="hsl(var(--color-border)/0.3)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 11,
                  }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 11,
                  }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  cursor={{
                    stroke: vibrantColors.emerald,
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    ...tooltipStyle,
                    border: `1px solid ${vibrantColors.emerald}33`,
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
                  }}
                  labelStyle={{
                    color: "hsl(var(--color-foreground))",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                  formatter={(value: number) => [
                    <span
                      style={{ color: vibrantColors.emerald, fontWeight: 600 }}
                    >
                      $
                      {value.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>,
                    "Daily Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="none"
                  fill="url(#revenueGradient)"
                  fillOpacity={0.6}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={vibrantColors.emerald}
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: vibrantColors.emerald,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: vibrantColors.emerald,
                    stroke: "#fff",
                    strokeWidth: 3,
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                  }}
                  name="Revenue"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rate & Categories */}
      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="rounded-3xl border-border/60 bg-card/90 shadow-xl transition-all duration-500 hover:-translate-y-1 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Conversion Rate • last 30 days
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={fakeAnalyticsData.conversionRate}>
                <CartesianGrid
                  strokeDasharray="4 8"
                  stroke="hsl(var(--color-border)/0.3)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 11,
                  }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 11,
                  }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  cursor={{
                    stroke: vibrantColors.purple,
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    ...tooltipStyle,
                    border: `1px solid ${vibrantColors.purple}33`,
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
                  }}
                  labelStyle={{
                    color: "hsl(var(--color-foreground))",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                  formatter={(value: number) => [
                    <span
                      style={{ color: vibrantColors.purple, fontWeight: 600 }}
                    >
                      {value.toFixed(1)}%
                    </span>,
                    "Conversion Rate",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={vibrantColors.purple}
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: vibrantColors.purple,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: vibrantColors.purple,
                    stroke: "#fff",
                    strokeWidth: 3,
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                  }}
                  name="Conversion"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/90 shadow-lg transition-all duration-500 hover:-translate-y-1 xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Fashion Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fakeAnalyticsData.categories}>
                <defs>
                  <linearGradient
                    id="categoryGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 6"
                  stroke="hsl(var(--color-border)/0.4)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(236,72,153,0.12)" }}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "hsl(var(--color-muted-foreground))" }}
                  formatter={(value: number) => [
                    `${value} orders`,
                    "Category Sales",
                  ]}
                />
                <Bar
                  dataKey="value"
                  fill="url(#categoryGradient)"
                  radius={[12, 12, 8, 8]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Growth & Daily Active Users */}
      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="rounded-3xl border-border/60 bg-card/85 shadow-lg transition-all duration-500 hover:-translate-y-1 xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Daily Active Users • last 30 days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={fakeAnalyticsData.dailyActiveUsers}>
                <defs>
                  <linearGradient id="dauGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
                    <stop offset="50%" stopColor="#ec4899" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 6"
                  stroke="hsl(var(--color-border)/0.5)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  cursor={{ stroke: "hsl(var(--color-primary)/0.4)" }}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "hsl(var(--color-muted-foreground))" }}
                  formatter={(value: number) => [
                    `${value.toLocaleString()} active users`,
                    "Daily active",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--color-primary))"
                  fill="url(#dauGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/85 shadow-lg transition-all duration-500 hover:-translate-y-1 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Daily Signups • last 30 days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={fakeAnalyticsData.userGrowth}>
                <CartesianGrid
                  strokeDasharray="3 6"
                  stroke="hsl(var(--color-border)/0.5)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "hsl(var(--color-muted-foreground))" }}
                  formatter={(value: number) => [
                    `${value} new users`,
                    "Signups",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--color-accent))"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Status */}
      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="rounded-3xl border-border/60 bg-card/90 shadow-lg transition-all duration-500 hover:-translate-y-1 xl:col-span-5">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Transaction Status Mix • last 30 days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={fakeAnalyticsData.transactionStatus}>
                <CartesianGrid
                  strokeDasharray="3 6"
                  stroke="hsl(var(--color-border)/0.5)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "hsl(var(--color-muted-foreground))" }}
                  formatter={(value: number, label: string) => [
                    `${value} transactions`,
                    label,
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Completed"
                  stackId="1"
                  stroke={statusPalette[0]}
                  fill={statusPalette[0]}
                  fillOpacity={0.35}
                />
                <Area
                  type="monotone"
                  dataKey="Processing"
                  stackId="1"
                  stroke={statusPalette[1]}
                  fill={statusPalette[1]}
                  fillOpacity={0.35}
                />
                <Area
                  type="monotone"
                  dataKey="Pending"
                  stackId="1"
                  stroke={statusPalette[2]}
                  fill={statusPalette[2]}
                  fillOpacity={0.35}
                />
                <Area
                  type="monotone"
                  dataKey="Failed"
                  stackId="1"
                  stroke={statusPalette[3]}
                  fill={statusPalette[3]}
                  fillOpacity={0.35}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Lifetime Value */}
      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="rounded-3xl border-border/60 bg-card/90 shadow-lg transition-all duration-500 hover:-translate-y-1 xl:col-span-5">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Customer Lifetime Value • last 30 days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={fakeAnalyticsData.customerLifetimeValue}>
                <defs>
                  <linearGradient id="clvGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={vibrantColors.emerald}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor={vibrantColors.emerald}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 6"
                  stroke="hsl(var(--color-border)/0.5)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--color-muted-foreground))",
                    fontSize: 12,
                  }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ stroke: "hsl(var(--color-primary)/0.4)" }}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "hsl(var(--color-muted-foreground))" }}
                  formatter={(value: number) => [
                    `$${value.toFixed(0)}`,
                    "Customer Lifetime Value",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={vibrantColors.emerald}
                  fill="url(#clvGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
