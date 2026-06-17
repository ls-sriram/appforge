import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { Row, Icon, IconName, TapTarget, Body, Label } from "../primitives";

/**
 * NavItem — navigation tab/link molecule.
 * API: { icon, label, active?, onPress, badge? }
 */

interface NavItemProps {
  icon: IconName;
  label: string;
  active?: boolean;
  disabled?: boolean;
  badge?: number;
  onPress: () => void;
}

function NavItemSurface({
  active,
  disabled,
  children,
}: {
  active: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const c = theme.colors;

  return (
    <View
      style={[
        styles.root,
        {
          opacity: disabled ? 0.5 : 1,
          backgroundColor: active ? c.accentMuted : "transparent",
          borderColor: active ? c.accent : c.borderSubtle,
        },
      ]}
    >
      {children}
    </View>
  );
}

function BadgePill({ value }: { value: number }) {
  const c = useTheme().colors;

  return (
    <View style={[styles.badge, { backgroundColor: c.accentMuted }]}>
      <Label size="xs" primary bold>{value > 99 ? "99+" : value}</Label>
    </View>
  );
}

export function NavItem({
  icon,
  label,
  active = false,
  disabled = false,
  badge,
  onPress,
}: NavItemProps) {
  return (
    <TapTarget onPress={onPress} disabled={disabled}>
      <NavItemSurface active={active} disabled={disabled}>
        <Row centered between="sm">
          <Icon name={icon} size="lg" tone={active ? "accent" : "muted"} />
          {active
            ? <Body size="sm" bold>{label}</Body>
            : <Body size="sm" soft>{label}</Body>
          }
        </Row>
        {badge && badge > 0 ? (
          <BadgePill value={badge} />
        ) : null}
      </NavItemSurface>
    </TapTarget>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
});
