/**
 * UsageCard — feature usage bars (reviews, entities, storage, etc.).
 */
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import { Block, ProgressBar, Text } from "../../../ui/primitives"
import { Panel } from "../../../ui/panels";
import type { Usage } from "../../../services/UserProfileService";

export interface UsageCardProps {
  usage?: Usage;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

interface UsageEntryDef {
  key: keyof Usage;
  label: string;
  formatUsed: (v: number) => string;
  formatLimit: (v: number) => string;
}

const ENTRIES: UsageEntryDef[] = [
  { key: "reviewSubmissions", label: "Reviews", formatUsed: (v) => `${v}`, formatLimit: (v) => `${v}` },
  { key: "entityCreations", label: "Entities", formatUsed: (v) => `${v}`, formatLimit: (v) => `${v}` },
  { key: "apiRequests", label: "API Requests", formatUsed: (v) => `${v}`, formatLimit: (v) => `${v}` },
  { key: "sharedLinks", label: "Shared Links", formatUsed: (v) => `${v}`, formatLimit: (v) => `${v}` },
  { key: "storageBytes", label: "Storage", formatUsed: formatBytes, formatLimit: formatBytes },
];

export function UsageCard({ usage }: UsageCardProps) {
  return (
    <Panel>
      <Block space="sm">
        <Text variant="caption" tone="muted">
          Usage
        </Text>

        <Block direction="horizontal" space="sm" wrap align="stretch">
          {ENTRIES.map((def) => {
            const metric = usage?.[def.key] ?? { used: 0, limit: 0, unlocked: false };
            const pct = metric.unlocked ? 0 : metric.limit > 0 ? (metric.used / metric.limit) * 100 : 0;
            const displayPct = Math.min(pct, 100);
            const barTone = pct >= 90 ? "danger" : pct >= 70 ? "warning" : "primary";

            return (
              <View key={def.key} style={styles.metricCard}>
                <Panel variant="subtle" overflow="hidden">
                  <Block pad="xs">
                    <Block space="xs">
                      <Block direction="horizontal" align="center" justify="space-between" space="xs">
                        <Text variant="caption" tone="muted" numberOfLines={1}>
                          {def.label}
                        </Text>
                        <Text variant="bodySm" tone="primary" numberOfLines={1}>
                          {metric.unlocked
                            ? "Unlimited"
                            : `${def.formatUsed(metric.used)} / ${def.formatLimit(metric.limit)}`}
                        </Text>
                      </Block>
                      {!metric.unlocked ? (
                        <ProgressBar value={displayPct} max={100} size="sm" tone={barTone} />
                      ) : null}
                    </Block>
                  </Block>
                </Panel>
              </View>
            );
          })}
        </Block>
      </Block>
    </Panel>
  );
}

const styles = StyleSheet.create({
  metricCard: {
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 0,
  },
});
