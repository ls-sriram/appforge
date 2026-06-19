export function formatCurrencyWholeDollars(value: number | undefined, fallback = "Unknown"): string {
  if (value == null) return fallback;
  return `$${value.toFixed(0)}`;
}
