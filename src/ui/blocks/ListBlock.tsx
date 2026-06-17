import React from "react";
import { Card, Col, Row, Icon, IconName, MetaText, TapTarget, Body, Skeleton } from "../primitives";

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
      <Card>
        <Col between="sm">
          {Array.from({ length: 3 }).map((_, i) => (
            <Row key={i} centered between="sm">
              <Skeleton height={32} variant="circle" width={32} />
              <Col between="xs" fill>
                <Skeleton height={14} variant="text" width="60%" />
                <Skeleton height={12} variant="text" width="40%" />
              </Col>
            </Row>
          ))}
        </Col>
      </Card>
    );
  }

  if (!config.items.length) {
    return (
      <Card>
        <Body size="sm">No items</Body>
      </Card>
    );
  }

  return (
    <Card>
      <Col between="sm">
        {config.title ? <Body size="sm" bold>{config.title}</Body> : null}
        {config.items.map((item) => (
          <TapTarget
            key={item.id}
            onPress={onItemPress ? () => onItemPress(item) : undefined}
            feedback={onItemPress ? "strong" : "none"}
            disabled={!onItemPress}
          >
            <Row centered between="sm" spread>
              <Row centered between="sm">
                {item.icon ? <Icon name={item.icon} size="lg" /> : null}
                <Col between="xs">
                  <Body size="sm">{item.title}</Body>
                  {item.subtitle ? <MetaText>{item.subtitle}</MetaText> : null}
                </Col>
              </Row>
              <Row centered between="sm">
                {item.badge != null && item.badge > 0 ? <MetaText>{item.badge > 99 ? "99+" : item.badge}</MetaText> : null}
                {onItemPress ? <Icon name="chevron-right" size="md" /> : null}
              </Row>
            </Row>
          </TapTarget>
        ))}
      </Col>
    </Card>
  );
}
