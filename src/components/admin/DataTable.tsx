"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/admin/DataTablePagination";
import { DataTableViewOptions } from "@/components/admin/DataTableViewOptions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  searchPlaceholder?: string;
  searchColumnId?: string; // If specific column search
  globalFilterValue?: string;
  onGlobalFilterChange?: (value: string) => void;
  enableSearch?: boolean;
  columnLabels?: Record<string, string>;
  emptyMessage?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  searchPlaceholder = "Cari data...",
  searchColumnId,
  globalFilterValue,
  onGlobalFilterChange,
  enableSearch = true,
  columnLabels,
  emptyMessage = "Tidak ada data yang ditemukan.",
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 50],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState("");

  const activeGlobalFilter =
    globalFilterValue !== undefined ? globalFilterValue : internalGlobalFilter;
  const handleGlobalFilterChange =
    onGlobalFilterChange || setInternalGlobalFilter;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter: activeGlobalFilter,
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: handleGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Table Toolbar if enableSearch or View Options */}
      {enableSearch && !globalFilterValue && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ position: "relative", width: "100%", maxWidth: "360px" }}
          >
            <Search
              size={17}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={
                searchColumnId
                  ? ((table
                      .getColumn(searchColumnId)
                      ?.getFilterValue() as string) ?? "")
                  : internalGlobalFilter
              }
              onChange={(event) => {
                if (searchColumnId) {
                  table
                    .getColumn(searchColumnId)
                    ?.setFilterValue(event.target.value);
                } else {
                  setInternalGlobalFilter(event.target.value);
                }
              }}
              style={{
                width: "100%",
                height: "42px",
                paddingLeft: "42px",
                paddingRight: "14px",
                fontSize: "0.88rem",
                backgroundColor: "#ffffff",
                border: "1.5px solid var(--border-light)",
                borderRadius: "10px",
                outline: "none",
                color: "var(--text-main)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary-ocean)";
                e.target.style.boxShadow = "0 0 0 3px rgba(0, 119, 182, 0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-light)";
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)";
              }}
            />
          </div>
          <DataTableViewOptions table={table} columnLabels={columnLabels} />
        </div>
      )}

      {/* Main Table Container */}
      <div
        style={{
          borderRadius: "14px",
          border: "1.5px solid var(--border-light)",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 50, 100, 0.04)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex items-center justify-center gap-2.5 text-[#0077b6]">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center text-slate-500 text-sm"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination bar */}
        {!loading && (
          <DataTablePagination
            table={table}
            pageSizeOptions={pageSizeOptions}
          />
        )}
      </div>
    </div>
  );
}
