import type { LoginResponse } from "@/generated/api";
import { getBaseUrl } from "@/lib/http";
import { getToken, setToken } from "@/lib/auth";

/**
 * Small helper for API requests that automatically applies auth headers.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const token = getToken();

  // Merge default headers with any caller-provided headers.
  const headers = new Headers(options.headers ?? {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

/**
 * Authenticate with username/password and store the token on success.
 */
export async function login(username: string, password: string) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed with status ${response.status}`);
  }

  const data = (await response.json()) as LoginResponse;
  setToken(data.token);

  return data;
}

/**
 * Example protected call using the shared apiFetch helper.
 */
export function getFrasiH() {
  return apiFetch("/frasih");
}
