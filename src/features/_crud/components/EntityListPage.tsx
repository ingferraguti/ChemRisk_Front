"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getEntity } from "@/features/_config/entities";
import { useEntityList } from "../hooks";
import { DataTable } from "./DataTable";
import { TableSkeleton } from "./TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function EntityListPage({ entityKey }: { entityKey: string }) {
  const entity = getEntity(entityKey);
  const router = useRouter();
  const [search, setSearch] = useState("");

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
    if (!search || entity.list.searchMode === "server") {
      return data as Array<Record<string, unknown>>;
    }

    const normalized = search.toLowerCase();
    return (data as Array<Record<string, unknown>>).filter((item) =>
      entity.list.columns.some((column) => {
        const value = item[String(column.key)];
        return typeof value === "string" && value.toLowerCase().includes(normalized);
      })
    );
  }, [data, search, entity.list.columns, entity.list.searchMode]);

  useEffect(() => {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{entity.label}</h1>
          <p className="text-sm text-muted-foreground">Gestisci {entity.label.toLowerCase()}.</p>
        </div>
        <Button asChild>
          <Link href={`${entity.routes.base}/new`}>Nuovo</Link>
        </Button>
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
