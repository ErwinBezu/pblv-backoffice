const STORAGE_KEY = "auth.tokens.v1";

export function saveTokens(input) {
  const dto = input && input.data ? input.data : input || {};
  const accessToken = dto.accessToken || dto.token;
  if (!accessToken) throw new Error("No access token in response");
  const now = Math.floor(Date.now() / 1000);
  let exp;
  const decoded = decodeJwt(accessToken);
  if (decoded && decoded.exp) exp = Number(decoded.exp);
  if (!exp && dto.expiresAt) {
    let v =
      typeof dto.expiresAt === "string"
        ? Date.parse(dto.expiresAt) / 1000
        : Number(dto.expiresAt);
    if (!isNaN(v)) exp = v > 1e10 ? Math.floor(v / 1000) : v;
  }
  if (!exp && dto.expiresIn) exp = now + Number(dto.expiresIn);
  const record = {
    accessToken,
    refreshToken: dto.refreshToken || null,
    exp: exp || now + 3600,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  return record;
}
export function getTokens() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function clearTokens() {
  localStorage.removeItem(STORAGE_KEY);
}
export function isExpired(leeway = 30) {
  const t = getTokens();
  if (!t) return true;
  const now = Math.floor(Date.now() / 1000);
  return t.exp <= now + leeway;
}
export function decodeJwt(token) {
  try {
    if (!token) return null;
    const p = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(p))));
  } catch {
    return null;
  }
}
export function identityFromJwt() {
  const d = decodeJwt(getTokens()?.accessToken) || {};
  const id = d.sub || d.id || "me";
  const fullName =
    d.name ||
    [d.given_name, d.family_name].filter(Boolean).join(" ") ||
    d.preferred_username ||
    d.email ||
    "Utilisateur";
  return {
    id,
    fullName,
    email: d.email,
    avatar: d.picture,
    roles: d.roles || d.authorities || [],
  };
}
