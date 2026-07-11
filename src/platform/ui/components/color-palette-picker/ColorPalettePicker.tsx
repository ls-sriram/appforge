import { styled, View } from "@tamagui/core";
import React from "react";
import { Pressable } from "../pressable/Pressable";
import { Input } from "../input/Input";
import { Icon } from "../icon/Icon";
import { Body, Label } from "../text/Text";

import type { ColorPalettePickerContract } from "./color-palette-picker.styles";
import type { ColorPalettePickerProps } from "./color-palette-picker.contract";
export type { ColorPalettePickerContract };
export type { ColorPalettePickerProps };
export { ColorPalettePickerSchema } from "./color-palette-picker.contract";

const PickerRoot = styled(View, {
  name: "ColorPalettePickerRoot",
  gap: "$sm",
});

const PaletteGrid = styled(View, {
  name: "ColorPalettePickerGrid",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "$xs",
});

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
  contract,
  inputContract,
  value,
  onValueChange,
  palette,
  label,
  helperText,
  disabled = false,
  placeholder,
  testID,
}: ColorPalettePickerProps) {
  const s = contract;
  const [draft, setDraft] = React.useState(normalizeHex(value));

  React.useEffect(() => {
    setDraft(normalizeHex(value));
  }, [value]);

  const previewColor = coercePreviewColor(draft);
  const effectivePalette = palette ?? s.swatch.defaultColors;
  const effectivePlaceholder = placeholder ?? s.input.placeholder;

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
      {label ? (
        <Label
          color={s.label.color}
          fontFamily={s.label.fontFamily}
          fontSize={s.label.fontSize}
          lineHeight={s.label.fontSize}
        >
          {label}
        </Label>
      ) : null}
      <View fd="row" ai="center" gap="$sm">
        <View
          width={s.preview.size}
          height={s.preview.size}
          borderRadius={s.preview.borderRadius}
          borderWidth={s.preview.borderWidth}
          bg={previewColor}
          borderColor={isValidHex(draft) ? s.preview.borderColor : s.preview.invalidBorderColor}
          testID={testID ? `${testID}-preview` : undefined}
        />
        <View f={1} gap="$xs">
          <Input
            contract={inputContract}
            value={draft}
            onChangeText={handleHexChange}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!disabled}
            maxLength={7}
            placeholder={effectivePlaceholder}
            testID={testID ? `${testID}-input` : undefined}
          />
          <Body
            color={isValidHex(draft) ? s.helper.color : s.error.color}
            fontFamily={s.helper.fontFamily}
            fontSize={s.helper.fontSize}
            lineHeight={s.helper.lineHeight}
          >
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
              accessibilityLabel={`Color ${normalized}`}
              selected={selected}
              disabled={disabled}
              onPress={() => handlePalettePick(normalized)}
              testID={testID ? `${testID}-swatch-${normalized.slice(1)}` : undefined}
            >
              {({ focused }) => (
                <View
                  width={s.swatch.size}
                  height={s.swatch.size}
                  borderRadius={s.swatch.borderRadius}
                  borderWidth={focused ? s.swatch.focusBorderWidth : s.swatch.borderWidth}
                  ai="center"
                  jc="center"
                  bg={normalized}
                  borderColor={focused ? s.swatch.focusBorderColor : selected ? s.swatch.selectedBorderColor : s.swatch.borderColor}
                  opacity={disabled ? s.swatch.disabledOpacity : 1}
                >
                  {selected ? <Icon color={s.icon.selectedColor} name="check" size={s.icon.selectedSize} /> : null}
                </View>
              )}
            </Pressable>
          );
        })}
      </PaletteGrid>

      {helperText ? (
        <Body
          color={s.helper.color}
          fontFamily={s.helper.fontFamily}
          fontSize={s.helper.fontSize}
          lineHeight={s.helper.lineHeight}
        >
          {helperText}
        </Body>
      ) : null}
    </PickerRoot>
  );
}
