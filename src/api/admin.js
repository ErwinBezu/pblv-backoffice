import { apiJson } from "../auth/apiClient";

export const getAdminDashboard = () => apiJson("/api/admin/dashboard");
export const getSecurityAnalytics = () =>
  apiJson("/api/admin/analytics/security");

export const getSystemLogs = (limit = 200) =>
  apiJson(`/api/admin/logs?limit=${limit}`);

export const getInactiveUsers = (days = 30) =>
  apiJson(`/api/admin/users/inactive?days=${days}`);

export const toggleMaintenance = (enable) =>
  apiJson(`/api/admin/system/maintenance?enable=${enable}`, { method: "POST" });

export const resetUserPassword = (userId) =>
  apiJson(`/api/admin/users/${userId}/reset-password`, { method: "POST" });

export const assignRole = (userId, roleId) =>
  apiJson(`/api/admin/users/${userId}/assign-role`, {
    method: "POST",
    body: JSON.stringify({ roleId: roleId }),
  });

export const banUser = (userId, reason) =>
  apiJson(
    `/api/admin/users/${userId}/ban${
      reason ? `?reason=${encodeURIComponent(reason)}` : ""
    }`,
    { method: "POST" }
  );

export const unbanUser = (userId) =>
  apiJson(`/api/admin/users/${userId}/unban`, { method: "POST" });
