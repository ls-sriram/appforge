import React from "react";
import { Pressable } from "react-native";
import { Body, View, XStack, YStack } from "../../../../../ui";
import { DARK_THEME_RESOLVED, LIGHT_THEME_RESOLVED } from "../domain/ui-theme-palette";
import { ColorPickerField } from "./ui-color-picker.view";

// ── Presets ───────────────────────────────────────────────────────────────────

interface Preset {
  name: string;
  swatch: string;
  overrides: Record<string, string>;
}

function lightPreset(): Record<string, string> {
  const keys = [
    "bg", "surface", "surfaceStrong", "surfaceAlt",
    "textPrimary", "textSecondary", "textMuted", "textInverse",
    "border", "borderSubtle", "borderFocus",
    "chipBg", "scrim",
    "success", "successMuted", "warning", "warningMuted",
    "error", "errorMuted", "info", "infoMuted",
  ];
  return Object.fromEntries(
    keys.map((k) => [k, LIGHT_THEME_RESOLVED[k] ?? DARK_THEME_RESOLVED[k] ?? "#000"]),
  );
}

const PRESETS: Preset[] = [
  {
    name: "Blue",
    swatch: "#4F8EF7",
    overrides: { primary: "#4F8EF7", primaryMuted: "rgba(79,142,247,0.14)", accent: "#4F8EF7", accentMuted: "rgba(79,142,247,0.14)", borderFocus: "#4F8EF7" },
  },
  {
    name: "Violet",
    swatch: "#7C3AED",
    overrides: { primary: "#7C3AED", primaryMuted: "rgba(124,58,237,0.14)", accent: "#7C3AED", accentMuted: "rgba(124,58,237,0.14)", borderFocus: "#7C3AED" },
  },
  {
    name: "Emerald",
    swatch: "#10B981",
    overrides: { primary: "#10B981", primaryMuted: "rgba(16,185,129,0.14)", accent: "#10B981", accentMuted: "rgba(16,185,129,0.14)", borderFocus: "#10B981" },
  },
  {
    name: "Rose",
    swatch: "#F43F5E",
    overrides: { primary: "#F43F5E", primaryMuted: "rgba(244,63,94,0.14)", accent: "#F43F5E", accentMuted: "rgba(244,63,94,0.14)", borderFocus: "#F43F5E" },
  },
  {
    name: "Amber",
    swatch: "#F59E0B",
    overrides: { primary: "#F59E0B", primaryMuted: "rgba(245,158,11,0.14)", accent: "#F59E0B", accentMuted: "rgba(245,158,11,0.14)", borderFocus: "#F59E0B" },
  },
  {
    name: "Light",
    swatch: "#F5F5F5",
    overrides: lightPreset(),
  },
];

// ── Token groups ──────────────────────────────────────────────────────────────

const TOKEN_GROUPS: Array<{ label: string; tokens: string[] }> = [
  { label: "Brand",    tokens: ["primary", "primaryMuted", "accent"] },
  { label: "Surfaces", tokens: ["bg", "surface", "surfaceStrong", "surfaceAlt"] },
  { label: "Text",     tokens: ["textPrimary", "textSecondary", "textMuted"] },
  { label: "Borders",  tokens: ["border", "borderSubtle", "borderFocus"] },
  { label: "Status",   tokens: ["success", "successMuted", "warning", "warningMuted", "error", "errorMuted", "info", "infoMuted"] },
];

// Token injection is handled by the screen via canvasRef — not here.

// ── Token row ─────────────────────────────────────────────────────────────────

function TokenColorRow({
  token,
  baseValue,
  override,
  onSet,
  onClear,
}: {
  token: string;
  baseValue: string;
  override?: string;
  onSet: (key: string, value: string) => void;
  onClear: (key: string) => void;
}) {
  return (
    <XStack
      ai="center" px="$3" h={32} gap="$2"
      borderBottomColor="$borderSubtle" borderBottomWidth={1}
    >
      <Body fontSize="$1" color="$textSecondary" f={1} numberOfLines={1}>{token}</Body>
      <ColorPickerField
        value={override ?? baseValue}
        onChange={(v) => onSet(token, v)}
        onReset={override !== undefined ? () => onClear(token) : undefined}
        compact
      />
    </XStack>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function UiTokenPaletteView({
  themeOverrides,
  onSetOverride,
  onClearOverride,
  onClearAll,
  onApplyPreset,
}: {
  themeOverrides: Record<string, string>;
  onSetOverride: (key: string, value: string) => void;
  onClearOverride: (key: string) => void;
  onClearAll: () => void;
  onApplyPreset: (overrides: Record<string, string>) => void;
}) {
  const base = DARK_THEME_RESOLVED;
  const hasOverrides = Object.keys(themeOverrides).length > 0;

  return (
    <YStack>
      {/* Presets */}
      <XStack px="$3" pt="$3" pb="$1" ai="center" jc="space-between">
        <Body fontSize={9} color="$textSecondary" tt="uppercase" letterSpacing={1.5}>
          Presets
        </Body>
        {hasOverrides && (
          <Pressable onPress={onClearAll}>
            <Body fontSize={9} color="$textMuted">Reset all</Body>
          </Pressable>
        )}
      </XStack>

      <XStack px="$3" pb="$3" gap="$2" flexWrap="wrap">
        {PRESETS.map((preset) => {
          const active = themeOverrides.primary === preset.overrides.primary ||
            (preset.name === "Light" && themeOverrides.bg === preset.overrides.bg);
          return (
            <Pressable key={preset.name} onPress={() => onApplyPreset(preset.overrides)}>
              {({ pressed }: { pressed: boolean }) => (
                <XStack
                  ai="center" gap="$2" px="$2" py="$1"
                  borderColor={active ? "$primary" : "$borderSubtle"} borderWidth={1}
                  bg={pressed ? "$errorMuted" : active ? "$surfaceStrong" : "transparent"}
                >
                  <View w={10} h={10}
                    // @ts-ignore
                    style={{ backgroundColor: preset.swatch, border: preset.name === "Light" ? "1px solid rgba(0,0,0,0.15)" : "none" }}
                  />
                  <Body fontSize="$1" color={active ? "$textPrimary" : "$textSecondary"}>
                    {preset.name}
                  </Body>
                </XStack>
              )}
            </Pressable>
          );
        })}
      </XStack>

      {/* Token groups */}
      {TOKEN_GROUPS.map((group) => (
        <YStack key={group.label} borderTopColor="$borderSubtle" borderTopWidth={1}>
          <XStack px="$3" pt="$3" pb="$1">
            <Body fontSize={9} color="$textSecondary" tt="uppercase" letterSpacing={1.5}>
              {group.label}
            </Body>
          </XStack>
          {group.tokens.map((token) => (
            <TokenColorRow
              key={token}
              token={token}
              baseValue={base[token] ?? "#000"}
              override={themeOverrides[token]}
              onSet={onSetOverride}
              onClear={onClearOverride}
            />
          ))}
        </YStack>
      ))}
    </YStack>
  );
}
