import React from "react";
import { Card, Col, Row, Icon, IconName, MetaText, Skeleton, Body } from "../primitives";

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
      <Card>
        <Col between="sm">
          <Skeleton height={16} variant="text" width="40%" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Row key={i} centered between="sm">
              <Skeleton height={24} variant="circle" width={24} />
              <Col between="xs" fill>
                <Skeleton height={14} variant="text" width="70%" />
                <Skeleton height={12} variant="text" width="40%" />
              </Col>
            </Row>
          ))}
        </Col>
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card>
        <Body size="sm">No activity</Body>
      </Card>
    );
  }

  return (
    <Card>
      <Col between="sm">
        {config.title ? <Body size="sm" bold>{config.title}</Body> : null}
        {items.map((item) => (
          <Row key={item.id} centered between="sm" spread>
            <Row centered between="sm">
              <Icon name={item.icon ?? "activity"} size="md" />
              <Col between="xs">
                <Body size="sm">{item.title}</Body>
                {item.subtitle ? <MetaText>{item.subtitle}</MetaText> : null}
              </Col>
            </Row>
            <MetaText>{item.timestamp}</MetaText>
          </Row>
        ))}
      </Col>
    </Card>
  );
}
