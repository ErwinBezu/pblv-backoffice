import { clearTokens, getTokens, isExpired, saveTokens } from "./tokens";

const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const buildUrl = (p) =>
  p.startsWith("http") ? p : `${BASE}${p.startsWith("/") ? "" : "/"}${p}`;

async function tryRefresh() {
  const t = getTokens();
  if (!t?.refreshToken) return false;
  const res = await fetch(
    buildUrl(
      `/api/auth/refresh?refreshToken=${encodeURIComponent(t.refreshToken)}`
    ),
    { method: "POST", headers: { Accept: "application/json" } }
  );
  if (!res.ok) return false;
  const json = await res.json().catch(() => ({}));
  try {
    saveTokens(json);
  } catch {
    return false;
  }
  return true;
}

export async function apiFetch(input, init = {}, retry = true) {
  const url = buildUrl(input);
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");
  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const t = getTokens();
  if (t?.accessToken) {
    if (isExpired() && (await tryRefresh()) === false) {
      clearTokens();
      return new Response(null, { status: 401, statusText: "Token expired" });
    }
    headers.set("Authorization", `Bearer ${getTokens().accessToken}`);
  }
  const res = await fetch(url, { ...init, headers });
  if (res.status === 401 && retry && (await tryRefresh())) {
    const headers2 = new Headers(init.headers || {});
    headers2.set("Accept", "application/json");
    if (!headers2.has("Content-Type"))
      headers2.set("Content-Type", "application/json");
    headers2.set("Authorization", `Bearer ${getTokens().accessToken}`);
    return fetch(url, { ...init, headers: headers2 });
  }
  return res;
}

const safeJson = (t) => {
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
};

export async function apiJson(input, init) {
  const res = await apiFetch(input, init);
  const text = await res.text();
  const json = text ? safeJson(text) : null;
  if (!res.ok) {
    const msg =
      (json && (json.message || (json.error && json.error.message))) ||
      text ||
      res.statusText;
    const err = new Error(msg);
    err.status = res.status;
    err.body = json || text;
    throw err;
  }
  if (
    json &&
    typeof json === "object" &&
    Object.prototype.hasOwnProperty.call(json, "success")
  ) {
    if (json.success === false) {
      const err = new Error((json.error && json.error.message) || "Erreur");
      err.status = res.status;
      err.body = json;
      throw err;
    }
    return json.data != null ? json.data : json;
  }
  return json;
}
