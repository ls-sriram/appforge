/**
 * ─────────────────────────────────────────────────────────────────
 * QUICK_ACTION_CARD — Tappable card with icon + label.
 *
 * Used in dashboard "Quick Actions" sections.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { Col, Icon, IconName, TapTarget, Body } from "../primitives";

export type QuickActionTone = "primary" | "success" | "warning" | "danger" | "info";

export interface QuickActionCardProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  tone?: QuickActionTone;
}

function ActionIconWell({
  backgroundColor,
  children,
}: {
  backgroundColor: string;
  children: React.ReactNode;
}) {
  return <View style={[styles.iconWell, { backgroundColor }]}>{children}</View>;
}

export function QuickActionCard({
  icon,
  label,
  onPress,
  tone = "primary",
}: QuickActionCardProps) {
  const t = useTheme();
  const toneMap: Record<QuickActionTone, { color: string; background: string }> = {
    primary: { color: t.colors.primary, background: t.colors.primaryMuted },
    success: { color: t.colors.successAccent, background: t.colors.successAccentMuted },
    warning: { color: t.colors.warning, background: t.colors.warningMuted },
    danger: { color: t.colors.alertAccent, background: t.colors.alertAccentMuted },
    info: { color: t.colors.actionAccent, background: t.colors.actionAccentMuted },
  };
  const resolved = toneMap[tone];

  return (
    <TapTarget onPress={onPress} feedback="strong">
      <Col between="xs" centered>
        <ActionIconWell backgroundColor={resolved.background}>
          <Icon
            name={icon}
            size="2xl"
            tone={
              tone === "success" ? "success"
                : tone === "warning" ? "warning"
                  : tone === "danger" ? "danger"
                    : tone === "info" ? "action"
                      : "brand"
            }
          />
        </ActionIconWell>
        <Body size="sm" center numberOfLines={2}>{label}</Body>
      </Col>
    </TapTarget>
  );
}

const styles = StyleSheet.create({
  iconWell: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
