"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getEntity } from "@/features/_config/entities";
import { useEntityList } from "../hooks";
import { DataTable } from "./DataTable";
import { TableSkeleton } from "./TableSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getRoles } from "@/lib/auth";
import { HttpError } from "@/lib/http";

export function EntityListPage({ entityKey }: { entityKey: string }) {
  const entity = getEntity(entityKey);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const roles = getRoles();
  const isAdmin = roles.some((role) => role.toLowerCase() === "admin");
  const isReadOnly =
    typeof entity.readOnly === "function" ? entity.readOnly(roles) : Boolean(entity.readOnly);

  useEffect(() => {
    setSearch("");
  }, [entityKey]);

  if (!entity) {
    return <div>Entity non trovata.</div>;
  }
  if (entity.requiresAdmin && !isAdmin) {
    return <div>Non autorizzato.</div>;
  }

  const parentId = entity.parent ? Number(searchParams.get(entity.parent.param)) : undefined;
  if (entity.parent && (!parentId || Number.isNaN(parentId))) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{entity.label}</h1>
        <p className="text-sm text-muted-foreground">
          Seleziona prima {entity.parent.label.toLowerCase()}.
        </p>
        {entity.parent.routeBase && (
          <Link href={entity.parent.routeBase} className={buttonVariants({ variant: "outline" })}>
            Vai a {entity.parent.label}
          </Link>
        )}
      </div>
    );
  }

  const { data, isLoading, error } = useEntityList(entityKey, {
    search: search || undefined,
    context: entity.parent && parentId ? { parentId } : undefined,
  });

  const items = useMemo(() => {
    const normalized = (data?.items ?? []) as Array<Record<string, unknown>>;
    const withIds = normalized.map((item) => {
      if ("id" in item && item.id != null) {
        return item;
      }
      if ("_id" in item && item._id != null) {
        return { ...item, id: item._id };
      }
      if ("Codice" in item && item.Codice != null) {
        return { ...item, id: item.Codice };
      }
      return item;
    });

    if (!search || entity.list.searchMode === "server") {
      return withIds as Array<Record<string, unknown>>;
    }

    const normalizedSearch = search.toLowerCase();
    return (withIds as Array<Record<string, unknown>>).filter((item) =>
      entity.list.columns.some((column) => {
        const value = item[String(column.key)];
        const normalizedValue = String(value ?? "").toLowerCase();
        return normalizedValue.includes(normalizedSearch);
      })
    );
  }, [data, search, entity.list.columns, entity.list.searchMode]);

  useEffect(() => {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }, [error]);

  const showDebugMeta = process.env.NODE_ENV !== "production" && data?.meta;
  const warningsCount = data?.warnings?.length ?? 0;

  if (error instanceof HttpError && !isLoading) {
    if (error.status === 403) {
      return <div>Non autorizzato.</div>;
    }
    if (error.status === 404) {
      return <div>Risorsa non trovata.</div>;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{entity.label}</h1>
          <p className="text-sm text-muted-foreground">Gestisci {entity.label.toLowerCase()}.</p>
        </div>
        {!isReadOnly && (
          <Link
            href={`${entity.routes.base}/new${entity.parent && parentId ? `?${entity.parent.param}=${parentId}` : ""}`}
            className={buttonVariants({ variant: "default" })}
          >
            Nuovo
          </Link>
        )}
      </div>
      {entity.list.enableSearch && (
        <Input
          placeholder="Cerca..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
      )}
      {showDebugMeta && (
        <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
          <div>
            entityKey={data.meta.entityKey} pattern={data.meta.pattern} rawType=
            {data.meta.rawType} itemsLen={data.meta.length} warningsCount={warningsCount}
          </div>
        </div>
      )}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={entity.list.columns}
          data={items}
          onRowClick={(item) => {
            const idValue = item[String(entity.idField ?? "id")];
            if (idValue) {
              router.push(`${entity.routes.base}/${idValue}`);
            }
          }}
        />
      )}
    </div>
  );
}
