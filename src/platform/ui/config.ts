import { createTamagui, createFont, createTokens } from '@tamagui/core'
import { createAnimations } from '@tamagui/animations-react-native'
import type { Theme as PlatformTheme } from './theme'

const animations = createAnimations({
  fast:   { type: 'spring', damping: 20, mass: 1.2, stiffness: 250 },
  medium: { type: 'spring', damping: 10, mass: 0.9, stiffness: 100 },
  slow:   { type: 'spring', damping: 20, mass: 1.2, stiffness: 50 },
})

// ── Color tokens ──────────────────────────────────────────────────────────────
// Raw palette — light and dark values live here so both themes can reference
// them. Theme objects below map these to semantic roles.
export const color = {
  // Dark palette
  ink:           '#0A0A0A',
  inkLift:       '#111111',
  inkCard:       '#161616',
  inkMuted:      '#1C1C1C',
  inkSubtle:     '#222222',

  // Light text on dark
  snowBright:    '#F2F2F2',
  snowDim:       '#A3A3A3',
  snowFaint:     '#525252',
  snowTertiary:  '#404040',

  // Light palette
  offWhite:      '#FAFAFA',
  white:         '#FFFFFF',
  surfaceLight:  '#F5F5F5',

  // Dark text on light
  nearBlack:     '#171717',
  charcoal:      '#525252',
  stone:         '#A3A3A3',
  slate:         '#737373',

  // Warm cream palette (visualizer light theme)
  cream:         '#F4EFE6',   // canvas bg
  creamPanel:    '#F9F5EF',   // panel bg
  creamStrong:   '#EDE9E1',   // strong surface
  creamBorder:   '#D9D4CB',   // warm border
  creamBorderSub:'#E5E0D7',   // subtle warm border
  warmDark:      '#1C1814',   // primary text
  warmMid:       '#6B6560',   // secondary text
  warmFaint:     '#9E9890',   // muted text
  warmFaintest:  '#B5B0A8',   // tertiary text

  // Brand blue — two tones for light/dark
  blue:          '#2558D4',   // light mode
  blueBright:    '#4F8EF7',   // dark mode (more legible on near-black)
  blueMuted:     'rgba(37,88,212,0.14)',
  blueBrightMuted: 'rgba(79,142,247,0.14)',

  // Indigo — visualizer selection / primary action
  indigo:        '#6366F1',
  indigoMuted:   'rgba(99,102,241,0.12)',

  // Status
  greenBright:   '#34D399',
  greenMuted:    'rgba(52,211,153,0.12)',
  green:         '#237A49',
  greenDark:     'rgba(35,122,73,0.12)',

  amberBright:   '#F59E0B',
  amberMuted:    'rgba(245,158,11,0.12)',
  amber:         '#A8681A',
  amberDark:     'rgba(168,104,26,0.12)',

  redBright:     '#F87171',
  redMuted:      'rgba(248,113,113,0.12)',
  red:           '#C03228',
  redDark:       'rgba(192,50,40,0.12)',

  teal:          '#0E7490',
  tealMuted:     'rgba(14,116,144,0.12)',
  tealBright:    '#22D3EE',
  tealBrightMuted: 'rgba(34,211,238,0.12)',

  // Borders (dark)
  borderDark:    'rgba(255,255,255,0.08)',
  borderDarkSub: 'rgba(255,255,255,0.05)',
  borderDarkFoc: '#4F8EF7',

  // Borders (light)
  borderLight:   '#E5E5E5',
  borderLightSub:'#E5E5E5',
  borderLightFoc:'#2558D4',

  // Chip (dark)
  chipDarkBg:    'rgba(255,255,255,0.05)',
  chipDarkBdr:   'rgba(255,255,255,0.10)',

  // Chip (light)
  chipLightBg:   'rgba(0,0,0,0.04)',
  chipLightBdr:  'rgba(0,0,0,0.08)',

  transparent:   'transparent',
} as const

const tokens = createTokens({
  color,
  // Space scale: 1=4 2=6 3=10 4=16 5=22 6=30 7=44 8=64
  space: {
    true: 16,
    0: 0, 1: 4, 2: 6, 3: 10, 4: 16, 5: 22, 6: 30, 7: 44, 8: 64,
    xxs: 4, xs: 6, sm: 10, md: 16, lg: 22, xl: 30, '2xl': 44, '3xl': 64,
  },
  size: {
    true: 16,
    0: 0, 1: 4, 2: 6, 3: 10, 4: 16, 5: 22, 6: 30, 7: 44, 8: 64,
    xxs: 4, xs: 6, sm: 10, md: 16, lg: 22, xl: 30, '2xl': 44, '3xl': 64,
  },
  radius: {
    true: 15,
    0: 0, 1: 9, 2: 15, 3: 20, 4: 29, 5: 9999,
    none: 0, sm: 9, md: 15, lg: 20, xl: 29, pill: 9999,
  },
  zIndex: {
    0: 0, 1: 10, 2: 20, 3: 100,
  },
})

