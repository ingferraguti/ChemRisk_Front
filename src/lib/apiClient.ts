const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

/**
 * Small helper for API requests that automatically applies auth headers.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // Read token from localStorage in the browser.
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Merge default headers with any caller-provided headers.
  const headers = new Headers(options.headers ?? {});
  if (token) {
    headers.set("Authorization", token);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
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
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed with status ${response.status}`);
  }

  const data = (await response.json()) as { token?: string };
  if (data.token) {
    // Store token for subsequent requests.
    localStorage.setItem("token", data.token);
  }

  return data;
}

/**
 * Example protected call using the shared apiFetch helper.
 */
export function getFrasiH() {
  return apiFetch("/frasih");
}
