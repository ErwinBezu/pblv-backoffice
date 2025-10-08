import { apiJson } from "../auth/apiClient";

const BASE_ME = "/api/users/me";

export const getMe = () => apiJson(BASE_ME, { method: "GET" });
export const updateMe = (payload) =>
  apiJson(BASE_ME, { method: "PUT", body: JSON.stringify(payload) });
export const changePassword = ({ currentPassword, newPassword }) =>
  apiJson(
    `/api/auth/change-password?currentPassword=${encodeURIComponent(
      currentPassword
    )}&newPassword=${encodeURIComponent(newPassword)}`,
    { method: "POST" }
  );
