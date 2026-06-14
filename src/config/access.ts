const ADMIN_EMAILS = (process.env.EXPO_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((value: string) => value.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export function hasAdminAllowlist(): boolean {
  return ADMIN_EMAILS.length > 0;
}
