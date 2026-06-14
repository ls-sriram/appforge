/**
 * AccountCard — account metadata (member since, last login).
 */
import React from "react";
import { useTheme } from "../../../theme/ThemeProvider";
import { Block, Icon, Text } from "../../../ui/primitives"
import { Panel } from "../../../ui/panels";
import { dateOwner } from "../../../core/dates";

export interface AccountCardProps {
  createdAt?: string;
  lastLoginAt?: string;
}

function formatDate(iso?: string): string {
  if (!iso) return "Unknown";
  return dateOwner.format(iso, "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRelative(iso?: string): string {
  if (!iso) return "Unknown";
  const parsed = dateOwner.parse(iso);
  if (!parsed) return "Unknown";
  const diff = dateOwner.now().getTime() - parsed.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function AccountCard({ createdAt, lastLoginAt }: AccountCardProps) {
  const c = useTheme().colors;

  return (
    <Panel>
      <Block space="sm">
        <Text variant="caption" tone="muted">
          Account Details
        </Text>

        <Block direction="horizontal" space="sm">
          <Block frame="fill">
            <Panel variant="subtle" overflow="hidden">
              <Block pad="sm">
                <Block space="xs">
                  <Block direction="horizontal" align="center" space="xs">
                    <Icon name="calendar" size="md" tone="muted" />
                    <Text variant="caption" tone="muted">
                      Member since
                    </Text>
                  </Block>
                  <Text variant="bodySm" tone="primary">
                    {formatDate(createdAt)}
                  </Text>
                </Block>
              </Block>
            </Panel>
          </Block>

          <Block frame="fill">
            <Panel variant="subtle" overflow="hidden">
              <Block pad="sm">
                <Block space="xs">
                  <Block direction="horizontal" align="center" space="xs">
                    <Icon name="activity" size="md" tone="muted" />
                    <Text variant="caption" tone="muted">
                      Last login
                    </Text>
                  </Block>
                  <Text variant="bodySm" tone="primary">
                    {formatRelative(lastLoginAt)}
                  </Text>
                </Block>
              </Block>
            </Panel>
          </Block>
        </Block>
      </Block>
    </Panel>
  );
}
