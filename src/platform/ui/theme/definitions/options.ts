export interface BrandColors {
  primary: string;
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
