import { styled, View } from "@tamagui/core";
import React from "react";
import { Pressable } from "react-native";
import { Input } from "./Input";
import { Icon } from "./Icon";
import { Body, Label } from "./Text";

const DEFAULT_COLORS = [
  "#111827",
  "#374151",
  "#6B7280",
  "#EF4444",
  "#F59E0B",
  "#EAB308",
  "#22C55E",
  "#14B8A6",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
];

const PickerRoot = styled(View, {
  name: "ColorPalettePickerRoot",
  gap: "$3",
});

const SwatchPreview = styled(View, {
  name: "ColorPalettePickerPreview",
  width: 56,
  height: 56,
  borderRadius: 9999,
  borderWidth: 2,
  borderColor: "$border",
});

const PaletteGrid = styled(View, {
  name: "ColorPalettePickerGrid",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "$2",
});

const PaletteSwatchButton = styled(Pressable, {
  name: "ColorPalettePickerSwatchButton",
  width: 32,
  height: 32,
  borderRadius: 9999,
  borderWidth: 2,
  alignItems: "center",
  justifyContent: "center",
});

export interface ColorPalettePickerProps {
  value: string;
  onValueChange: (value: string) => void;
  palette?: string[];
  label?: string;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  testID?: string;
}

function normalizeHex(value: string): string {
  const trimmed = value.trim().replace(/[^#0-9a-fA-F]/g, "");
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed.replace(/^#+/, "")}`;
  return withHash.slice(0, 7).toUpperCase();
}

function isValidHex(value: string): boolean {
  return /^#([0-9A-F]{6})$/.test(value);
}

function coercePreviewColor(value: string): string {
  return isValidHex(value) ? value : "#000000";
}

export function ColorPalettePicker({
  value,
  onValueChange,
  palette = DEFAULT_COLORS,
  label,
  helperText,
  disabled = false,
  placeholder = "#4F8EF7",
  testID,
}: ColorPalettePickerProps) {
  const [draft, setDraft] = React.useState(normalizeHex(value));

  React.useEffect(() => {
    setDraft(normalizeHex(value));
  }, [value]);

  const previewColor = coercePreviewColor(draft);

  const handleHexChange = React.useCallback(
    (nextText: string) => {
      const normalized = normalizeHex(nextText);
      setDraft(normalized);
      if (isValidHex(normalized)) {
        onValueChange(normalized);
      }
    },
    [onValueChange],
  );

  const handlePalettePick = React.useCallback(
    (nextColor: string) => {
      const normalized = normalizeHex(nextColor);
      setDraft(normalized);
      onValueChange(normalized);
    },
    [onValueChange],
  );

  return (
    <PickerRoot testID={testID}>
      {label ? <Label tone="secondary">{label}</Label> : null}

      <View fd="row" ai="center" gap="$3">
        <SwatchPreview
          bg={previewColor}
          borderColor={isValidHex(draft) ? "$border" : "$error"}
          testID={testID ? `${testID}-preview` : undefined}
        />
        <View f={1} gap="$2">
          <Input
            value={draft}
            onChangeText={handleHexChange}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!disabled}
            maxLength={7}
            placeholder={placeholder}
            testID={testID ? `${testID}-input` : undefined}
          />
          <Body size="sm" tone={isValidHex(draft) ? "muted" : "danger"}>
            {isValidHex(draft) ? "Hex color" : "Enter a valid 6-digit hex color"}
          </Body>
        </View>
      </View>

      <PaletteGrid testID={testID ? `${testID}-palette` : undefined}>
        {palette.map((color) => {
          const normalized = normalizeHex(color);
          const selected = normalizeHex(value) === normalized;
          return (
            <PaletteSwatchButton
              key={normalized}
              accessibilityRole="button"
              accessibilityState={{ disabled, selected }}
              disabled={disabled}
              onPress={() => handlePalettePick(normalized)}
              bg={normalized}
              borderColor={selected ? "$primary" : "$border"}
              opacity={disabled ? 0.5 : 1}
              testID={testID ? `${testID}-swatch-${normalized.slice(1)}` : undefined}
            >
              {selected ? <Icon name="check" tone="inverse" size="sm" /> : null}
            </PaletteSwatchButton>
          );
        })}
      </PaletteGrid>

      {helperText ? <Body size="sm" tone="muted">{helperText}</Body> : null}
    </PickerRoot>
  );
}
