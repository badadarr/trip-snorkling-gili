/**
 * Standard Currency & Number Formatters for Gili Snorkeling Application
 */

export type CurrencyCode = 'IDR' | 'USD' | 'EUR';

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ['IDR', 'USD', 'EUR'];

/** Fallback conversion rates (IDR per 1 unit) used only when a package has no explicit price */
export const DEFAULT_USD_RATE = 15500;
export const DEFAULT_EUR_RATE = 17500;

/**
 * Format IDR currency with clean dot separator (e.g. 150000 -> "Rp 150.000")
 */
export function formatIdr(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rp 0';
  }
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}

/**
 * Format USD currency with standard dollar symbol (e.g. 10 -> "$10 USD", 44.3 -> "$44.30 USD")
 */
export function formatUsd(amount?: number | null, withSuffix: boolean = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0';
  }
  const formatted = Number.isInteger(amount)
    ? `$${amount.toLocaleString('en-US')}`
    : `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return withSuffix ? `${formatted} USD` : formatted;
}

/**
 * Format EUR currency with standard euro symbol (e.g. 10 -> "€10 EUR", 41.5 -> "€41.50 EUR")
 */
export function formatEur(amount?: number | null, withSuffix: boolean = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '€0';
  }
  const formatted = Number.isInteger(amount)
    ? `€${amount.toLocaleString('en-US')}`
    : `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return withSuffix ? `${formatted} EUR` : formatted;
}

/**
 * Format general currency based on currency code
 */
export function formatPrice(
  amount: number,
  currency: CurrencyCode = 'IDR',
  withSuffix: boolean = true,
): string {
  if (currency === 'USD') return formatUsd(amount, withSuffix);
  if (currency === 'EUR') return formatEur(amount, withSuffix);
  return formatIdr(amount);
}

/**
 * Resolve the amount to show for a given currency from a package/booking price set.
 * Falls back to converting the IDR amount when a foreign price has not been set by admin.
 */
export function resolveAmount(
  prices: { idr?: number | null; usd?: number | null; eur?: number | null },
  currency: CurrencyCode,
  rates?: { usd?: number; eur?: number },
): number {
  const idr = prices.idr || 0;
  if (currency === 'IDR') return idr;
  if (currency === 'USD') {
    if (prices.usd && prices.usd > 0) return prices.usd;
    return Number((idr / (rates?.usd || DEFAULT_USD_RATE)).toFixed(2));
  }
  if (prices.eur && prices.eur > 0) return prices.eur;
  return Number((idr / (rates?.eur || DEFAULT_EUR_RATE)).toFixed(2));
}
