"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getEntity } from "@/features/_config/entities";
import { useDeleteEntity, useEntity } from "../hooks";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "./DeleteDialog";
import { FormSkeleton } from "./FormSkeleton";
import { toast } from "sonner";

export function EntityDetailPage({ entityKey, id }: { entityKey: string; id: number }) {
  const entity = getEntity(entityKey);
  const router = useRouter();

  if (!entity) {
    return <div>Entity non trovata.</div>;
  }

  const { data, isLoading, error } = useEntity(entityKey, id);
  const deleteMutation = useDeleteEntity(entityKey);

  useEffect(() => {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }, [error]);

  if (isLoading || !data) {
    return <FormSkeleton />;
  }

  const entries = Object.entries(data as Record<string, unknown>);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{entity.label}</h1>
          <p className="text-sm text-muted-foreground">Dettaglio elemento.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`${entity.routes.base}/${id}/edit`}>Modifica</Link>
          </Button>
          <DeleteDialog
            label={entity.label}
            onConfirm={async () => {
              try {
                await deleteMutation.mutateAsync(id);
                toast.success("Eliminato con successo");
                router.push(entity.routes.base);
              } catch (deleteError) {
                const message = deleteError instanceof Error ? deleteError.message : "Errore eliminazione";
                toast.error(message);
              }
            }}
          />
        </div>
      </div>
      <div className="rounded-lg border bg-background p-6 shadow">
        <dl className="grid gap-4 md:grid-cols-2">
          {entries.map(([key, value]) => (
            <div key={key}>
              <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
              <dd className="text-sm">{Array.isArray(value) ? value.join(", ") : String(value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
