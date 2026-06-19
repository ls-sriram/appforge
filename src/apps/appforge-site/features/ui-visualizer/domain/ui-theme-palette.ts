// Semantic color token groups, derived from config.ts dark/light themes.
// Used for swatch display in inspector and the Tokens palette tab.

import { resolvedDarkTheme, resolvedLightTheme } from '@ui/config';

export const COLOR_TOKEN_GROUPS: Array<{ label: string; tokens: string[] }> = [
  { label: 'Surfaces',  tokens: ['bg', 'surface', 'surfaceStrong', 'surfaceAlt'] },
  { label: 'Borders',   tokens: ['border', 'borderSubtle', 'borderFocus'] },
  { label: 'Brand',     tokens: ['primary', 'primaryMuted', 'accent'] },
  { label: 'Text',      tokens: ['textPrimary', 'textSecondary', 'textMuted', 'textInverse'] },
  { label: 'Status',    tokens: ['success', 'successMuted', 'warning', 'warningMuted', 'error', 'errorMuted', 'info', 'infoMuted'] },
];

// Derived from config.ts — no hardcoded values here.
export const DARK_THEME_RESOLVED: Record<string, string> = resolvedDarkTheme;
export const LIGHT_THEME_RESOLVED: Record<string, string> = resolvedLightTheme;

// Prop keys whose values are color tokens (get swatch treatment in inspector)
export const COLOR_PROP_KEYS = new Set(['bg', 'color', 'borderColor']);

export function resolveToken(
  token: string | undefined,
  overrides: Record<string, string> = {},
  base: Record<string, string> = DARK_THEME_RESOLVED,
): string | undefined {
  if (!token || !token.startsWith('$')) return undefined;
  const key = token.slice(1);
  return overrides[key] ?? base[key];
}
