import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { Block, Icon, TapTarget } from "../primitives"

/**
 * SearchBar — search input molecule.
 * API: { placeholder?, value?, onChange?, onClear?, fullWidth? }
 */

interface SearchBarProps {
  value?: string;
  onChange?: (v: string) => void;
  onClear?: () => void;
  placeholder?: string;
  fullWidth?: boolean;
}

export function SearchBar({
  value = "",
  onChange,
  onClear,
  placeholder = "Search…",
  fullWidth = true,
}: SearchBarProps) {
  const theme = useTheme();
  const c = theme.colors;

  return (
    <Block frame={fullWidth ? "expand" : undefined}>
      <Block paint="neutral">
        <Block padH="sm" padV="xs">
          <Block direction="horizontal" align="center" space="sm">
            <Icon name="search" size="lg" tone="muted" />
            <Block frame="fill">
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor={c.textMuted}
                style={[styles.input, { color: c.textPrimary }]}
                numberOfLines={1}
              />
            </Block>
            {value && onClear ? (
              <TapTarget onPress={onClear}>
                <Icon name="x" size="md" tone="muted" />
              </TapTarget>
            ) : null}
          </Block>
        </Block>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  // input: resets platform default vertical padding on TextInput
  input: {
    paddingVertical: 0,
  },
});
