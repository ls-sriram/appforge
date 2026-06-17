import React from "react";
import { QuickActionCard, QuickActionTone } from "./QuickActionCard";
import { Col, Row, IconName } from "../primitives";

export interface QuickActionItem {
  id: string;
  icon: IconName;
  label: string;
  tone?: QuickActionTone;
  onPress: () => void;
}

export function QuickActionsGrid({ items }: { items: QuickActionItem[] }) {
  const pairs: QuickActionItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }

  return (
    <Col between="sm">
      {pairs.map((row, rowIndex) => (
        <Row key={`row-${rowIndex}`} between="sm">
          {row.map((action) => (
            <QuickActionCard
              key={action.id}
              icon={action.icon}
              label={action.label}
              tone={action.tone}
              onPress={action.onPress}
            />
          ))}
          {row.length === 1 ? <Col fill /> : null}
        </Row>
      ))}
    </Col>
  );
}
