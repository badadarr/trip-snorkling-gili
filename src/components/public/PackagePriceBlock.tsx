"use client";

import React from "react";
import { useCurrency } from "@/components/providers/CurrencyProvider";

interface PackagePriceBlockProps {
  priceIdr: number;
  priceUsd?: number | null;
  priceEur?: number | null;
  unitLabel: string;
  approxLabel?: string;
  marginBottom?: string;
}

export default function PackagePriceBlock({
  priceIdr,
  priceUsd,
  priceEur,
  unitLabel,
  approxLabel = "approx.",
  marginBottom = "24px",
}: PackagePriceBlockProps) {
  const { format, secondary } = useCurrency();
  const prices = { idr: priceIdr, usd: priceUsd, eur: priceEur };
  const approx = secondary(prices);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            color: "var(--primary-deep)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {format(prices)}
        </span>
        <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
          {unitLabel}
        </span>
      </div>

      <div
        style={{
          fontSize: "1rem",
          color: "var(--text-muted)",
          marginBottom,
          minHeight: approx ? undefined : "0",
        }}
      >
        {approx ? `${approxLabel} ${approx}` : null}
      </div>
    </>
  );
}
