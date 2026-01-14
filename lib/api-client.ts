const API_BASE_URL = "";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
}

export async function apiCall(endpoint: string, options: RequestOptions = {}) {
  const { method = "GET", headers = {}, body } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    defaultHeaders["Authorization"] = `${token}`;
  }

  try {
    const response = await fetch(
      `https://verne-be.v0stdio.workers.dev/api${endpoint}`,
      {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
      }
    );

    console.log("[v0] API call to", endpoint, "status:", response.status);

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      console.log("[v0] API error response:", await response.text());
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[v0] API call failed:", error);
    throw error;
  }
}

export const authApi = {
  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  signup: (name: string, email: string, password: string) =>
    apiCall("/auth/signUp", {
      method: "POST",
      body: { name, email, password },
    }),
  verify: (otp: string) =>
    apiCall("/auth/verify", {
      method: "POST",
      body: { otp },
    }),
  resetPassword: (email: string) =>
    apiCall("/auth/reset-password", {
      method: "POST",
      body: { email },
    }),
};

export const adminApi = {
  getOverview: () => apiCall("/admin/dashboard/overview"),
  getRecentUsers: (limit?: number) =>
    apiCall(`/admin/dashboard/recent-users${limit ? `?limit=${limit}` : ""}`),
  banUser: (userId: string) =>
    apiCall(`/admin/users/${userId}/ban`, { method: "POST" }),
  unbanUser: (userId: string) =>
    apiCall(`/admin/users/${userId}/unban`, { method: "POST" }),
  getPlansAnalytics: (days?: number) =>
    apiCall(`/admin/analytics/plans${days ? `?days=${days}` : ""}`),
  getRevenueAnalytics: (days?: number) =>
    apiCall(`/admin/analytics/revenue${days ? `?days=${days}` : ""}`),
  getDailyActiveUsers: (days?: number) =>
    apiCall(
      `/admin/analytics/daily-active-users${days ? `?days=${days}` : ""}`
    ),
  getUserGrowthAnalytics: (days?: number) =>
    apiCall(`/admin/analytics/user-growth${days ? `?days=${days}` : ""}`),
  getTransactionStatusBreakdown: (days?: number) =>
    apiCall(
      `/admin/analytics/transactions/status-breakdown${
        days ? `?days=${days}` : ""
      }`
    ),
  getPlanShareAnalytics: (days?: number) =>
    apiCall(`/admin/analytics/plan-shares${days ? `?days=${days}` : ""}`),
  getTopUsers: (limit?: number) =>
    apiCall(`/admin/analytics/top-users${limit ? `?limit=${limit}` : ""}`),
  getChatModels: () => apiCall("/admin/models/chat"),
  getPlanModels: () => apiCall("/admin/models/plan"),
  updateChatModel: (
    modelId: number,
    payload: Partial<{
      modelName: string;
      modelKey: string;
      apiKey: string;
      baseUrl: string;
      isActive: boolean;
    }>
  ) =>
    apiCall(`/admin/models/chat/${modelId}`, {
      method: "PATCH",
      body: payload,
    }),
  updatePlanModel: (
    modelId: number,
    payload: Partial<{
      modelName: string;
      modelKey: string;
      apiKey: string;
      baseUrl: string;
      isActive: boolean;
    }>
  ) =>
    apiCall(`/admin/models/plan/${modelId}`, {
      method: "PATCH",
      body: payload,
    }),
};
