import { apiFetch } from "./auth/apiClient";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const PATHS = {
  users: "/api/users",
  reports: "/api/reports",
  communities: "/api/communities",
  "collect-centers": "/api/collect-center",

  bins: "/api/bins", // BinController
  "bin-types": "/api/bin-type", // BinTypeController
  calendars: "/api/calendars", // CalendarController

  roles: "/api/roles",
  "garbage-types": "/api/garbage-type",
  "user-addresses": "/api/user-address",
};

const pathFor = (resource) => PATHS[resource] || `/${resource}`;

const readJson = async (res) => {
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
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
  // unifier ApiResponse vs brut
  if (
    json &&
    typeof json === "object" &&
    Object.prototype.hasOwnProperty.call(json, "success")
  ) {
    return json.data != null ? json.data : json;
  }
  return json;
};

const ensureId = (rec) => {
  if (!rec) return rec;
  if (rec.id) return rec;
  // tente de normaliser si backend renvoie "uuid" ou "_id"
  if (rec.uuid) return { ...rec, id: rec.uuid };
  if (rec._id) return { ...rec, id: rec._id };
  return rec;
};

const dp = {
  // NOTE: beaucoup d'endpoints ne paginent pas -> on pagine côté client
  async getList(resource, { pagination, sort, filter }) {
    const url = `${API}${pathFor(resource)}`;
    const res = await apiFetch(url, { method: "GET" });
    const data = await readJson(res);
    const list = Array.isArray(data)
      ? data
      : data?.items || data?.results || data || [];
    // tri client si demandé
    const withId = list.map(ensureId);
    const { page = 1, perPage = 25 } = pagination || {};
    const sliced = withId.slice((page - 1) * perPage, page * perPage);
    // simple tri client
    if (sort?.field) {
      const order = (sort.order || "ASC").toUpperCase() === "DESC" ? -1 : 1;
      sliced.sort(
        (a, b) => (a?.[sort.field] > b?.[sort.field] ? 1 : -1) * order
      );
    }
    return { data: sliced, total: withId.length };
  },

  async getOne(resource, { id }) {
    const res = await apiFetch(
      `${API}${pathFor(resource)}/${encodeURIComponent(id)}`
    );
    const data = await readJson(res);
    return { data: ensureId(data) };
  },

  async getMany(resource, { ids }) {
    // fallback: charge tout puis filtre (si pas d'endpoint batch)
    const { data } = await dp.getList(resource, {
      pagination: { page: 1, perPage: 10000 },
    });
    const map = new Map(data.map((d) => [String(d.id), d]));
    return { data: ids.map((id) => map.get(String(id))).filter(Boolean) };
  },

  async getManyReference(resource, params) {
    // fallback: filtre client si target présent dans records
    const { target, id } = params;
    const list = await dp.getList(resource, params);
    return {
      data: list.data.filter((r) => r?.[target] === id),
      total: list.total,
    };
  },

  async create(resource, { data }) {
    const res = await apiFetch(`${API}${pathFor(resource)}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const json = await readJson(res);
    return { data: ensureId(json) };
  },

  async update(resource, { id, data }) {
    const res = await apiFetch(
      `${API}${pathFor(resource)}/${encodeURIComponent(id)}`,
      { method: "PUT", body: JSON.stringify(data) }
    );
    const json = await readJson(res);
    return { data: ensureId(json) };
  },

  async updateMany(resource, { ids, data }) {
    // fallback: boucle (si pas d'endpoint bulk)
    const results = await Promise.all(
      ids.map((id) => dp.update(resource, { id, data }))
    );
    return { data: results.map((r) => r.data.id) };
  },

  async delete(resource, { id }) {
    const res = await apiFetch(
      `${API}${pathFor(resource)}/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
    await readJson(res).catch(() => null);
    return { data: { id } };
  },

  async deleteMany(resource, { ids }) {
    await Promise.all(ids.map((id) => dp.delete(resource, { id })));
    return { data: ids };
  },
};

export const dataProvider = dp;
export default dp;
