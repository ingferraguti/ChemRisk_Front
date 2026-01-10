"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken, getToken, setToken } from "@/lib/auth";

type AuthState = {
  token: string | null;
  ready: boolean;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
};

export function useAuth(): AuthState {
  const [token, setTokenState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTokenState(getToken());
    setReady(true);
  }, []);

  const setAuthToken = (newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
  };

  const clearAuthToken = () => {
    clearToken();
    setTokenState(null);
  };

  return {
    token,
    ready,
    setAuthToken,
    clearAuthToken,
  };
}

export function useRequireAuth() {
  const router = useRouter();
  const { token, ready } = useAuth();

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (!token) {
      router.replace("/login");
    }
  }, [ready, router, token]);

  return ready && Boolean(token);
}