// ── Fonts ─────────────────────────────────────────────────────────────────────
function makeFont(weight: string) {
  return createFont({
    family: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, sans-serif",
    size: {
      1: 11, 2: 13, 3: 15, 4: 18, 5: 24, 6: 26, 7: 32, 8: 42,
    },
    lineHeight: {
      1: 16, 2: 20, 3: 22, 4: 26, 5: 30, 6: 32, 7: 40, 8: 52,
    },
    weight: { 1: weight },
    letterSpacing: { 1: 0 },
  })
}

// ── Themes ────────────────────────────────────────────────────────────────────
// Keys listed here are THEME VARIABLES — they override same-named color tokens
// when the theme is active. Primitives reference these via '$key'.

const darkTheme = {
  // Surfaces
  bg:            tokens.color.ink,
  surface:       tokens.color.inkLift,
  surfaceStrong: tokens.color.inkCard,
  surfaceAlt:    tokens.color.inkMuted,
  surfaceMuted:  tokens.color.inkLift,

  // Borders
  border:        tokens.color.borderDark,
  borderSubtle:  tokens.color.borderDarkSub,
  borderFocus:   tokens.color.borderDarkFoc,

  // Text
  textPrimary:   tokens.color.snowBright,
  textSecondary: tokens.color.snowDim,
  textMuted:     tokens.color.snowFaint,
  textTertiary:  tokens.color.snowTertiary,
  textInverse:   tokens.color.ink,

  // Semantic (for dim/soft/tertiary/onDark variants in Text atoms)
  colorFaint:    tokens.color.snowFaint,
  colorSoft:     tokens.color.snowDim,
  colorTertiary: tokens.color.snowTertiary,
  colorInverse:  tokens.color.snowBright,

  // Brand
  primary:       tokens.color.blueBright,
  primaryMuted:  tokens.color.blueBrightMuted,
  accent:        tokens.color.blueBright,
  accentMuted:   tokens.color.blueBrightMuted,

  // Status
  success:       tokens.color.greenBright,
  successMuted:  tokens.color.greenMuted,
  warning:       tokens.color.amberBright,
  warningMuted:  tokens.color.amberMuted,
  error:         tokens.color.redBright,
  errorMuted:    tokens.color.redMuted,
  info:          tokens.color.tealBright,
  infoMuted:     tokens.color.tealBrightMuted,

  // Chip controls
  chipBg:        tokens.color.chipDarkBg,
  chipBorder:    tokens.color.chipDarkBdr,

  // Overlay / modal scrim
  scrim:         'rgba(5,10,18,0.64)',
}

const lightTheme = {
  // Surfaces — warm cream
  bg:            tokens.color.cream,
  surface:       tokens.color.white,
  surfaceStrong: tokens.color.creamStrong,
  surfaceAlt:    tokens.color.creamPanel,
  surfaceMuted:  tokens.color.creamPanel,

  // Borders — warm
  border:        tokens.color.creamBorder,
  borderSubtle:  tokens.color.creamBorderSub,
  borderFocus:   tokens.color.indigo,

  // Text — warm dark
  textPrimary:   tokens.color.warmDark,
  textSecondary: tokens.color.warmMid,
  textMuted:     tokens.color.warmFaint,
  textTertiary:  tokens.color.warmFaintest,
  textInverse:   tokens.color.white,

  // Semantic
  colorFaint:    tokens.color.warmFaint,
  colorSoft:     tokens.color.warmMid,
  colorTertiary: tokens.color.warmFaintest,
  colorInverse:  tokens.color.white,

  // Brand — indigo
  primary:       tokens.color.indigo,
  primaryMuted:  tokens.color.indigoMuted,
  accent:        tokens.color.indigo,
  accentMuted:   tokens.color.indigoMuted,

  // Status
  success:       tokens.color.green,
  successMuted:  tokens.color.greenDark,
  warning:       tokens.color.amber,
  warningMuted:  tokens.color.amberDark,
  error:         tokens.color.red,
  errorMuted:    tokens.color.redDark,
  info:          tokens.color.teal,
  infoMuted:     tokens.color.tealMuted,

  // Chip controls
  chipBg:        tokens.color.chipLightBg,
  chipBorder:    tokens.color.chipLightBdr,

  // Overlay / modal scrim
  scrim:         'rgba(5,10,18,0.64)',
}

// ── Resolved theme maps (plain hex strings, derived from color palette) ───────
// Use these wherever Tamagui token syntax ($token) can't be passed — e.g.
// React Native TextInput style props, CSS string injections.

