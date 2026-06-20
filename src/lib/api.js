/* Thin fetch wrapper + typed endpoint helpers for the Express backend.
   GET is public; POST/PUT/DELETE require a Bearer token. */

const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:3000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (method === "DELETE" && res.ok) return null;
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.error_description || data.error || message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  login: (email, password) =>
    request("login", { method: "POST", body: { email, password } }),

  // Resource collections used by the public site and admin dashboard.
  list: (resource) => request(resource),
  create: (resource, body, token) =>
    request(resource, { method: "POST", body: { ...body, id: undefined }, token }),
  update: (resource, id, body, token) =>
    request(`${resource}/${id}`, { method: "PUT", body, token }),
  remove: (resource, id, token) =>
    request(`${resource}/${id}`, { method: "DELETE", token }),

  // `company` is a singleton (id = 1) with a bespoke PUT route.
  updateCompany: (body, token) =>
    request("company", { method: "PUT", body, token }),
};

export { API_URL };
