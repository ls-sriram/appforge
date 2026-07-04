export interface BrandColors {
  primary: string;
  /** Secondary brand color; defaults to primary when omitted. */
  accent?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
}

export interface ThemeOptions {
  brand: BrandColors;
  dark?: boolean;
  fontFamily?: string;
  radiusScale?: number;
}
