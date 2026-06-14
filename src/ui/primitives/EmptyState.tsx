import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { Block } from "./Block";
import { Text } from "./Text";
import { Button } from "./Button";
import { Icon, IconName } from "./Icon";

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

function IconCircle({ name }: { name: IconName }) {
  const t = useTheme();
  return (
    <View style={[styles.iconCircle, {
      borderRadius: t.colors.radii.full,
      backgroundColor: t.colors.primaryMuted,
      marginBottom: t.colors.space.sm,
    }]}>
      <Icon name={name} size="4xl" tone="brand" />
    </View>
  );
}

const styles = StyleSheet.create({
  iconCircle: { width: 64, height: 64, alignItems: "center", justifyContent: "center" },
});

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Block align="center" justify="center" pad="xl" space="md">
      {icon ? <IconCircle name={icon} /> : null}
      <Text variant="h3" align="center">{title}</Text>
      {description ? (
        <Text variant="body" tone="muted" align="center">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button variant="primary" onPress={onAction} label={actionLabel} />
      ) : null}
    </Block>
  );
}
