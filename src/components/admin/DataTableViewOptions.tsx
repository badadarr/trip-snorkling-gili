"use client";

import { Table } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  columnLabels?: Record<string, string>;
}

export function DataTableViewOptions<TData>({
  table,
  columnLabels = {},
}: DataTableViewOptionsProps<TData>) {
  const hideableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide(),
    );

  if (hideableColumns.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          style={{
            height: "42px",
            padding: "0 16px",
            borderRadius: "10px",
            border: "1.5px solid var(--border-light)",
            backgroundColor: "#ffffff",
            color: "var(--primary-deep)",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary-ocean)";
            e.currentTarget.style.backgroundColor = "#f8fafc";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-light)";
            e.currentTarget.style.backgroundColor = "#ffffff";
          }}
        >
          <SlidersHorizontal size={15} color="var(--primary-ocean)" />
          <span>Tampilan Kolom</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        style={{ width: "210px", padding: "6px" }}
      >
        <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => {
          const label = columnLabels[column.id] || column.id;
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              <span style={{ textTransform: "capitalize" }}>{label}</span>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
