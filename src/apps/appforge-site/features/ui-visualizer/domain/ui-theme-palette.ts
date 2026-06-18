// Semantic color token groups, derived from config.ts dark/light themes.
// Used for swatch display in inspector and the Tokens palette tab.

export const COLOR_TOKEN_GROUPS: Array<{ label: string; tokens: string[] }> = [
  { label: 'Surfaces',  tokens: ['bg', 'surface', 'surfaceStrong', 'surfaceAlt'] },
  { label: 'Borders',   tokens: ['border', 'borderSubtle', 'borderFocus'] },
  { label: 'Brand',     tokens: ['primary', 'primaryMuted', 'accent'] },
  { label: 'Text',      tokens: ['textPrimary', 'textSecondary', 'textMuted', 'textInverse'] },
  { label: 'Status',    tokens: ['success', 'successMuted', 'warning', 'warningMuted', 'error', 'errorMuted', 'info', 'infoMuted'] },
];

// Resolved hex/rgba for dark theme — mirrors config.ts darkTheme + color palette.
export const DARK_THEME_RESOLVED: Record<string, string> = {
  bg:            '#0A0A0A',
  surface:       '#111111',
  surfaceStrong: '#161616',
  surfaceAlt:    '#1C1C1C',
  surfaceMuted:  '#111111',
  border:        'rgba(255,255,255,0.08)',
  borderSubtle:  'rgba(255,255,255,0.05)',
  borderFocus:   '#4F8EF7',
  primary:       '#4F8EF7',
  primaryMuted:  'rgba(79,142,247,0.14)',
  accent:        '#4F8EF7',
  accentMuted:   'rgba(79,142,247,0.14)',
  textPrimary:   '#F2F2F2',
  textSecondary: '#A3A3A3',
  textMuted:     '#525252',
  textTertiary:  '#404040',
  textInverse:   '#0A0A0A',
  success:       '#34D399',
  successMuted:  'rgba(52,211,153,0.12)',
  warning:       '#F59E0B',
  warningMuted:  'rgba(245,158,11,0.12)',
  error:         '#F87171',
  errorMuted:    'rgba(248,113,113,0.12)',
  info:          '#22D3EE',
  infoMuted:     'rgba(34,211,238,0.12)',
};

export const LIGHT_THEME_RESOLVED: Record<string, string> = {
  bg:            '#FAFAFA',
  surface:       '#FFFFFF',
  surfaceStrong: '#FFFFFF',
  surfaceAlt:    '#F5F5F5',
  surfaceMuted:  '#F5F5F5',
  border:        '#E5E5E5',
  borderSubtle:  '#E5E5E5',
  borderFocus:   '#2558D4',
  primary:       '#2558D4',
  primaryMuted:  'rgba(37,88,212,0.14)',
  accent:        '#2558D4',
  accentMuted:   'rgba(37,88,212,0.14)',
  textPrimary:   '#171717',
  textSecondary: '#525252',
  textMuted:     '#A3A3A3',
  textTertiary:  '#737373',
  textInverse:   '#FFFFFF',
  success:       '#237A49',
  successMuted:  'rgba(35,122,73,0.12)',
  warning:       '#A8681A',
  warningMuted:  'rgba(168,104,26,0.12)',
  error:         '#C03228',
  errorMuted:    'rgba(192,50,40,0.12)',
  info:          '#0E7490',
  infoMuted:     'rgba(14,116,144,0.12)',
};

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
