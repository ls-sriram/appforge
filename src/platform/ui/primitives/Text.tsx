import { styled, Text as TamaguiText } from "@tamagui/core";

export const Text = TamaguiText;

// ── Tone values shared across all text primitives ─────────────────────────────
// tone controls semantic color. Raw `color` prop still works for one-offs.

// ── Body ──────────────────────────────────────────────────────────────────────

export const Body = styled(TamaguiText, {
  name: "Body",
  fontFamily: "$reg",
  color: "$textPrimary",
  fontSize: "$3",
  lineHeight: "$3",

  variants: {
    tone: {
      primary:   { color: "$textPrimary" },
      secondary: { color: "$textSecondary" },
      muted:     { color: "$textMuted" },
      accent:    { color: "$primary" },
      inverse:   { color: "$textInverse" },
      danger:    { color: "$error" },
      success:   { color: "$success" },
      warning:   { color: "$warning" },
      info:      { color: "$info" },
    },
    size: {
      xs:      { fontSize: "$1", lineHeight: "$1" },
      sm:      { fontSize: "$2", lineHeight: "$2" },
      md:      { fontSize: "$3", lineHeight: "$3" },
      lg:      { fontSize: "$4", lineHeight: "$4" },
      xl:      { fontSize: "$5", lineHeight: "$5" },
      "2xl":   { fontSize: "$6", lineHeight: "$6" },
    },
    weight: {
      regular: { fontFamily: "$reg" },
      bold:    { fontFamily: "$bold" },
    },
  } as const,
});

// ── Heading ───────────────────────────────────────────────────────────────────

export const Heading = styled(TamaguiText, {
  name: "Heading",
  fontFamily: "$reg",
  color: "$textPrimary",
  fontSize: "$5",
  lineHeight: "$5",

  variants: {
    tone: {
      primary:   { color: "$textPrimary" },
      secondary: { color: "$textSecondary" },
      muted:     { color: "$textMuted" },
      accent:    { color: "$primary" },
      inverse:   { color: "$textInverse" },
      danger:    { color: "$error" },
      success:   { color: "$success" },
      warning:   { color: "$warning" },
    },
    size: {
      sm:      { fontSize: "$3", lineHeight: "$3" },
      md:      { fontSize: "$4", lineHeight: "$4" },
      lg:      { fontSize: "$5", lineHeight: "$5" },
      xl:      { fontSize: "$6", lineHeight: "$6" },
      display: { fontSize: "$7", lineHeight: "$7", fontFamily: "$bold" },
    },
    weight: {
      regular: { fontFamily: "$reg" },
      bold:    { fontFamily: "$bold" },
    },
  } as const,
});

// ── Label ─────────────────────────────────────────────────────────────────────

export const Label = styled(TamaguiText, {
  name: "Label",
  fontFamily: "$reg",
  color: "$textPrimary",
  fontSize: "$2",
  lineHeight: "$2",

  variants: {
    tone: {
      primary:   { color: "$textPrimary" },
      secondary: { color: "$textSecondary" },
      muted:     { color: "$textMuted" },
      accent:    { color: "$primary" },
      inverse:   { color: "$textInverse" },
      danger:    { color: "$error" },
      success:   { color: "$success" },
      warning:   { color: "$warning" },
    },
  } as const,
});

// ── Display ───────────────────────────────────────────────────────────────────
// Kept as a named export for backwards compat; equivalent to Heading size="display".

export const Display = styled(TamaguiText, {
  name: "Display",
  fontFamily: "$bold",
  color: "$textPrimary",
  fontSize: "$7",
  lineHeight: "$7",
});
