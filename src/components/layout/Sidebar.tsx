"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ENTITIES } from "@/features/_config/entities";
import { Button } from "@/components/ui/button";
import { clearToken, getRoles } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const roles = getRoles();
  const isAdmin = roles.some((role) => role.toLowerCase() === "admin");
  const items = ENTITIES.filter((entity) => {
    if (entity.hideInSidebar) {
      return false;
    }
    if (entity.requiresAdmin) {
      return isAdmin;
    }
    return true;
  });

  return (
    <aside className="w-64 border-r bg-background p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">ChemRisk</h2>
        <p className="text-xs text-muted-foreground">MVP Dashboard</p>
      </div>
      <nav className="space-y-1">
        <Link
          href="/app/profile"
          className={cn(
            "block rounded-md px-3 py-2 text-sm font-medium",
            pathname === "/app/profile"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          Profilo
        </Link>
        {items.map((entity) => (
          <Link
            key={entity.key}
            href={entity.routes.base}
            className={cn(
              "block rounded-md px-3 py-2 text-sm font-medium",
              pathname.startsWith(entity.routes.base)
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {entity.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            clearToken();
            router.replace("/login");
          }}
        >
          Esci
        </Button>
      </div>
    </aside>
  );
}
