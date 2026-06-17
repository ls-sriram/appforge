import { createTamagui, createFont, createTokens } from '@tamagui/core'
import { animations } from '@tamagui/config/v4'

// ── Color tokens ──────────────────────────────────────────────────────────────
// Single source of truth registered as Tamagui tokens so styled() components
// can reference them via '$name'. Derived from AppForge brand palette.
const color = {
  // Brand
  primary:      '#2558D4',
  primaryMuted: 'rgba(37,88,212,0.15)',
  primaryGlow:  'rgba(37,88,212,0.25)',

  // Semantic status
  success:      '#237A49',
  successMuted: 'rgba(35,122,73,0.12)',
  warning:      '#A8681A',
  warningMuted: 'rgba(168,104,26,0.12)',
  error:        '#C03228',
  errorMuted:   'rgba(192,50,40,0.12)',
  info:         '#0E7490',
  infoMuted:    'rgba(14,116,144,0.12)',
  accent:       '#1D4ED8',
  accentMuted:  'rgba(29,78,216,0.12)',

  // Surfaces
  bg:            '#FAFAFA',
  surface:       '#FFFFFF',
  surfaceAlt:    '#F5F5F5',
  surfaceStrong: '#FFFFFF',
  surfaceMuted:  '#F5F5F5',
  surfaceWash:   '#F4F4F0',

  // Borders
  border:        '#E5E5E5',
  borderSubtle:  '#E5E5E5',
  borderFocus:   '#2558D4',
  borderLight:   '#D4D4D4',

  // Text
  textPrimary:   '#171717',
  textSecondary: '#525252',
  textMuted:     '#A3A3A3',
  textTertiary:  '#737373',
  textInverse:   '#FFFFFF',

  // Chip / segment control
  chipBg:     'rgba(0,0,0,0.04)',
  chipBorder: 'rgba(0,0,0,0.08)',

  white:       '#FFFFFF',
  transparent: 'transparent',
} as const

const tokens = createTokens({
  color,
  // Space scale: xxs=4 xs=6 sm=10 md=16 lg=22 xl=30 2xl=44 3xl=64
  space: {
    true: 16,
    0: 0, 1: 4, 2: 6, 3: 10, 4: 16, 5: 22, 6: 30, 7: 44, 8: 64,
  },
  size: {
    true: 16,
    0: 0, 1: 4, 2: 6, 3: 10, 4: 16, 5: 22, 6: 30, 7: 44, 8: 64,
  },
  // Radius scale (× 1.45 from base): sm=9 md=15 lg=20 xl=29 pill=9999
  radius: {
    true: 15,
    0: 0, 1: 9, 2: 15, 3: 20, 4: 29, 5: 9999,
  },
  zIndex: {
    0: 0, 1: 10, 2: 20, 3: 100,
  },
})

// ── Fonts ─────────────────────────────────────────────────────────────────────
// System font, two weights. size/lineHeight scales align with Display/Heading/
// Label/Body atoms in Text.tsx — keep both in sync when adding a size.
function makeFont(weight: string) {
  return createFont({
    family: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, sans-serif",
    size: {
      1: 11, // xs  — caption
      2: 13, // sm  — Label, displaySm
      3: 15, // md  — Body
      4: 18, // lg
      5: 24, // xl  — Heading
      6: 26, // page title
      7: 32, // 2xl — Display
      8: 42, // 3xl
    },
    lineHeight: {
      1: 16,  // xs
      2: 20,  // sm
      3: 22,  // md  — Body
      4: 26,  // lg
      5: 30,  // xl  — Heading
      6: 32,
      7: 40,  // 2xl — Display
      8: 52,
    },
    weight: { 1: weight },
    letterSpacing: { 1: 0 },
  })
}

// ── Theme ─────────────────────────────────────────────────────────────────────
const lightTheme = {
  background:         tokens.color.bg,
  backgroundStrong:   tokens.color.surfaceStrong,
  color:              tokens.color.textPrimary,
  colorSoft:          tokens.color.textSecondary,
  colorFaint:         tokens.color.textMuted,
  colorTertiary:      tokens.color.textTertiary,
  colorInverse:       tokens.color.textInverse,
  accent:             tokens.color.primary,
  accentMuted:        tokens.color.primaryMuted,
  borderColor:        tokens.color.border,
  borderSubtle:       tokens.color.borderSubtle,
  borderFocus:        tokens.color.borderFocus,
}

// ── Config ────────────────────────────────────────────────────────────────────
export const config = createTamagui({
  animations,
  tokens,
  themes: { light: lightTheme },
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
  } as const,
  media: {},
  settings: {
    defaultFont: 'reg',
    styleCompat: 'legacy',
  },
})

export type AppConfig = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
