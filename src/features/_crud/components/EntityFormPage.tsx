"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getEntity } from "@/features/_config/entities";
import { useCreateEntity, useEntity, useUpdateEntity } from "../hooks";
import { buildSchema } from "../validation";
import { FieldRenderer } from "./FieldRenderer";
import { FormSkeleton } from "./FormSkeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function EntityFormPage({
  entityKey,
  mode,
  id,
}: {
  entityKey: string;
  mode: "create" | "edit";
  id?: number;
}) {
  const entity = getEntity(entityKey);
  const router = useRouter();

  if (!entity) {
    return <div>Entity non trovata.</div>;
  }

  const visibleFields = entity.form.fields.filter((field) => {
    if (mode === "create" && field.hideOnCreate) {
      return false;
    }
    if (mode === "edit" && field.hideOnEdit) {
      return false;
    }
    return true;
  });

  const schema = buildSchema(visibleFields);
  const defaultValues = visibleFields.reduce<Record<string, unknown>>((acc, field) => {
    if (field.multiple) {
      acc[field.name] = [];
    } else if (field.type === "boolean") {
      acc[field.name] = false;
    } else {
      acc[field.name] = "";
    }
    return acc;
  }, {});

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { data, isLoading } = useEntity(entityKey, id ?? Number.NaN);
  const createMutation = useCreateEntity(entityKey);
  const updateMutation = useUpdateEntity(entityKey, id ?? 0);

  useEffect(() => {
    if (mode === "edit" && data) {
      form.reset(data as Record<string, unknown>);
    }
  }, [mode, data, form]);

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      const payload = visibleFields.reduce<Record<string, unknown>>((acc, field) => {
        const rawValue = values[field.name];
        acc[field.name] = field.parse ? field.parse(rawValue) : rawValue;
        return acc;
      }, {});
      if (mode === "create") {
        const created = await createMutation.mutateAsync(payload);
        toast.success("Creato con successo");
        const idField = entity.idField ?? "id";
        const createdId = (created as Record<string, unknown>)[String(idField)];
        if (createdId) {
          router.push(`${entity.routes.base}/${createdId}`);
        } else {
          router.push(entity.routes.base);
        }
      } else if (id) {
        await updateMutation.mutateAsync(payload);
        toast.success("Aggiornato con successo");
        router.push(`${entity.routes.base}/${id}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore salvataggio";
      toast.error(message);
    }
  };

  if (mode === "edit" && isLoading) {
    return <FormSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">
          {mode === "create" ? `Nuovo ${entity.label}` : `Modifica ${entity.label}`}
        </h1>
        <p className="text-sm text-muted-foreground">Compila i dati richiesti.</p>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border bg-background p-6 shadow"
      >
        {visibleFields.map((field) => (
          <FieldRenderer key={field.name} field={field} control={form.control} />
        ))}
        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {mode === "create" ? "Crea" : "Salva"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annulla
          </Button>
        </div>
      </form>
    </div>
  );
}
