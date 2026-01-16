import { clearToken, getToken } from "./auth";

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

const AUTH_FREE_PATHS = new Set(["/login", "/auth/login", "/verifyToken"]);

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
    const trimmed = envBaseUrl.trim();
    if (typeof window !== "undefined" && isAbsoluteUrl(trimmed)) {
      return DEFAULT_BASE_URL;
    }
    return trimmed;
  }
  return DEFAULT_BASE_URL;
}

export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
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
    let message = `HTTP ${response.status}`;
    let code: string | undefined;
    let details: unknown;
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const parsed = (await response.json()) as { message?: string; error?: string; code?: string; details?: unknown };
      message = parsed.message ?? parsed.error ?? message;
      code = parsed.code;
      details = parsed.details;
    } else {
      const errorText = await response.text();
      if (errorText) {
        message = errorText;
      }
    }

    if (response.status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    if (response.status === 403) {
      message = "Non autorizzato";
    }
    if (response.status === 404) {
      message = "Risorsa non trovata";
    }

    throw new HttpError(message, response.status, code, details);
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
