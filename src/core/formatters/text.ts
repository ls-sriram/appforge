export function formatDisplayName(primary: string | undefined, fallback: string, separator = " — "): string {
  if (!primary) return fallback;
  return `${primary}${separator}${fallback}`;
}

export function formatFallback(value: string | undefined, fallback = "Unknown"): string {
  if (!value) return fallback;
  return value;
}
