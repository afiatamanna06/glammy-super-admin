"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminApi } from "@/lib/api-client";

interface ModelEntry {
  id: number;
  modelName: string;
  modelKey: string;
  isActive: boolean;
}

interface ModelComparisonData {
  name: string;
  responseTime: number; // ms
  costPer1k: number; // $
  successRate: number; // %
  usage: number; // requests
  errorRate: number; // %
  tps: number; // tokens per second
}

export default function ModelComparisons() {
  const [data, setData] = useState<ModelComparisonData[]>([]);
  const [alphaData, setAlphaData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatResponse, planResponse] = await Promise.all([
          adminApi.getChatModels(),
          adminApi.getPlanModels(),
        ]);

        const chatModels = chatResponse.data?.models || [];
        const planModels = planResponse.data?.models || [];
        const allModels = [...chatModels, ...planModels];

        // Mocking comparison data based on models
        // In a real app, this would come from an analytics endpoint
        const comparisonData = allModels.map((model: ModelEntry) => ({
          name: model.modelName,
          responseTime: Math.floor(Math.random() * 400) + 150, // 150-550ms
          costPer1k: Number((Math.random() * 0.04 + 0.002).toFixed(4)), // $0.002 - $0.042
          successRate: Number((Math.random() * 4 + 95).toFixed(1)), // 95-99%
          usage: Math.floor(Math.random() * 15000) + 2000,
          errorRate: Number((Math.random() * 2).toFixed(2)), // 0-2%
          tps: Math.floor(Math.random() * 50) + 20, // 20-70 TPS
        }));

        setData(comparisonData);

        // Generate Alpha Tuning Data
        // Select top 5 models or use placeholders if none
        let topModels = allModels.slice(0, 5).map((m) => m.modelName);

        // Ensure we have at least 5 models for a rich comparison
        const extraModels = [
          "Glammy-Lite",
          "Glammy-Pro",
          "Glammy-Ultra",
          "Glammy-Vision",
          "Glammy-Code",
        ];
        if (topModels.length < 5) {
          const needed = 5 - topModels.length;
          const toAdd = extraModels
            .filter((m) => !topModels.includes(m))
            .slice(0, needed);
          topModels = [...topModels, ...toAdd];
        }

        const alphas = [0.2, 0.4, 0.6, 0.8];
        const generatedAlphaData = alphas.map((alpha) => {
          const point: any = { alpha };
          topModels.forEach((modelName, index) => {
            // Peak performance at 0.6
            // Base score varies by model (index)
            // Penalty increases as distance from 0.6 increases
            const baseScore = 92 - index * 2; // 92, 90, 88
            const dist = Math.abs(alpha - 0.6);
            const penalty = dist * 40; // Sharper penalty for more pronounced curve
             // Add some randomness
             const noise = (Math.random() - 0.5) * 1.5;
             // Varies base score slightly for each model so lines don't overlap perfectly
             const modelOffset = (index % 3 - 1) * 3; 
             point[modelName] = Number((baseScore - penalty + noise + modelOffset).toFixed(1));
          });
          return point;
        });
        setAlphaData(generatedAlphaData);
      } catch (error) {
        console.error("Failed to fetch models for comparison", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[350px] animate-pulse rounded-xl bg-muted/20" />
        <div className="h-[350px] animate-pulse rounded-xl bg-muted/20" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center rounded-xl border border-dashed border-muted-foreground/25">
        <p className="text-muted-foreground">
          No models available for comparison
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Response Latency</CardTitle>
            <CardDescription>
              Average response time in milliseconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/30"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}ms`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                    cursor={{ fill: "var(--muted)/0.2" }}
                  />
                  <Bar
                    dataKey="responseTime"
                    name="Latency"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Volume</CardTitle>
            <CardDescription>
              Total requests processed this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/30"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={80}
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                    cursor={{ fill: "var(--muted)/0.2" }}
                  />
                  <Bar
                    dataKey="usage"
                    name="Requests"
                    fill="var(--accent)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
            <CardDescription>
              Percentage of failed requests (lower is better)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/30"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                    cursor={{ fill: "var(--muted)/0.2" }}
                  />
                  <Bar
                    dataKey="errorRate"
                    name="Error Rate"
                    fill="var(--destructive)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Throughput (TPS)</CardTitle>
            <CardDescription>
              Average tokens generated per second
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted/30"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                    cursor={{ fill: "var(--muted)/0.2" }}
                  />
                  <Bar
                    dataKey="tps"
                    name="TPS"
                    fill="var(--chart-2)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Efficiency Analysis</CardTitle>
          <CardDescription>Cost vs Success Rate Performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted/30"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[90, 100]}
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                  cursor={{ fill: "var(--muted)/0.2" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar
                  yAxisId="left"
                  dataKey="costPer1k"
                  name="Cost ($/1k)"
                  fill="var(--chart-4)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="successRate"
                  name="Success Rate (%)"
                  fill="var(--chart-5)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alpha Parameter Tuning</CardTitle>
          <CardDescription>
            Performance impact of Alpha settings (0.2 - 0.8)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alphaData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted/30"
                  vertical={false}
                />
                <XAxis
                  dataKey="alpha"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  domain={[0.2, 0.8]}
                  type="number"
                  tickCount={4}
                  label={{
                    value: "Alpha Value",
                    position: "insideBottomRight",
                    offset: -5,
                    fontSize: 12,
                    fill: "var(--muted-foreground)",
                  }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Score",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 12,
                    fill: "var(--muted-foreground)",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <ReferenceLine
                  x={0.6}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  label={{
                    value: "Optimal (0.6)",
                    position: "top",
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />
                {Object.keys(alphaData[0] || {})
                  .filter((k) => k !== "alpha")
                  .map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={key}
                      stroke={`var(--chart-${(index % 5) + 1})`}
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: `var(--chart-${(index % 5) + 1})`,
                        strokeWidth: 2,
                        stroke: "var(--background)",
                      }}
                      activeDot={{
                        r: 8,
                        strokeWidth: 2,
                        stroke: "var(--background)",
                      }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
