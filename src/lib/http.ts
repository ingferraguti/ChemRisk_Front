import { getToken } from "./auth";

/**
 * HTTP helper used by generated OpenAPI clients.
 *
 * Example .env.local:
 *   NEXT_PUBLIC_API_BASE_URL=https://example.com/api/action.php
 *
 * Note: storing the token in localStorage is an MVP choice. For SSR,
 * move auth to secure httpOnly cookies.
 */
const DEFAULT_BASE_URL = "/api/action.php";

const AUTH_FREE_PATHS = new Set(["/login", "/verifyToken"]);

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const stripQueryAndHash = (value: string) => value.split(/[?#]/)[0] ?? value;

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, "");

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

const joinBaseAndPath = (baseUrl: string, path: string) => {
  if (!baseUrl) {
    return path;
  }
  return `${normalizeBaseUrl(baseUrl)}${normalizePath(path)}`;
};

const resolveRequestPath = (url: string) => {
  if (isAbsoluteUrl(url)) {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }
  return url;
};

export function getBaseUrl(): string {
  const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envBaseUrl && envBaseUrl.trim().length > 0) {
    return envBaseUrl;
  }
  return DEFAULT_BASE_URL;
}

export async function customFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const fullUrl = isAbsoluteUrl(url) ? url : joinBaseAndPath(baseUrl, url);
  const headers = new Headers(options.headers ?? {});

  const path = stripQueryAndHash(resolveRequestPath(url));
  const shouldSkipAuth = AUTH_FREE_PATHS.has(path);
  if (!shouldSkipAuth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (options.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = errorText || `HTTP ${response.status}`;
    try {
      if (errorText) {
        const parsed = JSON.parse(errorText) as { message?: string; error?: string };
        message = parsed.message ?? parsed.error ?? message;
      }
    } catch {
      // Keep text message fallback.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  const text = await response.text();
  return text as T;
}
