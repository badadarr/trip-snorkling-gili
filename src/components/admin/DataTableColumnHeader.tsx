import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  style,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#475569",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          whiteSpace: "nowrap",
          ...style,
        }}
        className={className}
      >
        {title}
      </div>
    );
  }

  return (
    <div
      style={{ display: "inline-flex", alignItems: "center", ...style }}
      className={className}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "transparent",
              border: "none",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e2e8f0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown size={14} color="#0077b6" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp size={14} color="#0077b6" />
            ) : (
              <ChevronsUpDown size={14} color="#94a3b8" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" style={{ minWidth: "160px" }}>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(false)}
            style={{ cursor: "pointer", fontSize: "0.82rem" }}
          >
            <ArrowUp
              size={14}
              style={{ marginRight: "8px", color: "#64748b" }}
            />
            Urutkan Naik (Asc)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(true)}
            style={{ cursor: "pointer", fontSize: "0.82rem" }}
          >
            <ArrowDown
              size={14}
              style={{ marginRight: "8px", color: "#64748b" }}
            />
            Urutkan Turun (Desc)
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => column.toggleVisibility(false)}
                style={{ cursor: "pointer", fontSize: "0.82rem" }}
              >
                <EyeOff
                  size={14}
                  style={{ marginRight: "8px", color: "#64748b" }}
                />
                Sembunyikan Kolom
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
