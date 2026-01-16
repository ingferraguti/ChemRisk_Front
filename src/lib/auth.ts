import { postAuthLogin, type LoginRequest, type TokenResponse } from "@/generated/api";

const TOKEN_KEY = "chemrisk_token";
const ROLES_KEY = "chemrisk_roles";

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ROLES_KEY);
}

export function setRoles(roles: string[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
}

export function getRoles(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  const stored = window.localStorage.getItem(ROLES_KEY);
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((role) => typeof role === "string") : [];
  } catch {
    return [];
  }
}

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  return postAuthLogin(payload);
}

export function logout() {
  clearToken();
}
