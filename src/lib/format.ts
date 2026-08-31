/**
 * Standard Currency & Number Formatters for Gili Snorkeling Application
 */

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
 * Format general currency based on currency code
 */
export function formatPrice(amount: number, currency: 'IDR' | 'USD' = 'IDR'): string {
  if (currency === 'USD') {
    return formatUsd(amount);
  }
  return formatIdr(amount);
}
