import { apiJson } from "../auth/apiClient";

// ---- Dashboard & sécurité
export const getAdminDashboard = () => apiJson("/api/admin/dashboard"); // :contentReference[oaicite:11]{index=11}
export const getSecurityAnalytics = () =>
  apiJson("/api/admin/analytics/security"); // :contentReference[oaicite:12]{index=12}
export const getSystemLogs = (limit = 200) =>
  apiJson(`/api/admin/logs?limit=${limit}`); // :contentReference[oaicite:13]{index=13}
export const getInactiveUsers = (days = 30) =>
  apiJson(`/api/admin/users/inactive?days=${days}`); // :contentReference[oaicite:14]{index=14}
export const toggleMaintenance = (enable) =>
  apiJson(`/api/admin/system/maintenance?enable=${enable}`, { method: "POST" }); // :contentReference[oaicite:15]{index=15}

// ---- Actions sur utilisateur
export const resetUserPassword = (userId) =>
  apiJson(`/api/admin/users/${userId}/reset-password`, { method: "POST" }); // :contentReference[oaicite:16]{index=16}
export const assignRole = (userId, roleId) =>
  apiJson(`/api/admin/users/${userId}/assign-role?roleId=${roleId}`, {
    method: "POST",
  }); // :contentReference[oaicite:17]{index=17}
export const banUser = (userId, reason) =>
  apiJson(
    `/api/admin/users/${userId}/ban${
      reason ? `?reason=${encodeURIComponent(reason)}` : ""
    }`,
    { method: "POST" }
  ); // :contentReference[oaicite:18]{index=18}
export const unbanUser = (userId) =>
  apiJson(`/api/admin/users/${userId}/unban`, { method: "POST" }); // :contentReference[oaicite:19]{index=19}
