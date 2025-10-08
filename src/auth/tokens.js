const TOKEN_KEY = "auth_tokens";

const normalizeResponse = (actualData) => {
  const token =
    actualData?.token ||
    actualData?.accessToken ||
    actualData?.access_token ||
    (actualData?.tokens &&
      (actualData.tokens.accessToken || actualData.tokens.access_token));

  const refreshToken =
    actualData?.refreshToken || actualData?.refresh_token || null;

  let expiresAt = null;
  if (actualData?.expiresAt) {
    expiresAt = new Date(actualData.expiresAt).getTime();
  } else if (typeof actualData?.expires_in === "number") {
    expiresAt = Date.now() + actualData.expires_in * 1000;
  }

  const tokenType = actualData?.tokenType || actualData?.type || "Bearer";

  return { token, refreshToken, expiresAt, tokenType };
};

export const saveTokens = (data) => {
  const actualData = data?.data || data || {};
  const normalized = normalizeResponse(actualData);

  if (!normalized.token) {
    throw new Error(
      "Token manquant dans la réponse (vérifie la shape renvoyée par le backend)"
    );
  }

  const tokens = {
    accessToken: normalized.token,
    tokenType: normalized.tokenType || "Bearer",
    expiresAt: normalized.expiresAt || Date.now() + 24 * 60 * 60 * 1000, // fallback 24h
    refreshToken: normalized.refreshToken || null,
    raw: actualData,
  };

  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const getTokens = () => {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isExpired = () => {
  const tokens = getTokens();
  if (!tokens?.expiresAt) return false;
  return Date.now() >= tokens.expiresAt - 5 * 60 * 1000; // considérer expiré 5 min avant
};

const parseJwtPayload = (token) => {
  try {
    const b = token.split(".")[1];
    if (!b) return null;
    const payload = JSON.parse(atob(b.replace(/-/g, "+").replace(/_/g, "/")));
    return payload;
  } catch {
    return null;
  }
};

export const identityFromJwt = () => {
  const tokens = getTokens();
  if (!tokens?.accessToken) return null;
  const payload = parseJwtPayload(tokens.accessToken);
  if (!payload) return null;

  const id = payload.userId || payload.sub || payload.id || payload.user_id;
  const firstName =
    payload.firstName || payload.given_name || payload.givenName || payload.gn;
  const lastName =
    payload.lastName || payload.family_name || payload.familyName || payload.ln;
  const email = payload.email || payload.mail;
  const roles = Array.isArray(payload.roles)
    ? payload.roles
    : payload.role
    ? [payload.role]
    : payload.roles?.split?.(",") || [];

  return {
    id,
    firstName,
    lastName,
    fullName: `${(firstName || "").trim()} ${(lastName || "").trim()}`,
    email,
    roles,
    rawPayload: payload,
  };
};

export const exposeTokensToWindow = (expose = true) => {
  if (typeof window === "undefined") return;
  if (expose) {
    window.__getAuthTokens = getTokens;
    window.__clearAuthTokens = clearTokens;
  } else {
    delete window.__getAuthTokens;
    delete window.__clearAuthTokens;
  }
};
