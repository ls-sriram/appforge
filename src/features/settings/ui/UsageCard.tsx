/**
 * UsageCard — feature usage bars (reviews, entities, storage, etc.).
 */
import React from "react";
import { StyleSheet, View } from "react-native";
import { Body, View as TView, XStack, YStack } from "../../../platform/ui/index";
import type { Usage } from "../services/user-profile.service";

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
    <TView bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$4">
      <YStack gap="$3">
        <Body fontSize="$1" color="$textMuted">
          Usage
        </Body>

        <XStack gap="$3" flexWrap="wrap" ai="stretch">
          {ENTRIES.map((def) => {
            const metric = usage?.[def.key] ?? { used: 0, limit: 0, unlocked: false };
            const pct = metric.unlocked ? 0 : metric.limit > 0 ? (metric.used / metric.limit) * 100 : 0;
            const displayPct = Math.min(pct, 100);
            const barColor = pct >= 90 ? "$error" : pct >= 70 ? "$warning" : "$primary";

            return (
              <View key={def.key} style={styles.metricCard}>
                <TView bg="$surface" borderWidth={1} borderColor="$border" br="$2" overflow="hidden" p="$2">
                    <YStack gap="$2">
                      <XStack ai="center" jc="space-between" gap="$2">
                        <Body fontSize="$1" color="$textMuted" numberOfLines={1}>
                          {def.label}
                        </Body>
                        <Body fontSize="$2" color="$primary" numberOfLines={1}>
                          {metric.unlocked
                            ? "Unlimited"
                            : `${def.formatUsed(metric.used)} / ${def.formatLimit(metric.limit)}`}
                        </Body>
                      </XStack>
                      {!metric.unlocked ? (
                        <TView h={4} br={9999} bg="$surfaceAlt" overflow="hidden">
                          <TView h="100%" w={`${displayPct}%`} bg={barColor} />
                        </TView>
                      ) : null}
                    </YStack>
                </TView>
              </View>
            );
          })}
        </XStack>
      </YStack>
    </TView>
  );
}

const styles = StyleSheet.create({
  metricCard: {
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 0,
  },
});
