import * as React from "react";
import { cn } from "@/lib/utils";

function Table({ className, style, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      style={{
        position: "relative",
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <table
        data-slot="table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: "0.875rem",
          ...style,
        }}
        className={className}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  className,
  style,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      style={{
        backgroundColor: "#f8fafc",
        borderBottom: "1.5px solid #e2e8f0",
        userSelect: "none",
        ...style,
      }}
      className={className}
      {...props}
    />
  );
}

function TableBody({
  className,
  style,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      style={{
        backgroundColor: "#ffffff",
        ...style,
      }}
      className={className}
      {...props}
    />
  );
}

function TableFooter({
  className,
  style,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      style={{
        backgroundColor: "#f8fafc",
        borderTop: "1.5px solid #e2e8f0",
        fontWeight: 600,
        ...style,
      }}
      className={className}
      {...props}
    />
  );
}

function TableRow({ className, style, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      style={{
        borderBottom: "1px solid #f1f5f9",
        transition: "background-color 0.15s ease",
        ...style,
      }}
      className={cn("hover:bg-[#f8fafc]/90", className)}
      {...props}
    />
  );
}

function TableHead({ className, style, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      style={{
        padding: "16px 22px",
        verticalAlign: "middle",
        fontWeight: 700,
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#475569",
        whiteSpace: "nowrap",
        ...style,
      }}
      className={className}
      {...props}
    />
  );
}

function TableCell({ className, style, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      style={{
        padding: "16px 22px",
        verticalAlign: "middle",
        fontSize: "0.875rem",
        color: "#1e293b",
        ...style,
      }}
      className={className}
      {...props}
    />
  );
}

function TableCaption({
  className,
  style,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      style={{
        marginTop: "16px",
        fontSize: "0.875rem",
        color: "#64748b",
        ...style,
      }}
      className={className}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
