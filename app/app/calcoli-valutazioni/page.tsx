"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postCalcoliValutazioni,
  postCalcoliValutazioniId,
  type CalcoloValutazioneResponse,
} from "@/generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const parseNumber = (value: string) => {
  if (!value) {
    return undefined;
  }
  const numeric = Number(value);
  return Number.isNaN(numeric) ? undefined : numeric;
};

const calcSchema = z.object({
  lavoratoreId: z.string().min(1, "Obbligatorio"),
  agenteChimicoId: z.string().min(1, "Obbligatorio"),
  metodoVersione: z.string().min(1, "Obbligatorio"),
  einal: z.string().optional(),
  statoFisicoInal: z.string().optional(),
  quantitaKg: z.string().optional(),
  tipoUsoInal: z.string().optional(),
  tipoControlloInal: z.string().optional(),
  tempoInalMin: z.string().optional(),
  distanzaM: z.string().optional(),
  ecute: z.string().optional(),
  esposizioneCutanea: z.string().optional(),
  livelliContattoCutaneo: z.string().optional(),
  tipoControlloProc: z.string().optional(),
  quantitaProcKg: z.string().optional(),
  tempoProcMin: z.string().optional(),
});

const calcByIdSchema = z.object({
  id: z.string().min(1, "Obbligatorio"),
  metodoVersione: z.string().min(1, "Obbligatorio"),
});

type CalcValues = z.infer<typeof calcSchema>;
type CalcByIdValues = z.infer<typeof calcByIdSchema>;

export default function CalcoliValutazioniPage() {
  const [result, setResult] = useState<CalcoloValutazioneResponse | null>(null);
  const [resultById, setResultById] = useState<CalcoloValutazioneResponse | null>(null);

  const form = useForm<CalcValues>({
    resolver: zodResolver(calcSchema),
    defaultValues: {
      metodoVersione: "1.0",
    },
  });

  const formById = useForm<CalcByIdValues>({
    resolver: zodResolver(calcByIdSchema),
    defaultValues: { metodoVersione: "1.0" },
  });

  const submitCalc = async (values: CalcValues) => {
    try {
      const response = await postCalcoliValutazioni({
        lavoratoreId: Number(values.lavoratoreId),
        agenteChimicoId: Number(values.agenteChimicoId),
        metodoVersione: values.metodoVersione,
        einal: parseNumber(values.einal ?? ""),
        statoFisicoInal: parseNumber(values.statoFisicoInal ?? ""),
        quantitaKg: parseNumber(values.quantitaKg ?? ""),
        tipoUsoInal: parseNumber(values.tipoUsoInal ?? ""),
        tipoControlloInal: parseNumber(values.tipoControlloInal ?? ""),
        tempoInalMin: parseNumber(values.tempoInalMin ?? ""),
        distanzaM: parseNumber(values.distanzaM ?? ""),
        ecute: parseNumber(values.ecute ?? ""),
        esposizioneCutanea:
          values.esposizioneCutanea === "true"
            ? true
            : values.esposizioneCutanea === "false"
              ? false
              : undefined,
        livelliContattoCutaneo: parseNumber(values.livelliContattoCutaneo ?? ""),
        tipoControlloProc: parseNumber(values.tipoControlloProc ?? ""),
        quantitaProcKg: parseNumber(values.quantitaProcKg ?? ""),
        tempoProcMin: parseNumber(values.tempoProcMin ?? ""),
      });
      setResult(response);
      toast.success("Calcolo completato");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore calcolo";
      toast.error(message);
    }
  };

  const submitCalcById = async (values: CalcByIdValues) => {
    try {
      const response = await postCalcoliValutazioniId(Number(values.id), {
        metodoVersione: values.metodoVersione,
      });
      setResultById(response);
      toast.success("Calcolo completato");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore calcolo";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Calcoli valutazioni</h1>
        <p className="text-sm text-muted-foreground">Esegui i calcoli stateless.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={form.handleSubmit(submitCalc)}
          className="space-y-4 rounded-lg border bg-background p-6 shadow"
        >
          <div>
            <h2 className="text-lg font-semibold">Calcolo senza ID</h2>
            <p className="text-sm text-muted-foreground">POST /calcoli/valutazioni</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Lavoratore ID</label>
              <Input {...form.register("lavoratoreId")} />
            </div>
            <div>
              <label className="text-sm font-medium">Agente chimico ID</label>
              <Input {...form.register("agenteChimicoId")} />
            </div>
            <div>
              <label className="text-sm font-medium">Metodo versione</label>
              <Input {...form.register("metodoVersione")} />
            </div>
            <div>
              <label className="text-sm font-medium">Einal</label>
              <Input {...form.register("einal")} />
            </div>
            <div>
              <label className="text-sm font-medium">Stato fisico inal</label>
              <Input {...form.register("statoFisicoInal")} />
            </div>
            <div>
              <label className="text-sm font-medium">Quantita (kg)</label>
              <Input {...form.register("quantitaKg")} />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo uso inal</label>
              <Input {...form.register("tipoUsoInal")} />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo controllo inal</label>
              <Input {...form.register("tipoControlloInal")} />
            </div>
            <div>
              <label className="text-sm font-medium">Tempo inal (min)</label>
              <Input {...form.register("tempoInalMin")} />
            </div>
            <div>
              <label className="text-sm font-medium">Distanza (m)</label>
              <Input {...form.register("distanzaM")} />
            </div>
            <div>
              <label className="text-sm font-medium">Ecute</label>
              <Input {...form.register("ecute")} />
            </div>
            <div>
              <label className="text-sm font-medium">Esposizione cutanea</label>
              <Input {...form.register("esposizioneCutanea")} placeholder="true/false" />
            </div>
            <div>
              <label className="text-sm font-medium">Livelli contatto cutaneo</label>
              <Input {...form.register("livelliContattoCutaneo")} />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo controllo proc</label>
              <Input {...form.register("tipoControlloProc")} />
            </div>
            <div>
              <label className="text-sm font-medium">Quantita proc (kg)</label>
              <Input {...form.register("quantitaProcKg")} />
            </div>
            <div>
              <label className="text-sm font-medium">Tempo proc (min)</label>
              <Input {...form.register("tempoProcMin")} />
            </div>
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Calcola
          </Button>
          {result && (
            <pre className="rounded-md border bg-muted/20 p-3 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </form>

        <form
          onSubmit={formById.handleSubmit(submitCalcById)}
          className="space-y-4 rounded-lg border bg-background p-6 shadow"
        >
          <div>
            <h2 className="text-lg font-semibold">Calcolo con ID</h2>
            <p className="text-sm text-muted-foreground">POST /calcoli/valutazioni/{'{id}'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Valutazione ID</label>
            <Input {...formById.register("id")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Metodo versione</label>
            <Input {...formById.register("metodoVersione")} />
          </div>
          <Button type="submit" disabled={formById.formState.isSubmitting}>
            Calcola
          </Button>
          {resultById && (
            <pre className="rounded-md border bg-muted/20 p-3 text-xs">
              {JSON.stringify(resultById, null, 2)}
            </pre>
          )}
        </form>
      </div>
    </div>
  );
}
