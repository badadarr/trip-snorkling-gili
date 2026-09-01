import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 50],
}: DataTablePaginationProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const pageCount = table.getPageCount() === 0 ? 1 : table.getPageCount();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderTop: "1.5px solid var(--border-light)",
        backgroundColor: "#f8fafc",
        flexWrap: "wrap",
        gap: "16px",
        fontSize: "0.82rem",
        color: "var(--text-muted)",
      }}
    >
      <div>
        Menampilkan{" "}
        <strong style={{ color: "var(--primary-deep)", fontWeight: 700 }}>
          {startRow}
        </strong>{" "}
        -{" "}
        <strong style={{ color: "var(--primary-deep)", fontWeight: 700 }}>
          {endRow}
        </strong>{" "}
        dari{" "}
        <strong style={{ color: "var(--primary-deep)", fontWeight: 700 }}>
          {totalRows}
        </strong>{" "}
        data
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Baris per hal:</span>
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            style={{
              padding: "5px 10px",
              borderRadius: "6px",
              border: "1px solid var(--border-light)",
              background: "#ffffff",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--primary-deep)",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>Halaman</span>
          <strong style={{ color: "var(--primary-deep)", fontWeight: 700 }}>
            {pageIndex + 1}
          </strong>
          <span>dari</span>
          <strong style={{ color: "var(--primary-deep)", fontWeight: 700 }}>
            {pageCount}
          </strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              border: "1px solid var(--border-light)",
              background: table.getCanPreviousPage() ? "#ffffff" : "#f1f5f9",
              color: table.getCanPreviousPage()
                ? "var(--primary-deep)"
                : "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
            }}
            title="Halaman Pertama"
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              border: "1px solid var(--border-light)",
              background: table.getCanPreviousPage() ? "#ffffff" : "#f1f5f9",
              color: table.getCanPreviousPage()
                ? "var(--primary-deep)"
                : "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
            }}
            title="Halaman Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              border: "1px solid var(--border-light)",
              background: table.getCanNextPage() ? "#ffffff" : "#f1f5f9",
              color: table.getCanNextPage() ? "var(--primary-deep)" : "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
            }}
            title="Halaman Berikutnya"
          >
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              border: "1px solid var(--border-light)",
              background: table.getCanNextPage() ? "#ffffff" : "#f1f5f9",
              color: table.getCanNextPage() ? "var(--primary-deep)" : "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
            }}
            title="Halaman Terakhir"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
