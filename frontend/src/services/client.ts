// In dev, Vite proxies /api → localhost:5000. Override with VITE_API_URL if needed.
export const API_URL = import.meta.env.VITE_API_URL || "/api";
export const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:5000";
