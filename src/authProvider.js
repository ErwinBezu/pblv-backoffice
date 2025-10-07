import { apiJson } from "./auth/apiClient";
import {
  clearTokens,
  saveTokens,
  identityFromJwt,
  getTokens,
} from "./auth/tokens";

const authProvider = {
  async login({ username, password, googleToken }) {
    let data;

    // Connexion avec Google
    if (googleToken) {
      data = await apiJson("/api/auth/google/token", {
        method: "POST",
        body: JSON.stringify({ idToken: googleToken }),
      });
    }
    // Connexion classique email/password
    else {
      data = await apiJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ mail: username, password }),
      });
    }

    saveTokens(data);
  },

  async logout() {
    try {
      await apiJson("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.log(error);
    }
    clearTokens();
  },

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
