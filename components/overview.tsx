"use client"

import { useMemo } from "react";
import { Users, Briefcase, CreditCard, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"

export interface OverviewData {
  overview: {
    users: {
      total: number;
      admins: number;
      active: number;
      inactive: number;
    };
    plans: {
      total: number;
      withUpcomingTravel: number;
      shared: number;
    };
    transactions: {
      total: number;
      successful: number;
      failed: number;
      pending: number;
      totalRevenue: number;
      averageValue: number;
    };
  };
}

const gradients = [
  "from-primary/15 via-primary/10 to-transparent",
  "from-emerald-400/20 via-primary/5 to-transparent",
  "from-amber-400/20 via-accent/20 to-transparent",
  "from-sky-400/20 via-primary/5 to-transparent",
]

interface OverviewProps {
  data: OverviewData | null;
  loading: boolean;
}

export default function Overview({ data, loading }: OverviewProps) {
  const metrics = useMemo(() => {
    if (!data) return [];

    const { users, plans, transactions } = data.overview;
    const activeRatio = users.total
      ? Math.round((users.active / users.total) * 100)
      : 0;
    const upcomingShare = plans.total
      ? Math.round((plans.withUpcomingTravel / plans.total) * 100)
      : 0;
    const successRate = transactions.total
      ? Math.round((transactions.successful / transactions.total) * 100)
      : 0;

    return [
      {
        title: "Active customers",
        value: users.total.toLocaleString(),
        subtitle: `${users.active.toLocaleString()} active • ${
          users.admins
        } admin seats`,
        icon: Users,
        delta: `${activeRatio}% engagement`,
      },
      {
        title: "Total orders",
        value: plans.total.toLocaleString(),
        subtitle: `${plans.withUpcomingTravel} pending shipments • ${plans.shared} shared orders`,
        icon: Briefcase,
        delta: `${upcomingShare}% processing`,
      },
      {
        title: "Total revenue",
        value: `৳${transactions.totalRevenue.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`,
        subtitle: `${transactions.successful} successful • ${transactions.failed} failed • ${transactions.pending} pending`,
        icon: CreditCard,
        delta: `${successRate}% success rate`,
      },
      {
        title: "Avg transaction value",
        value: `$${transactions.averageValue.toFixed(2)}`,
        subtitle: `${transactions.total} transactions processed`,
        icon: TrendingUp,
        delta: `${transactions.total.toLocaleString()} transactions`,
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`overview-skeleton-${index}`}
            className="h-32 animate-pulse rounded-2xl border border-border/60 bg-muted/50"
          />
        ))}
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive">
        Failed to load overview metrics.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card
          key={metric.title}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70",
            "transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              gradients[index % gradients.length]
            )}
          />
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              {metric.title}
            </CardTitle>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <metric.icon size={18} />
            </span>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            <div className="text-3xl font-semibold tracking-tight text-foreground">
              {metric.value}
            </div>
            <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-xs font-semibold text-primary"
            >
              {metric.delta}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
