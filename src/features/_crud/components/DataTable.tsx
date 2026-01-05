"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ColumnConfig } from "../types";

export function DataTable<TItem>({
  columns,
  data,
  onRowClick,
}: {
  columns: ColumnConfig<TItem>[];
  data: TItem[];
  onRowClick?: (item: TItem) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.key)}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow
            key={index}
            className={onRowClick ? "cursor-pointer" : undefined}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((column) => (
              <TableCell key={String(column.key)}>
                {column.render ? column.render(item) : String((item as Record<string, unknown>)[String(column.key)])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
