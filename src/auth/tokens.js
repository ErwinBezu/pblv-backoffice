const TOKEN_KEY = "auth_tokens";

export const saveTokens = (data) => {
  // Gérer le format ApiResponse wrappé ou direct
  const actualData = data?.data || data;

  const token = actualData?.token;
  const tokenType = actualData?.tokenType || "Bearer";
  const expiresAt = actualData?.expiresAt;

  if (!token) {
    throw new Error("Token manquant dans la réponse");
  }

  // Votre backend retourne juste "token", pas "accessToken"
  // On le stocke sous "accessToken" pour compatibilité avec apiClient
  const tokens = {
    accessToken: token,
    tokenType: tokenType,
    expiresAt: expiresAt || Date.now() + 24 * 60 * 60 * 1000, // 24h par défaut
    refreshToken: actualData?.refreshToken || null,
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

  // Considérer comme expiré si moins de 5 minutes restantes
  return Date.now() >= tokens.expiresAt - 5 * 60 * 1000;
};

export const identityFromJwt = () => {
  const tokens = getTokens();
  if (!tokens?.accessToken) return null;

  try {
    const payload = JSON.parse(atob(tokens.accessToken.split(".")[1]));

    return {
      id: payload.userId,
      fullName: `${payload.firstName || ""} ${payload.lastName || ""}`.trim(),
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      roles: payload.role ? [payload.role] : [],
      role: payload.role,
      permissions: payload.permissions || {},
      communityId: payload.communityId || null,
    };
  } catch (error) {
    console.error("Erreur lors du décodage du JWT:", error);
    return null;
  }
};
