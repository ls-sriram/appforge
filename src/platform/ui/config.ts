import { createTamagui, createFont, createTokens } from '@tamagui/core'
import { createAnimations } from '@tamagui/animations-react-native'

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

  // Brand blue — two tones for light/dark
  blue:          '#2558D4',   // light mode
  blueBright:    '#4F8EF7',   // dark mode (more legible on near-black)
  blueMuted:     'rgba(37,88,212,0.14)',
  blueBrightMuted: 'rgba(79,142,247,0.14)',

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
  },
  size: {
    true: 16,
    0: 0, 1: 4, 2: 6, 3: 10, 4: 16, 5: 22, 6: 30, 7: 44, 8: 64,
  },
  radius: {
    true: 15,
    0: 0, 1: 9, 2: 15, 3: 20, 4: 29, 5: 9999,
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
  // Surfaces
  bg:            tokens.color.offWhite,
  surface:       tokens.color.white,
  surfaceStrong: tokens.color.white,
  surfaceAlt:    tokens.color.surfaceLight,
  surfaceMuted:  tokens.color.surfaceLight,

  // Borders
  border:        tokens.color.borderLight,
  borderSubtle:  tokens.color.borderLightSub,
  borderFocus:   tokens.color.borderLightFoc,

  // Text
  textPrimary:   tokens.color.nearBlack,
  textSecondary: tokens.color.charcoal,
  textMuted:     tokens.color.stone,
  textTertiary:  tokens.color.slate,
  textInverse:   tokens.color.white,

  // Semantic
  colorFaint:    tokens.color.stone,
  colorSoft:     tokens.color.charcoal,
  colorTertiary: tokens.color.slate,
  colorInverse:  tokens.color.white,

  // Brand
  primary:       tokens.color.blue,
  primaryMuted:  tokens.color.blueMuted,
  accent:        tokens.color.blue,
  accentMuted:   tokens.color.blueMuted,

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
  bg:            color.offWhite,
  surface:       color.white,
  surfaceStrong: color.white,
  surfaceAlt:    color.surfaceLight,
  surfaceMuted:  color.surfaceLight,
  border:        color.borderLight,
  borderSubtle:  color.borderLightSub,
  borderFocus:   color.borderLightFoc,
  textPrimary:   color.nearBlack,
  textSecondary: color.charcoal,
  textMuted:     color.stone,
  textTertiary:  color.slate,
  textInverse:   color.white,
  primary:       color.blue,
  primaryMuted:  color.blueMuted,
  accent:        color.blue,
  accentMuted:   color.blueMuted,
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
export const config = createTamagui({
  animations,
  tokens,
  themes: { dark: darkTheme, light: lightTheme },
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
})

export type AppConfig = typeof config

export default config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
