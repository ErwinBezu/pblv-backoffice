import { apiJson } from "./auth/apiClient";
import {
  clearTokens,
  saveTokens,
  identityFromJwt,
  getTokens,
} from "./auth/tokens";

const authProvider = {
  async login({ username, password }) {
    const data = await apiJson("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ mail: username, password }),
    }); // :contentReference[oaicite:9]{index=9}
    saveTokens(data);
  },
  async logout() {
    try {
      await apiJson("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.log(error);
    }
    clearTokens();
  }, // :contentReference[oaicite:10]{index=10}
  async checkAuth() {
    return getTokens() ? Promise.resolve() : Promise.reject();
  },
  async checkError(e) {
    const s = e?.status || 0;
    if (s === 401 || s === 403) return Promise.reject();
    return Promise.resolve();
  },
  async getIdentity() {
    return identityFromJwt();
  },
  async getPermissions() {
    const i = identityFromJwt();
    return i.roles || [];
  },
};
export default authProvider;
