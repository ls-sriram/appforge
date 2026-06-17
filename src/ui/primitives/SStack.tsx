import { styled, View } from '@tamagui/core'

// XStack / YStack defined locally — never import the full 'tamagui' package
// which pulls in @tamagui/popper → react-dom (not available in RN).
const XStack = styled(View, { flexDirection: 'row' })
const YStack = styled(View, { flexDirection: 'column' })

// ── Layout atoms ──────────────────────────────────────────────────────────────
// Generic, non-domain. Blocks compose these; higher levels never add styles.
//
// Variant naming avoids Tamagui/CSS prop collisions:
//   between = gap | inset = paddingHorizontal | fill = flex:1 / full-width
//   spread = justifyContent:space-between | centered = centered alignment

export const Screen = styled(View, {
  name: 'Screen',
  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  alignItems: 'center', justifyContent: 'center',
  variants: {
    tone: {
      page:    { backgroundColor: '$bg' },
      surface: { backgroundColor: '$surface' },
    },
  } as const,
})

// Vertical stack — default for most layout containers
export const Col = styled(YStack, {
  name: 'Col',
  variants: {
    fill:    { true: { flex: 1 } },
    expand:  { true: { width: '100%', alignSelf: 'stretch' } },
    fluid:   { true: { flex: 1, minWidth: 0 } },
    centered:{ true: { alignItems: 'center', justifyContent: 'center' } },
    between: {
      xxs: { gap: 4 },
      xs:  { gap: 6 },
      sm:  { gap: 10 },
      md:  { gap: 16 },
      lg:  { gap: 22 },
      xl:  { gap: 30 },
    },
    inset: {
      xs:  { paddingHorizontal: 6 },
      sm:  { paddingHorizontal: 10 },
      md:  { paddingHorizontal: 16 },
      lg:  { paddingHorizontal: 22 },
    },
    pad: {
      none: { padding: 0 },
      xxs:  { padding: 4 },
      xs:   { padding: 6 },
      sm:   { padding: 10 },
      md:   { padding: 16 },
      lg:   { padding: 22 },
      xl:   { padding: 30 },
    },
    padV: {
      xxs: { paddingVertical: 4 },
      xs:  { paddingVertical: 6 },
      sm:  { paddingVertical: 10 },
      md:  { paddingVertical: 16 },
      lg:  { paddingVertical: 22 },
    },
  } as const,
})

// Horizontal stack
export const Row = styled(XStack, {
  name: 'Row',
  variants: {
    fill:    { true: { flex: 1 } },
    fluid:   { true: { flex: 1, minWidth: 0 } },
    centered:{ true: { alignItems: 'center' } },
    spread:  { true: { justifyContent: 'space-between', width: '100%' } },
    between: {
      xxs: { gap: 4 },
      xs:  { gap: 6 },
      sm:  { gap: 10 },
      md:  { gap: 16 },
      lg:  { gap: 22 },
      xl:  { gap: 30 },
    },
    pad: {
      none: { padding: 0 },
      xxs:  { padding: 4 },
      xs:   { padding: 6 },
      sm:   { padding: 10 },
      md:   { padding: 16 },
      lg:   { padding: 22 },
    },
  } as const,
})

// Bordered content card — the primary surface container (replaces Panel)
export const Card = styled(YStack, {
  name: 'Card',
  width: '100%',
  backgroundColor: '$surfaceStrong',
  borderRadius: '$3',
  borderWidth: 1,
  borderColor: '$borderSubtle',
  padding: '$4',
  variants: {
    variant: {
      default:  {},
      muted:    { backgroundColor: '$surfaceMuted' },
      strong:   { borderRadius: '$4' },
      subtle:   { backgroundColor: '$surface', borderWidth: 0.5, borderRadius: '$2' },
      inverse:  { backgroundColor: '$textPrimary', borderColor: '$textPrimary' },
      selected: { backgroundColor: '$primaryMuted', borderColor: '$primary' },
      danger:   { backgroundColor: '$errorMuted', borderColor: '$error', borderRadius: '$2' },
      neutral:  { backgroundColor: '$surface', borderRadius: '$4' },
    },
    pad: {
      none: { padding: 0 },
      xxs:  { padding: 4 },
      xs:   { padding: 6 },
      sm:   { padding: 10 },
      md:   { padding: 16 },
      lg:   { padding: 22 },
      xl:   { padding: 30 },
    },
    overflow: {
      hidden:  { overflow: 'hidden' },
      visible: { overflow: 'visible' },
    },
  } as const,
})

// Full-width hairline horizontal separator
export const Rule = styled(View, {
  name: 'Rule',
  alignSelf: 'stretch',
  height: 1,
  backgroundColor: '$border',
  opacity: 0.6,
  marginVertical: 16,
})

// Thinner divider for use inside panels
export const Divider = styled(View, {
  name: 'Divider',
  alignSelf: 'stretch',
  height: 1,
  backgroundColor: '$borderSubtle',
  opacity: 0.8,
})

// Absolute-positioned layer — structural, not visual
export const AbsLayer = styled(View, {
  name: 'AbsLayer',
  position: 'absolute',
  variants: {
    fill:    { true: { top: 0, left: 0, right: 0, bottom: 0 } },
    bottom:  { true: { left: 0, right: 0, bottom: 0 } },
  } as const,
})

// Pill-shaped segmented control track
export const SegmentRow = styled(XStack, {
  name: 'SegmentRow',
  width: '100%',
  backgroundColor: '$chipBg',
  borderWidth: 0.5,
  borderColor: '$chipBorder',
  borderRadius: 999,
  padding: 3,
})

// Individual cell inside SegmentRow
export const SegmentOpt = styled(View, {
  name: 'SegmentOpt',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 13,
  borderRadius: 999,
  variants: {
    selected: {
      true: { backgroundColor: '$surface' },
    },
  } as const,
})

// Small vertical line divider inside a Row
export const VRule = styled(View, {
  name: 'VRule',
  width: 1,
  alignSelf: 'stretch',
  backgroundColor: '$border',
  opacity: 0.4,
})

// Bottom navigation bar — absolute, full-width, space-between
export const NavBar = styled(XStack, {
  name: 'NavBar',
  position: 'absolute',
  left: 0, right: 0,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
})

// Chip/pill button with border
export const ChipBtn = styled(View, {
  name: 'ChipBtn',
  borderRadius: '$2',
  borderWidth: 0.5,
  borderColor: '$chipBorder',
  backgroundColor: '$chipBg',
  paddingVertical: 10,
  paddingHorizontal: 16,
  alignItems: 'center',
  justifyContent: 'center',
})

// Full-width CTA button surface
export const BlockBtn = styled(View, {
  name: 'BlockBtn',
  width: '100%',
  borderRadius: '$2',
  paddingVertical: 16,
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    solid:    { true: { backgroundColor: '$primary' } },
    bordered: { true: { backgroundColor: '$chipBg', borderWidth: 0.5, borderColor: '$chipBorder' } },
    disabled: { true: { opacity: 0.4 } },
  } as const,
})
