/**
 * UsageBlock — feature usage bars (reviews, entities, storage, etc.).
 */
import React from "react";
import { Body, XStack, YStack } from "../../../../platform/ui/index";
import type { Usage } from "../../services/user-profile.service";
import type { UsageBlockStyle } from "../contracts/settingsContracts";

export interface UsageBlockProps {
  style: UsageBlockStyle;
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

export function UsageBlock({ style, usage }: UsageBlockProps) {
  return (
    <YStack
      bg={style.shell.container.backgroundColor}
      borderColor={style.shell.container.borderColor}
      borderWidth={style.shell.container.borderWidth}
      br={style.shell.container.borderRadius}
      p={style.shell.container.padding}
    >
      <YStack gap="$3">
        <Body fontSize={style.shell.sectionTitle.fontSize} color={style.shell.sectionTitle.color}>
          Usage
        </Body>

        <XStack gap="$3" flexWrap="wrap" ai="stretch">
          {ENTRIES.map((def) => {
            const metric = usage?.[def.key] ?? { used: 0, limit: 0, unlocked: false };
            const pct = metric.unlocked ? 0 : metric.limit > 0 ? (metric.used / metric.limit) * 100 : 0;
            const displayPct = Math.min(pct, 100);
            const barColor = pct >= 90 ? style.bar.errorColor : pct >= 70 ? style.bar.warningColor : style.bar.primaryColor;

            return (
              <YStack key={def.key} flexBasis="48%" f={1} minWidth={0}>
                <YStack
                  bg={style.shell.card.backgroundColor}
                  borderWidth={style.shell.card.borderWidth}
                  borderColor={style.shell.card.borderColor}
                  br={style.shell.card.borderRadius}
                  overflow="hidden"
                  p={style.shell.card.padding}
                >
                    <YStack gap="$2">
                      <XStack ai="center" jc="space-between" gap="$2">
                        <Body fontSize={style.shell.sectionTitle.fontSize} color={style.shell.sectionTitle.color} numberOfLines={1}>
                          {def.label}
                        </Body>
                        <Body fontSize={style.metricValue.fontSize} color={style.metricValue.color} numberOfLines={1}>
                          {metric.unlocked
                            ? "Unlimited"
                            : `${def.formatUsed(metric.used)} / ${def.formatLimit(metric.limit)}`}
                        </Body>
                      </XStack>
                      {!metric.unlocked ? (
                        <YStack h={style.bar.trackHeight} br={style.bar.radius} bg={style.bar.trackColor} overflow="hidden">
                          <YStack h="100%" w={`${displayPct}%`} bg={barColor} />
                        </YStack>
                      ) : null}
                    </YStack>
                </YStack>
              </YStack>
            );
          })}
        </XStack>
      </YStack>
    </YStack>
  );
}
