"use client";

import { useAuthGuard } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ready = useAuthGuard();

  if (!ready) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
