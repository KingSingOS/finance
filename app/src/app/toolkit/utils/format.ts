/** Toolkit-wide formatting helpers */

/**
 * Format a number as KES currency.
 * compact=true: KES 1.2M / KES 800K for large numbers
 */
export function formatKES(amount: number, compact = false): string {
  if (compact) {
    const abs = Math.abs(amount)
    if (abs >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`
  }
  return `KES ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

/** Format a percentage value: 12.5 → "12.5%" */
export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/** Format a number with thousands separators: 1234567 → "1,234,567" */
export function fmtNum(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
