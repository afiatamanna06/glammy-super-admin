"use client";

import { useMemo } from "react";
import {
  Activity,
  Briefcase,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { OverviewData } from "@/components/overview";
import type { AdminUser } from "@/components/user-management";
import { cn } from "@/lib/utils";

export interface TopUserHighlight {
  id: string;
  name: string;
  email: string;
  activityCount: number;
  plansCreated: number;
  lastActivity: string;
}

interface DashboardHeroProps {
  loading: boolean;
  error: string | null;
  overview: OverviewData | null;
  topUsers: TopUserHighlight[];
  recentUsers: AdminUser[];
  onRefresh: () => Promise<void> | void;
}

export default function DashboardHero({
  loading,
  error,
  overview,
  topUsers,
  recentUsers,
  onRefresh,
}: DashboardHeroProps) {
  const summaryMetrics = useMemo(() => {
    if (!overview) return [];

    const { users, plans, transactions } = overview.overview;
    const activeRatio = users.total
      ? Math.round((users.active / users.total) * 100)
      : 0;
    const revenuePerPlan =
      plans.total > 0
        ? transactions.totalRevenue / plans.total
        : transactions.totalRevenue;
    const upcomingShare = plans.total
      ? Math.round((plans.withUpcomingTravel / plans.total) * 100)
      : 0;

    return [
      {
        label: "Active customers",
        value: users.active.toLocaleString(),
        delta: `${activeRatio}% engagement`,
        icon: Users,
      },
      {
        label: "Orders processed",
        value: plans.withUpcomingTravel.toLocaleString(),
        delta: `${plans.total.toLocaleString()} total orders`,
        icon: Briefcase,
      },
      {
        label: "Revenue outlook",
        value: `৳${transactions.totalRevenue.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`,
        delta: `৳${revenuePerPlan.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })} avg per order`,
        icon: TrendingUp,
      },
      {
        label: "Processing orders",
        value: `${upcomingShare}%`,
        delta: `${plans.shared.toLocaleString()} shared orders`,
        icon: Activity,
      },
    ];
  }, [overview]);

  const latestSignups = useMemo(() => recentUsers.slice(0, 4), [recentUsers]);

  const showSkeleton = loading && !overview;
  const isRefreshing = loading && Boolean(overview);

  if (showSkeleton) {
    return (
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Skeleton className="h-[320px] rounded-[32px]" />
        <Skeleton className="h-[320px] rounded-[32px]" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <Card className="relative overflow-hidden rounded-[32px] border border-border/60 bg-gradient-to-br from-primary/15 via-background to-background/50 shadow-2xl shadow-primary/10">
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl transition-all duration-700" />
        <div className="pointer-events-none absolute left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl transition-all duration-700" />
        <CardHeader className="flex flex-col gap-6 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary"
            >
              Admin Dashboard
            </Badge>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Mission control at a glance
              </CardTitle>
              <p className="max-w-xl text-sm text-muted-foreground">
                Real-time metrics streamed from the admin APIs to keep you ahead
                of demand and user growth.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group gap-2 rounded-2xl border border-border/50 bg-background/60 px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10"
            onClick={() => void onRefresh()}
            disabled={loading}
          >
            <RefreshCcw
              size={16}
              className={cn(
                "transition-transform",
                isRefreshing && "animate-spin"
              )}
            />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          {error && (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryMetrics.map((metric) => (
              <div
                key={metric.label}
                className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/70 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="absolute inset-0 scale-105 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="rounded-full bg-primary/10 p-2 text-primary shadow-inner shadow-primary/20 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105">
                      <metric.icon size={16} />
                    </span>
                    {metric.label}
                  </div>
                  <div className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {metric.value}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground/80">
                    {metric.delta}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!!latestSignups.length && (
            <div className="rounded-3xl border border-border/50 bg-background/70 p-5 backdrop-blur-sm transition-all duration-500 hover:border-primary/30">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles size={18} />
                </span>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-foreground">
                    Newest signups
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pulled straight from the admin recent users endpoint.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {latestSignups.map((user) => (
                  <Badge
                    key={user.id}
                    variant="outline"
                    className="flex items-center gap-2 rounded-2xl border-border/40 bg-card/70 px-3 py-1.5 text-xs"
                  >
                    <Avatar className="h-7 w-7 rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      <AvatarFallback className="text-xs font-semibold uppercase">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">
                      {user.name || user.email}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-border/60 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
        <div className="pointer-events-none absolute -bottom-12 right-4 h-32 w-32 rounded-full bg-accent/15 blur-2xl" />
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Top engaged users
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Highest activity pulled from the admin analytics top-users endpoint.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {topUsers.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-20 text-center text-sm text-muted-foreground">
              No activity data available yet.
            </div>
          ) : (
            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="group flex items-center gap-3 rounded-3xl border border-border/60 bg-background/60 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
                >
                  <Badge
                    variant="outline"
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border-primary/30 bg-primary/10 text-xs font-semibold text-primary"
                  >
                    #{index + 1}
                  </Badge>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {user.name || user.email}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.plansCreated} plans • {user.activityCount}{" "}
                      interactions
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(user.lastActivity).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
