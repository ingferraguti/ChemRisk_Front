"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEntity } from "@/features/_config/entities";
import { useDeleteEntity, useEntity } from "../hooks";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "./DeleteDialog";
import { FormSkeleton } from "./FormSkeleton";
import { toast } from "sonner";
import { getRoles } from "@/lib/auth";
import { HttpError } from "@/lib/http";
import {
  postCalcoliValutazioni,
  postCalcoliValutazioniId,
  type CalcoloValutazioneRequest,
  type CalcoloValutazioneResponse,
} from "@/generated/api";

export function EntityDetailPage({ entityKey, id }: { entityKey: string; id: number }) {
  const entity = getEntity(entityKey);
  const router = useRouter();
  const roles = getRoles();
  const isAdmin = roles.some((role) => role.toLowerCase() === "admin");
  const [metodoVersione, setMetodoVersione] = useState("1.0");
  const [calcoloResult, setCalcoloResult] = useState<CalcoloValutazioneResponse | null>(null);
  const isReadOnly =
    typeof entity.readOnly === "function" ? entity.readOnly(roles) : Boolean(entity.readOnly);

  if (!entity) {
    return <div>Entity non trovata.</div>;
  }
  if (entity.requiresAdmin && !isAdmin) {
    return <div>Non autorizzato.</div>;
  }

  const { data, isLoading, error } = useEntity(entityKey, id);
  const deleteMutation = useDeleteEntity(entityKey);

  useEffect(() => {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }, [error]);

  if (error instanceof HttpError && !isLoading) {
    if (error.status === 403) {
      return <div>Non autorizzato.</div>;
    }
    if (error.status === 404) {
      return <div>Risorsa non trovata.</div>;
    }
  }

  if (isLoading || !data) {
    return <FormSkeleton />;
  }

  const entries = Object.entries(data as Record<string, unknown>);
  const showCalcoli = entity.key === "valutazioni";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{entity.label}</h1>
          <p className="text-sm text-muted-foreground">Dettaglio elemento.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isReadOnly && (
            <Button asChild variant="outline">
              <Link href={`${entity.routes.base}/${id}/edit`}>Modifica</Link>
            </Button>
          )}
          {!isReadOnly && (
            <DeleteDialog
              label={entity.label}
              onConfirm={async () => {
                try {
                  await deleteMutation.mutateAsync(id);
                  toast.success("Eliminato con successo");
                  if (entity.parent) {
                    const parentValue = (data as Record<string, unknown>)[entity.parent.param];
                    if (parentValue) {
                      router.push(`${entity.routes.base}?${entity.parent.param}=${parentValue}`);
                      return;
                    }
                  }
                  router.push(entity.routes.base);
                } catch (deleteError) {
                  const message =
                    deleteError instanceof Error ? deleteError.message : "Errore eliminazione";
                  toast.error(message);
                }
              }}
            />
          )}
          {entity.children?.map((child) => (
            <Button key={child.routeBase} asChild variant="secondary">
              <Link href={`${child.routeBase}?${child.param}=${id}`}>{child.label}</Link>
            </Button>
          ))}
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
      {showCalcoli && (
        <div className="space-y-3 rounded-lg border bg-background p-6 shadow">
          <div>
            <h2 className="text-lg font-semibold">Calcolo valutazione</h2>
            <p className="text-sm text-muted-foreground">
              Esegui un calcolo stateless senza salvare risultati.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-sm font-medium">Metodo versione</label>
            <input
              className="h-9 rounded-md border px-3 text-sm"
              value={metodoVersione}
              onChange={(event) => setMetodoVersione(event.target.value)}
            />
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const payload = data as Record<string, unknown>;
                  const request: CalcoloValutazioneRequest = {
                    lavoratoreId: Number(payload.lavoratoreId),
                    agenteChimicoId: Number(payload.agenteChimicoId),
                    metodoVersione,
                    einal: payload.einal as number | null | undefined,
                    statoFisicoInal: payload.statoFisicoInal as number | null | undefined,
                    quantitaKg: payload.quantitaKg as number | null | undefined,
                    tipoUsoInal: payload.tipoUsoInal as number | null | undefined,
                    tipoControlloInal: payload.tipoControlloInal as number | null | undefined,
                    tempoInalMin: payload.tempoInalMin as number | null | undefined,
                    distanzaM: payload.distanzaM as number | null | undefined,
                    ecute: payload.ecute as number | null | undefined,
                    esposizioneCutanea: payload.esposizioneCutanea as boolean | null | undefined,
                    livelliContattoCutaneo: payload.livelliContattoCutaneo as number | null | undefined,
                    tipoControlloProc: payload.tipoControlloProc as number | null | undefined,
                    quantitaProcKg: payload.quantitaProcKg as number | null | undefined,
                    tempoProcMin: payload.tempoProcMin as number | null | undefined,
                  };
                  const result = await postCalcoliValutazioni(request);
                  setCalcoloResult(result);
                  toast.success("Calcolo eseguito");
                } catch (calcError) {
                  const message = calcError instanceof Error ? calcError.message : "Errore calcolo";
                  toast.error(message);
                }
              }}
            >
              Calcola (stateless)
            </Button>
            <Button
              onClick={async () => {
                try {
                  const result = await postCalcoliValutazioniId(id, { metodoVersione });
                  setCalcoloResult(result);
                  toast.success("Calcolo eseguito");
                } catch (calcError) {
                  const message = calcError instanceof Error ? calcError.message : "Errore calcolo";
                  toast.error(message);
                }
              }}
            >
              Calcola da ID
            </Button>
          </div>
          {calcoloResult && (
            <div className="rounded-md border bg-muted/20 p-3 text-sm">
              <pre className="whitespace-pre-wrap">{JSON.stringify(calcoloResult, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
