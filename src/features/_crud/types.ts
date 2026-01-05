import { ReactNode } from "react";

export type FieldOption = {
  label: string;
  value: string | number | boolean;
};

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "enum"
  | "relation";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  min?: number;
  max?: number;
  multiline?: boolean;
  options?: FieldOption[];
  loadOptions?: () => Promise<FieldOption[]>;
  multiple?: boolean;
  placeholder?: string;
  description?: string;
  parse?: (value: unknown) => unknown;
  hideOnCreate?: boolean;
  hideOnEdit?: boolean;
};

export type ColumnConfig<TItem> = {
  key: keyof TItem | string;
  label: string;
  render?: (item: TItem) => ReactNode;
};

export type EntityConfig<TList, TItem, TCreate, TUpdate> = {
  key: string;
  label: string;
  routes: {
    base: string;
  };
  idField?: keyof TItem | string;
  list: {
    columns: ColumnConfig<TItem>[];
    enableSearch?: boolean;
    searchMode?: "client" | "server";
  };
  form: {
    fields: FieldConfig[];
  };
  api: {
    list: () => Promise<TList>;
    get: (id: number) => Promise<TItem>;
    create: (payload: TCreate) => Promise<TItem>;
    update: (id: number, payload: TUpdate) => Promise<TItem>;
    remove: (id: number) => Promise<boolean>;
  };
  serverSearch?: (query: string) => Promise<TList>;
  hideInSidebar?: boolean;
};
