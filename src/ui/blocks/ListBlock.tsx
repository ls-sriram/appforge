import React from "react";
import { Block, Icon, IconName, MetaText, TapTarget, Text, Skeleton } from "../primitives"
import { Panel } from "../panels";

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: IconName;
  badge?: number;
}

export interface ListBlockConfig {
  items: ListItem[];
  title?: string;
}

interface ListBlockProps {
  config: ListBlockConfig;
  loading?: boolean;
  onItemPress?: (item: ListItem) => void;
}

export function ListBlock({ config, loading = false, onItemPress }: ListBlockProps) {
  if (loading) {
    return (
      <Block>
        <Panel>
          <Block space="sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <Block direction="horizontal" key={i} align="center" space="sm">
                <Skeleton height={32} variant="circle" width={32} />
                <Block space="xs">
                  <Skeleton height={14} variant="text" width="60%" />
                  <Skeleton height={12} variant="text" width="40%" />
                </Block>
              </Block>
            ))}
          </Block>
        </Panel>
      </Block>
    );
  }

  if (!config.items.length) {
    return (
      <Block>
        <Panel>
          <Text variant="bodySm">No items</Text>
        </Panel>
      </Block>
    );
  }

  return (
    <Block>
      <Panel>
        <Block space="sm">
          {config.title ? <Text variant="bodySm">{config.title}</Text> : null}
          {config.items.map((item) => (
            <TapTarget
              key={item.id}
              onPress={onItemPress ? () => onItemPress(item) : undefined}
              feedback={onItemPress ? "strong" : "none"}
              disabled={!onItemPress}
            >
              <Block direction="horizontal" align="center" justify="space-between" space="sm">
                <Block direction="horizontal" align="center" space="sm">
                  {item.icon ? <Icon name={item.icon} size="lg" /> : null}
                  <Block space="xs">
                    <Text variant="bodySm">{item.title}</Text>
                    {item.subtitle ? <MetaText>{item.subtitle}</MetaText> : null}
                  </Block>
                </Block>
                <Block direction="horizontal" align="center" space="sm">
                  {item.badge != null && item.badge > 0 ? <MetaText>{item.badge > 99 ? "99+" : item.badge}</MetaText> : null}
                  {onItemPress ? <Icon name="chevron-right" size="md" /> : null}
                </Block>
              </Block>
            </TapTarget>
          ))}
        </Block>
      </Panel>
    </Block>
  );
}
