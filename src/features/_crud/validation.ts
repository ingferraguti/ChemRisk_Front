import { z } from "zod";
import type { FieldConfig } from "./types";

export function buildSchema(fields: FieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let schema: z.ZodTypeAny;

    switch (field.type) {
      case "number": {
        schema = z
          .coerce
          .number({
            invalid_type_error: "Valore numerico obbligatorio",
          })
          .refine((val) => !Number.isNaN(val), "Valore numerico non valido");
        if (typeof field.min === "number") {
          schema = schema.min(field.min, `Minimo ${field.min}`);
        }
        if (typeof field.max === "number") {
          schema = schema.max(field.max, `Massimo ${field.max}`);
        }
        break;
      }
      case "boolean": {
        schema = z.boolean();
        break;
      }
      case "date": {
        schema = z.string().min(1, "Data obbligatoria");
        break;
      }
      case "enum": {
        const options = field.options?.map((option) => option.value) ?? [];
        schema = z.string().refine((value) => options.includes(value), {
          message: "Seleziona un valore valido",
        });
        break;
      }
      case "relation": {
        schema = field.multiple
          ? z.array(z.union([z.number(), z.string()])).min(1, "Seleziona almeno un valore")
          : z.union([z.number(), z.string()]);
        break;
      }
      default: {
        schema = z.string();
      }
    }

    if (!field.required) {
      schema = schema.optional();
    }

    shape[field.name] = schema;
  });

  return z.object(shape);
}
