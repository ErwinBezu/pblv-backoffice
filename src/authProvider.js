import {
  saveTokens,
  clearTokens,
  getTokens,
  identityFromJwt,
} from "./auth/tokens";
import { apiJson } from "./auth/apiClient";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const authProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await apiJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      saveTokens(response);
      return Promise.resolve();
    } catch (error) {
      throw new Error(error?.message || "Identifiants incorrects");
    }
  },

  logout: () => {
    clearTokens();
    return Promise.resolve();
  },

  checkAuth: () => {
    const tokens = getTokens();
    return tokens?.accessToken
      ? Promise.resolve()
      : Promise.reject({ message: "Non authentifié" });
  },

  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      clearTokens();
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getIdentity: () => {
    try {
      return Promise.resolve(identityFromJwt());
    } catch (error) {
      return Promise.reject();
    }
  },

  getPermissions: () => {
    try {
      const identity = identityFromJwt();
      return Promise.resolve(identity.roles || []);
    } catch (error) {
      return Promise.resolve([]);
    }
  },
};
