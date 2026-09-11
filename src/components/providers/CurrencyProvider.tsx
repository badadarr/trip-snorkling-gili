"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  CurrencyCode,
  DEFAULT_EUR_RATE,
  DEFAULT_USD_RATE,
  formatPrice,
  resolveAmount,
} from "@/lib/format";

const STORAGE_KEY = "gili_display_currency_v1";

export interface CurrencyOption {
  code: CurrencyCode;
  label: string;
  short: string;
  symbol: string;
  flag: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", label: "US Dollar", short: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", label: "Euro", short: "EUR", symbol: "€", flag: "🇪🇺" },
  { code: "IDR", label: "Indonesian Rupiah", short: "IDR", symbol: "Rp", flag: "🇮🇩" },
];

export interface PriceSet {
  idr?: number | null;
  usd?: number | null;
  eur?: number | null;
}

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  rates: { usd: number; eur: number };
  /** Numeric amount in the currently selected currency */
  amount: (prices: PriceSet) => number;
  /** Formatted amount in the currently selected currency (e.g. "€41.50 EUR") */
  format: (prices: PriceSet, withSuffix?: boolean) => string;
  /** Formatted IDR reference line, or null when IDR is already the selected currency */
  secondary: (prices: PriceSet) => string | null;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/**
 * The visitor's choice lives in localStorage, which the server cannot read, so it
 * is exposed as an external store: the first client render matches the server
 * (no preference), then React re-renders with the stored value.
 */
const storeListeners = new Set<() => void>();

function subscribeToStoredCurrency(onChange: () => void) {
  storeListeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    storeListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getStoredCurrency(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Could not read currency preference:", e);
    return null;
  }
}

function getServerCurrency(): string | null {
  return null;
}

function isCurrencyCode(value: string | null): value is CurrencyCode {
  return value === "IDR" || value === "USD" || value === "EUR";
}

export default function CurrencyProvider({
  children,
  usdRate,
  eurRate,
  defaultCurrency = "USD",
}: {
  children: React.ReactNode;
  usdRate?: number;
  eurRate?: number;
  defaultCurrency?: CurrencyCode;
}) {
  const stored = useSyncExternalStore(
    subscribeToStoredCurrency,
    getStoredCurrency,
    getServerCurrency,
  );
  const currency: CurrencyCode = isCurrencyCode(stored)
    ? stored
    : defaultCurrency;

  const setCurrency = useCallback((code: CurrencyCode) => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {
      console.warn("Could not persist currency preference:", e);
    }
    storeListeners.forEach((listener) => listener());
  }, []);

  const rates = useMemo(
    () => ({
      usd: usdRate && usdRate > 0 ? usdRate : DEFAULT_USD_RATE,
      eur: eurRate && eurRate > 0 ? eurRate : DEFAULT_EUR_RATE,
    }),
    [usdRate, eurRate],
  );

  const value = useMemo<CurrencyContextValue>(() => {
    const amount = (prices: PriceSet) => resolveAmount(prices, currency, rates);
    return {
      currency,
      setCurrency,
      rates,
      amount,
      format: (prices, withSuffix = true) =>
        formatPrice(amount(prices), currency, withSuffix),
      secondary: (prices) =>
        currency === "IDR" ? null : formatPrice(prices.idr || 0, "IDR"),
    };
  }, [currency, rates, setCurrency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

/**
 * Read the visitor's display currency. Falls back to a USD-only context so that
 * components stay usable outside the public layout (e.g. admin previews).
 */
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (ctx) return ctx;

  const rates = { usd: DEFAULT_USD_RATE, eur: DEFAULT_EUR_RATE };
  const amount = (prices: PriceSet) => resolveAmount(prices, "USD", rates);
  return {
    currency: "USD",
    setCurrency: () => {},
    rates,
    amount,
    format: (prices, withSuffix = true) =>
      formatPrice(amount(prices), "USD", withSuffix),
    secondary: (prices) => formatPrice(prices.idr || 0, "IDR"),
  };
}
