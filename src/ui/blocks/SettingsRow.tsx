/**
 * ─────────────────────────────────────────────────────────────────
 * SETTINGS_ROW — Tappable row for settings menus.
 *
 * Icon + label + optional trailing (value, toggle, or chevron).
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { Card, Row, Col, Badge, Icon, IconName, TapTarget, Body, Toggle } from "../primitives";

/** 30×30 icon container — pixel-exact, not expressible as SpaceToken */
function IconBoxWell({ name, destructive = false }: { name: IconName; destructive?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[
      styles.iconBoxWell,
      {
        backgroundColor: theme.colors.surfaceWash,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.colors.radii.sm,
      },
    ]}>
      <Icon name={name} size="lg" tone={destructive ? "danger" : "muted"} />
    </View>
  );
}

export type SettingsRowTrailing =
  | { type: "none" }
  | { type: "value"; text: string }
  | { type: "toggle"; value: boolean; onValueChange: (v: boolean) => void }
  | { type: "badge"; label: string; variant?: "default" | "success" | "warning" | "error" };

export interface SettingsRowProps {
  icon?: IconName;
  label: string;
  trailing?: SettingsRowTrailing;
  destructive?: boolean;
  onPress?: () => void;
}

export function SettingsRow({
  icon,
  label,
  trailing = { type: "none" },
  destructive = false,
  onPress,
}: SettingsRowProps) {
  const t = useTheme();
  const isInteractive = onPress !== undefined;
  const renderTrailing = () => {
    switch (trailing.type) {
      case "value":
        return (
          <Body size="sm" soft>{trailing.text}</Body>
        );
      case "toggle":
        return (
          <Toggle value={trailing.value} onValueChange={trailing.onValueChange} size="sm" />
        );
      case "badge":
        return (
          <Badge label={trailing.label} variant={trailing.variant ?? "default"} size="sm" />
        );
      default:
        if (isInteractive) {
          return <Icon name="chevron-right" size="xl" tone="quaternary" />;
        }
        return null;
    }
  };

  const content = (
    <Card variant="subtle" pad="sm" overflow="hidden">
      <Row centered spread between="sm">
        <Row centered between="sm" fluid>
          {icon ? <IconBoxWell name={icon} destructive={destructive} /> : null}
          <Body size="sm" error={destructive}>{label}</Body>
        </Row>
        {renderTrailing()}
      </Row>
    </Card>
  );

  if (isInteractive && trailing.type !== "toggle") {
    return (
      <TapTarget onPress={onPress}>
        {content}
      </TapTarget>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  // IconBoxWell: 30×30 fixed-size icon container — not tokenizable
  iconBoxWell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
