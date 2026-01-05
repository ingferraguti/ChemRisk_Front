import { getToken } from "./auth";

const DEFAULT_BASE_URL = "/api/action.php";

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;
}

export async function customFetch<T>(url: string, options: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const headers = new Headers(options.headers ?? {});

  const shouldSkipAuth = url.includes("/login") || url.includes("/verifyToken");
  if (!shouldSkipAuth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  headers.set("Content-Type", "application/json");

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}
