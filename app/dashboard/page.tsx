"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AnalyticsCharts from "@/components/analytics-charts";
import ActiveModels from "@/components/active-models";
import ModelComparisons from "@/components/model-comparisons";
import OrdersManagement from "@/components/orders-management";
import ProductsManagement from "@/components/products-management";
import SellersManagement from "@/components/sellers-management";
import DashboardHero, {
  type TopUserHighlight,
} from "@/components/dashboard-hero";
import DashboardLayout from "@/components/dashboard-layout";
import DatasetsList from "@/components/datasets-list";
import Overview, { type OverviewData } from "@/components/overview";
import UserManagement, { type AdminUser } from "@/components/user-management";
import { adminApi } from "@/lib/api-client";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [topUsers, setTopUsers] = useState<TopUserHighlight[]>([]);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  const fetchDashboardData = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError(null);
    try {
      const [overviewResponse, topUsersResponse, recentUsersResponse] =
        await Promise.all([
          adminApi.getOverview(),
          adminApi.getTopUsers(4),
          adminApi.getRecentUsers(6),
        ]);

      setOverviewData(overviewResponse.data ?? null);
      setTopUsers(topUsersResponse.data?.users ?? []);
      setRecentUsers(recentUsersResponse.data?.users ?? []);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
      setDashboardError("Unable to refresh dashboard data. Try again shortly.");
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthed) return;
    void fetchDashboardData();
  }, [isAuthed, fetchDashboardData]);

  if (!isAuthed) return null;

  return (
    <DashboardLayout>
      <section id="dashboard" className="space-y-10">
        <DashboardHero
          loading={dashboardLoading}
          error={dashboardError}
          overview={overviewData}
          topUsers={topUsers}
          recentUsers={recentUsers}
          onRefresh={fetchDashboardData}
        />
        <Overview data={overviewData} loading={dashboardLoading} />
      </section>

      <section id="orders" className="space-y-8 pt-12">
        <OrdersManagement />
      </section>

      <section id="products" className="space-y-8 pt-12">
        <ProductsManagement />
      </section>

      <section id="sellers" className="space-y-8 pt-12">
        <SellersManagement />
      </section>

      <section id="datasets" className="space-y-8 pt-12">
        <DatasetsList />
      </section>

      <section id="analytics" className="space-y-8 pt-12">
        <AnalyticsCharts />
      </section>

      <section id="users" className="space-y-8 pt-12">
        <UserManagement />
      </section>

      <section id="model-comparisons" className="space-y-8 pt-12">
        <ModelComparisons />
      </section>

      <section id="models" className="space-y-8 pt-12">
        <ActiveModels />
      </section>
    </DashboardLayout>
  );
}
