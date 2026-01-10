import { Sidebar } from "@/components/layout/Sidebar";
import { AuthGate } from "@/components/auth/AuthGate";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthGate>
  );
}
