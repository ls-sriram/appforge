import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { Card, Row, Col, Icon, TapTarget } from "../primitives";

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
    <Card variant="neutral" pad="sm" width={fullWidth ? "100%" : undefined}>
      <Row centered between="sm">
        <Icon name="search" size="lg" tone="muted" />
        <Col fill>
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={c.textMuted}
            style={[styles.input, { color: c.textPrimary }]}
            numberOfLines={1}
          />
        </Col>
        {value && onClear ? (
          <TapTarget onPress={onClear}>
            <Icon name="x" size="md" tone="muted" />
          </TapTarget>
        ) : null}
      </Row>
    </Card>
  );
}

const styles = StyleSheet.create({
  // input: resets platform default vertical padding on TextInput
  input: {
    paddingVertical: 0,
  },
});