export const resolvedDarkTheme: Record<string, string> = {
  bg:            color.ink,
  surface:       color.inkLift,
  surfaceStrong: color.inkCard,
  surfaceAlt:    color.inkMuted,
  surfaceMuted:  color.inkLift,
  border:        color.borderDark,
  borderSubtle:  color.borderDarkSub,
  borderFocus:   color.borderDarkFoc,
  textPrimary:   color.snowBright,
  textSecondary: color.snowDim,
  textMuted:     color.snowFaint,
  textTertiary:  color.snowTertiary,
  textInverse:   color.ink,
  primary:       color.blueBright,
  primaryMuted:  color.blueBrightMuted,
  accent:        color.blueBright,
  accentMuted:   color.blueBrightMuted,
  success:       color.greenBright,
  successMuted:  color.greenMuted,
  warning:       color.amberBright,
  warningMuted:  color.amberMuted,
  error:         color.redBright,
  errorMuted:    color.redMuted,
  info:          color.tealBright,
  infoMuted:     color.tealBrightMuted,
  chipBorder:    color.chipDarkBdr,
  scrim:         'rgba(5,10,18,0.64)',
}

export const resolvedLightTheme: Record<string, string> = {
  bg:            color.cream,
  surface:       color.white,
  surfaceStrong: color.creamStrong,
  surfaceAlt:    color.creamPanel,
  surfaceMuted:  color.creamPanel,
  border:        color.creamBorder,
  borderSubtle:  color.creamBorderSub,
  borderFocus:   color.indigo,
  textPrimary:   color.warmDark,
  textSecondary: color.warmMid,
  textMuted:     color.warmFaint,
  textTertiary:  color.warmFaintest,
  textInverse:   color.white,
  primary:       color.indigo,
  primaryMuted:  color.indigoMuted,
  accent:        color.indigo,
  accentMuted:   color.indigoMuted,
  success:       color.green,
  successMuted:  color.greenDark,
  warning:       color.amber,
  warningMuted:  color.amberDark,
  error:         color.red,
  errorMuted:    color.redDark,
  info:          color.teal,
  infoMuted:     color.tealMuted,
  chipBorder:    color.chipLightBdr,
  scrim:         'rgba(5,10,18,0.64)',
}

// ── Config ────────────────────────────────────────────────────────────────────
function hexToRgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function createRuntimeTheme(theme: PlatformTheme) {
  const p = theme.palette;
  return {
    bg:            p.background,
    surface:       p.surface,
    surfaceStrong: p.surface,
    surfaceAlt:    p.surfaceAlt,
    surfaceMuted:  p.surface,
    border:        p.border,
    borderSubtle:  p.border,
    borderFocus:   p.borderFocus,
    textPrimary:   p.textPrimary,
    textSecondary: p.textSecondary,
    textMuted:     p.textMuted,
    textInverse:   p.textInverse,
    colorFaint:    p.textMuted,
    colorSoft:     p.textSecondary,
    colorInverse:  p.textPrimary,
    primary:       p.primary,
    primaryMuted:  hexToRgba(p.primary, 0.14),
    accent:        p.primary,
    accentMuted:   hexToRgba(p.primary, 0.14),
    success:       p.success,
    successMuted:  hexToRgba(p.success, 0.12),
    warning:       p.warning,
    warningMuted:  hexToRgba(p.warning, 0.12),
    error:         p.error,
    errorMuted:    hexToRgba(p.error, 0.12),
    info:          p.info,
    infoMuted:     hexToRgba(p.info, 0.12),
    chipBg:        p.surfaceAlt,
    chipBorder:    p.border,
    scrim:         'rgba(5,10,18,0.64)',
  } as const
}

const baseConfig = {
  animations,
  tokens,
  fonts: {
    reg:  makeFont('500'),
    bold: makeFont('700'),
  },
  shorthands: {
    p:  'padding',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    pt: 'paddingTop',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    m:  'margin',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    mt: 'marginTop',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',
    bg: 'backgroundColor',
    br: 'borderRadius',
    f:  'flex',
    ai: 'alignItems',
    jc: 'justifyContent',
    fd: 'flexDirection',
    lh: 'lineHeight',
    ls: 'letterSpacing',
    ff: 'fontFamily',
    c:  'color',
    w:  'width',
    h:  'height',
    o:  'opacity',
    ta: 'textAlign',
    tt: 'textTransform',
  } as const,
  media: {},
  settings: {
    defaultFont: 'reg',
    styleCompat: 'legacy',
  },
} as const

export function createConfigForTheme(theme: PlatformTheme) {
  const runtimeTheme = createRuntimeTheme(theme)
  return createTamagui({
    ...baseConfig,
    themes: {
      dark: runtimeTheme,
      light: runtimeTheme,
    },
  })
}

export const config = createTamagui({
  ...baseConfig,
  themes: { dark: darkTheme, light: lightTheme },
})

export type AppConfig = typeof config

export default config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
