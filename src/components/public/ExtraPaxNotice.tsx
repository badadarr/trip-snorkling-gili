"use client";

import React from "react";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatIdr } from "@/lib/format";

/** Surcharge per guest above the standard private boat capacity */
const EXTRA_PAX_IDR = 200000;
const EXTRA_PAX_USD = 13;

export default function ExtraPaxNotice({ maxPax = 4 }: { maxPax?: number }) {
  const { currency, format, rates } = useCurrency();

  const prices = {
    idr: EXTRA_PAX_IDR,
    usd: EXTRA_PAX_USD,
    eur: Number((EXTRA_PAX_IDR / rates.eur).toFixed(2)),
  };
  const feeText = `${format(prices)}${
    currency === "IDR" ? "" : ` (~ ${formatIdr(EXTRA_PAX_IDR)})`
  }`;

  return (
    <div
      style={{
        padding: "8px 12px",
        background: "#fffbeb",
        borderRadius: "var(--radius-sm)",
        border: "1px solid #fde68a",
        fontSize: "0.78rem",
        color: "#b45309",
        marginBottom: "20px",
        lineHeight: 1.4,
      }}
    >
      Max. {maxPax} Pax included. Extra guests: +{feeText} / person.
    </div>
  );
}
