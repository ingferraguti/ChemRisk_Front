"use client";

import { useRequireAuth } from "@/lib/auth.client";

type AuthGateProps = {
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const ready = useRequireAuth();

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
