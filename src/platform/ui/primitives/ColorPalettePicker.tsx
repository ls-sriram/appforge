import { styled, View } from "@tamagui/core";
import React from "react";
import { Pressable } from "react-native";
import { useUI } from "../theme/ThemeProvider";
import { Input } from "./Input";
import { Icon } from "./Icon";
import { Body, Label } from "./Text";

export interface ColorPalettePickerVariant {
  previewSize: number;
  previewBorderWidth: number;
  previewBorderRadius: number;
  swatchSize: number;
  swatchBorderWidth: number;
  swatchBorderRadius: number;
  placeholder: string;
  defaultSwatches: string[];
  previewBorderColor: string;
  invalidPreviewBorderColor: string;
  swatchBorderColor: string;
  selectedSwatchBorderColor: string;
  disabledOpacity: number;
}

const PickerRoot = styled(View, {
  name: "ColorPalettePickerRoot",
  gap: "$3",
});

const PaletteGrid = styled(View, {
  name: "ColorPalettePickerGrid",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "$2",
});

export interface ColorPalettePickerProps {
  value: string;
  onValueChange: (value: string) => void;
  palette?: string[];
  variant?: string;
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
  palette,
  variant = "default",
  label,
  helperText,
  disabled = false,
  placeholder,
  testID,
}: ColorPalettePickerProps) {
  const { variants } = useUI();
  const s = variants.colorPalettePicker?.[variant];
  if (!s) throw new Error(`Unknown colorPalettePicker variant "${variant}"`);
  const [draft, setDraft] = React.useState(normalizeHex(value));

  React.useEffect(() => {
    setDraft(normalizeHex(value));
  }, [value]);

  const previewColor = coercePreviewColor(draft);
  const effectivePalette = palette ?? s.defaultSwatches;
  const effectivePlaceholder = placeholder ?? s.placeholder;

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
        <View
          width={s.previewSize}
          height={s.previewSize}
          borderRadius={s.previewBorderRadius}
          borderWidth={s.previewBorderWidth}
          bg={previewColor}
          borderColor={isValidHex(draft) ? s.previewBorderColor : s.invalidPreviewBorderColor}
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
            placeholder={effectivePlaceholder}
            testID={testID ? `${testID}-input` : undefined}
          />
          <Body size="sm" tone={isValidHex(draft) ? "muted" : "danger"}>
            {isValidHex(draft) ? "Hex color" : "Enter a valid 6-digit hex color"}
          </Body>
        </View>
      </View>

      <PaletteGrid testID={testID ? `${testID}-palette` : undefined}>
        {effectivePalette.map((color) => {
          const normalized = normalizeHex(color);
          const selected = normalizeHex(value) === normalized;
          return (
            <Pressable
              key={normalized}
              accessibilityRole="button"
              accessibilityState={{ disabled, selected }}
              disabled={disabled}
              onPress={() => handlePalettePick(normalized)}
              style={{
                width: s.swatchSize,
                height: s.swatchSize,
                borderRadius: s.swatchBorderRadius,
                borderWidth: s.swatchBorderWidth,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: normalized,
                borderColor: selected ? s.selectedSwatchBorderColor : s.swatchBorderColor,
                opacity: disabled ? s.disabledOpacity : 1,
              }}
              testID={testID ? `${testID}-swatch-${normalized.slice(1)}` : undefined}
            >
              {selected ? <Icon name="check" tone="inverse" size="sm" /> : null}
            </Pressable>
          );
        })}
      </PaletteGrid>

      {helperText ? <Body size="sm" tone="muted">{helperText}</Body> : null}
    </PickerRoot>
  );
}
