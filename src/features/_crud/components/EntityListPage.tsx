"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getEntity } from "@/features/_config/entities";
import { useEntityList } from "../hooks";
import { DataTable } from "./DataTable";
import { TableSkeleton } from "./TableSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function EntityListPage({ entityKey }: { entityKey: string }) {
  const entity = getEntity(entityKey);
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
  }, [entityKey]);

  if (!entity) {
    return <div>Entity non trovata.</div>;
  }

  const { data, isLoading, error } = useEntityList(entityKey, {
    search: search || undefined,
  });

  const items = useMemo(() => {
    if (!data) {
      return [] as Array<Record<string, unknown>>;
    }
    const list =
      Array.isArray(data)
        ? data
        : (data as {
            data?: unknown;
            items?: unknown;
            results?: unknown;
            users?: unknown;
            user?: unknown;
            list?: unknown;
          });
    const normalized = Array.isArray(list)
      ? list
      : Array.isArray(list.data)
        ? list.data
        : Array.isArray(list.items)
          ? list.items
          : Array.isArray(list.results)
            ? list.results
            : Array.isArray(list.users)
              ? list.users
              : Array.isArray(list.user)
                ? list.user
                : Array.isArray(list.list)
                  ? list.list
                  : [];
    const withIds = (normalized as Array<Record<string, unknown>>).map((item) => {
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

 console.log("EntityListPage entityKey", entityKey);
console.log("useEntityList data", data);
console.log("items.length", items.length);
console.log("items[0]", items[0]);
console.log("columns keys", entity.list.columns.map(c => String(c.key)));
console.log("idField", entity.idField);


  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{entity.label}</h1>
          <p className="text-sm text-muted-foreground">Gestisci {entity.label.toLowerCase()}.</p>
        </div>
        <Link
          href={`${entity.routes.base}/new`}
          className={buttonVariants({ variant: "default" })}
        >
          Nuovo
        </Link>
      </div>
      {entity.list.enableSearch && (
        <Input
          placeholder="Cerca..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
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
