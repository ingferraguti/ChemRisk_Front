"use client";

import { Controller, type Control } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldConfig, FieldOption } from "../types";

export function FieldRenderer({
  field,
  control,
}: {
  field: FieldConfig;
  control: Control<Record<string, unknown>>;
}) {
  const { data: loadedOptions = [] } = useQuery({
    queryKey: ["field-options", field.name],
    queryFn: field.loadOptions,
    enabled: Boolean(field.loadOptions),
  });

  const options = field.options ?? loadedOptions;

  const renderInput = (value: unknown, onChange: (val: unknown) => void) => {
    switch (field.type) {
      case "number":
        return (
          <Input
            type="number"
            value={value as number | string | undefined}
            onChange={(event) => onChange(event.target.value)}
            placeholder={field.placeholder}
          />
        );
      case "boolean":
        return (
          <div className="flex items-center gap-2">
            <Checkbox checked={Boolean(value)} onCheckedChange={(checked) => onChange(Boolean(checked))} />
            <span className="text-sm text-muted-foreground">{field.label}</span>
          </div>
        );
      case "date":
        return (
          <Input
            type="date"
            value={value as string | undefined}
            onChange={(event) => onChange(event.target.value)}
          />
        );
      case "enum":
      case "relation":
        if (field.multiple) {
          return (
            <div className="space-y-2">
              {options.map((option) => (
                <label key={String(option.value)} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const current = Array.isArray(value) ? value : [];
                      if (checked) {
                        onChange([...current, option.value]);
                      } else {
                        onChange(current.filter((item: FieldOption["value"]) => item !== option.value));
                      }
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          );
        }
        return (
          <Select
            value={value ? String(value) : ""}
            onValueChange={(selected) => onChange(selected)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder ?? "Seleziona"} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        if (field.multiline) {
          return (
            <Textarea
              value={value as string | undefined}
              onChange={(event) => onChange(event.target.value)}
              placeholder={field.placeholder}
            />
          );
        }
        return (
          <Input
            value={value as string | undefined}
            onChange={(event) => onChange(event.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: rhfField }) => (
        <div className="space-y-1">
          {field.type !== "boolean" && (
            <label className="text-sm font-medium">{field.label}</label>
          )}
          {renderInput(rhfField.value, rhfField.onChange)}
          {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
        </div>
      )}
    />
  );
}
