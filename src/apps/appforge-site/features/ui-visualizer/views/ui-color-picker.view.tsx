/**
 * Shared color picker field for AppForge site.
 * Used in token palette (raw token overrides) and inspector (node color props).
 *
 * UX: compact row showing swatch + value. Clicking the swatch opens the OS color
 * picker. Tapping ▾ expands an inline dropdown with a large picker + hex/rgba
 * text input + optional preset chips.
 */
import React from "react";
import { Pressable, TextInput } from "react-native";
import { Body, View, XStack, YStack } from "../../../../../ui";
import { DARK_THEME_RESOLVED } from "../domain/ui-theme-palette";

// ── Color math helpers ────────────────────────────────────────────────────────

export function toHex(value: string): string {
  if (!value) return "#000000";
  if (value.startsWith("#")) return value.length >= 7 ? value.slice(0, 7) : value;
  const m = value.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
  if (m) return "#" + [m[1], m[2], m[3]].map((n) => parseInt(n).toString(16).padStart(2, "0")).join("");
  if (value.startsWith("$")) {
    const resolved = DARK_THEME_RESOLVED[value.slice(1)];
    if (resolved) return toHex(resolved);
  }
  return "#000000";
}

export function resolveDisplayColor(value: string | undefined): string {
  if (!value) return "#000000";
  if (value.startsWith("$")) return toHex(DARK_THEME_RESOLVED[value.slice(1)] ?? "#000");
  return toHex(value);
}

function getAlpha(value: string): number {
  const m = value.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/);
  return m ? parseFloat(m[1]) : 1;
}

function rebuildValue(original: string, newHex: string): string {
  const rgbaMatch = original.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const alpha = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
    const r = parseInt(newHex.slice(1, 3), 16);
    const g = parseInt(newHex.slice(3, 5), 16);
    const b = parseInt(newHex.slice(5, 7), 16);
    return alpha < 1 ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;
  }
  return newHex;
}

// ── Preset chip ───────────────────────────────────────────────────────────────

export interface ColorPreset {
  label: string;
  value: string;   // what gets set (token ref or hex)
  hex: string;     // display color
}

// ── Main component ────────────────────────────────────────────────────────────

export function ColorPickerField({
  value,
  onChange,
  onReset,
  presets,
  compact = false,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  onReset?: () => void;
  presets?: ColorPreset[];
  compact?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string>("");

  const displayHex = resolveDisplayColor(value);
  const displayText = value ?? "—";
  const alpha = value ? getAlpha(value) : 1;
  const hasAlpha = value ? /rgba/.test(value) : false;

  function handlePickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hex = e.target.value;
    onChange(value ? rebuildValue(value, hex) : hex);
  }

  function openDropdown() {
    setDraft(value ?? "");
    setOpen((v) => !v);
  }

  function commitDraft() {
    if (draft.trim()) onChange(draft.trim());
    setOpen(false);
  }

  function handleAlphaChange(a: string) {
    const num = parseFloat(a);
    if (isNaN(num)) return;
    const clamped = Math.min(1, Math.max(0, num));
    const r = parseInt(displayHex.slice(1, 3), 16);
    const g = parseInt(displayHex.slice(3, 5), 16);
    const b = parseInt(displayHex.slice(5, 7), 16);
    onChange(`rgba(${r},${g},${b},${clamped})`);
  }

  return (
    <YStack f={1} style={{ position: "relative" }}>
      {/* ── Compact row ── */}
      <XStack ai="center" gap="$2" f={1} jc="flex-end">
        {/* Swatch — contains hidden native color input for instant picking */}
        <View
          w={compact ? 14 : 18} h={compact ? 10 : 12}
          borderColor="$borderSubtle" borderWidth={1}
          flexShrink={0}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <View style={{ position: "absolute", inset: 0, backgroundColor: displayHex }} />
          {/* @ts-ignore */}
          <input
            type="color"
            value={displayHex}
            onChange={handlePickerChange}
            style={{
              opacity: 0,
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
              border: "none",
              padding: 0,
            }}
          />
        </View>

        {/* Value text + chevron */}
        <Pressable onPress={openDropdown} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Body fontSize={10} color="$textPrimary" numberOfLines={1} style={{ maxWidth: compact ? 56 : 72 }}>
            {displayText}
          </Body>
          <Body fontSize={8} color="$textSecondary">▾</Body>
        </Pressable>
      </XStack>

      {/* ── Dropdown ── */}
      {open && (
        <View
          style={{ position: "absolute", top: compact ? 18 : 22, right: 0, zIndex: 300, width: 200 }}
          bg="$surfaceStrong" borderColor="$border" borderWidth={1} overflow="hidden"
        >
          {/* Large color picker */}
          <XStack ai="center" gap="$2" px="$2" pt="$2" pb="$1">
            {/* @ts-ignore */}
            <input
              type="color"
              value={displayHex}
              onChange={handlePickerChange}
              style={{ width: 36, height: 28, border: "1px solid rgba(255,255,255,0.12)", background: "none", cursor: "pointer", flexShrink: 0 }}
            />
            {/* Hex text input */}
            <View f={1} h={28} px="$2" bg="$surface" borderColor="$borderSubtle" borderWidth={1} jc="center">
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={displayHex}
                placeholderTextColor={DARK_THEME_RESOLVED.textMuted}
                style={{ color: DARK_THEME_RESOLVED.textPrimary, fontSize: 11, fontFamily: "System", padding: 0, margin: 0 }}
                onSubmitEditing={commitDraft}
                autoFocus
              />
            </View>
          </XStack>

          {/* Alpha row — only when value has rgba */}
          {hasAlpha && (
            <XStack ai="center" gap="$2" px="$2" pb="$1">
              <Body fontSize={10} color="$textMuted" style={{ width: 40 }}>Alpha</Body>
              <View f={1} h={24} px="$2" bg="$surface" borderColor="$borderSubtle" borderWidth={1} jc="center">
                <TextInput
                  value={String(alpha)}
                  onChangeText={handleAlphaChange}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={DARK_THEME_RESOLVED.textMuted}
                  style={{ color: DARK_THEME_RESOLVED.textPrimary, fontSize: 11, fontFamily: "System", padding: 0, margin: 0 }}
                />
              </View>
            </XStack>
          )}

          {/* Preset chips */}
          {presets && presets.length > 0 && (
            <YStack px="$2" pb="$2">
              <XStack flexWrap="wrap" gap={4} pt="$1">
                {presets.map((p) => {
                  const selected = value === p.value;
                  return (
                    <Pressable key={p.value} onPress={() => { onChange(p.value); setOpen(false); }}>
                      {({ pressed }: { pressed: boolean }) => (
                        <View
                          w={20} h={14}
                          borderColor={selected ? "$primary" : pressed ? "$border" : "$borderSubtle"}
                          borderWidth={selected ? 2 : 1}
                          // @ts-ignore
                          style={{ backgroundColor: p.hex, position: "relative" }}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </XStack>
            </YStack>
          )}

          {/* Apply / cancel */}
          <XStack px="$2" pb="$2" gap="$2" jc="flex-end" ai="center">
            {onReset && (
              <Pressable onPress={() => { onReset(); setOpen(false); }}>
                <Body fontSize={10} color="$textMuted">Reset</Body>
              </Pressable>
            )}
            <Pressable onPress={() => setOpen(false)}>
              <Body fontSize={10} color="$textMuted">✕</Body>
            </Pressable>
            <Pressable onPress={commitDraft}>
              <Body fontSize={10} color="$primary">Apply</Body>
            </Pressable>
          </XStack>
        </View>
      )}
    </YStack>
  );
}
