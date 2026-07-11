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
  /** Display face for large headings; defaults to `fontFamily` when omitted. */
  displayFontFamily?: string;
  radiusScale?: number;
}
