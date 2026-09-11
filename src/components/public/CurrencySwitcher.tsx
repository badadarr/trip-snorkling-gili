"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Wallet } from "lucide-react";
import {
  CURRENCY_OPTIONS,
  useCurrency,
} from "@/components/providers/CurrencyProvider";

export default function CurrencySwitcher({
  variant = "default",
}: {
  variant?: "default" | "block";
}) {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current =
    CURRENCY_OPTIONS.find((c) => c.code === currency) || CURRENCY_OPTIONS[0];

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        display: variant === "block" ? "block" : "inline-block",
        width: variant === "block" ? "100%" : undefined,
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: variant === "block" ? "space-between" : undefined,
          width: variant === "block" ? "100%" : undefined,
          gap: "6px",
          background: isOpen ? "#ffffff" : "var(--primary-surface)",
          border: isOpen
            ? "1.5px solid var(--primary-ocean)"
            : "1px solid rgba(0, 119, 182, 0.25)",
          borderRadius: "9999px",
          padding: "6px 12px 6px 10px",
          fontSize: "0.82rem",
          fontWeight: 700,
          color: "var(--primary-deep)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isOpen
            ? "0 4px 14px rgba(0, 119, 182, 0.15)"
            : "0 1px 3px rgba(0, 50, 100, 0.05)",
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Select Currency"
      >
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Wallet size={14} color="var(--primary-ocean)" />
          <span style={{ letterSpacing: "0.02em" }}>{current.short}</span>
        </span>

        <ChevronDown
          size={14}
          style={{
            color: "var(--primary-ocean)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: variant === "block" ? undefined : 0,
            left: variant === "block" ? 0 : undefined,
            minWidth: "210px",
            background: "#ffffff",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 10px 30px rgba(10, 37, 64, 0.16)",
            border: "1px solid rgba(0, 119, 182, 0.18)",
            padding: "6px",
            zIndex: 1000,
            animation: "dropdownFadeIn 0.15s ease-out",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              padding: "6px 10px 4px 10px",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Select Currency</span>
            <Wallet size={12} />
          </div>

          {CURRENCY_OPTIONS.map((option) => {
            const isSelected = option.code === currency;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  setCurrency(option.code);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "none",
                  background: isSelected
                    ? "rgba(0, 119, 182, 0.08)"
                    : "transparent",
                  color: isSelected
                    ? "var(--primary-ocean)"
                    : "var(--primary-deep)",
                  fontSize: "0.84rem",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>{option.flag}</span>
                  <span>{option.label}</span>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                    }}
                  >
                    {option.symbol}
                  </span>
                  {isSelected && (
                    <Check
                      size={14}
                      color="var(--primary-ocean)"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
