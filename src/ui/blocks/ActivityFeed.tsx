import React from "react";
import { Block, Icon, IconName, MetaText, Skeleton, Text } from "../primitives"
import { Panel } from "../panels";

export interface ActivityItem {
  id: string;
  icon?: IconName;
  title: string;
  subtitle?: string;
  timestamp: string;
}

export interface ActivityFeedConfig {
  items: ActivityItem[];
  title?: string;
  limit?: number;
}

interface ActivityFeedProps {
  config: ActivityFeedConfig;
  loading?: boolean;
}

export function ActivityFeed({ config, loading = false }: ActivityFeedProps) {
  const items = config.limit ? config.items.slice(0, config.limit) : config.items;

  if (loading) {
    return (
      <Block>
        <Panel>
          <Block space="sm">
            <Skeleton height={16} variant="text" width="40%" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Block direction="horizontal" key={i} align="center" space="sm">
                <Skeleton height={24} variant="circle" width={24} />
                <Block space="xs">
                  <Skeleton height={14} variant="text" width="70%" />
                  <Skeleton height={12} variant="text" width="40%" />
                </Block>
              </Block>
            ))}
          </Block>
        </Panel>
      </Block>
    );
  }

  if (!items.length) {
    return (
      <Block>
        <Panel>
          <Text variant="bodySm">No activity</Text>
        </Panel>
      </Block>
    );
  }

  return (
    <Block>
      <Panel>
        <Block space="sm">
          {config.title ? <Text variant="bodySm">{config.title}</Text> : null}
          {items.map((item) => (
            <Block direction="horizontal" key={item.id} align="center" justify="space-between" space="sm">
              <Block direction="horizontal" align="center" space="sm">
                <Icon name={item.icon ?? "activity"} size="md" />
                <Block space="xs">
                  <Text variant="bodySm">{item.title}</Text>
                  {item.subtitle ? <MetaText>{item.subtitle}</MetaText> : null}
                </Block>
              </Block>
              <MetaText>{item.timestamp}</MetaText>
            </Block>
          ))}
        </Block>
      </Panel>
    </Block>
  );
}
