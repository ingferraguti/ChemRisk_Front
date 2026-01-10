import {
  postLogin,
  postVerifyToken,
  type LoginRequest,
  type LoginResponse,
} from "@/generated/api";

const TOKEN_KEY = "chemrisk_token";

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
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return postLogin(payload);
}

export function logout() {
  clearToken();
}

export async function verifyToken(token: string) {
  return postVerifyToken({ token });
}
