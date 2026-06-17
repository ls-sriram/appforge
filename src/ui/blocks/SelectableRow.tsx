import React from "react";
import { Col, Row, Card, Chip, Icon, MetaText, TapTarget, Body } from "../primitives";

export interface SelectableRowProps {
  title: string;
  subtitle?: string;
  selected: boolean;
  onToggleSelected: () => void;
  trailing?: React.ReactNode;
}

export function SelectableRow({
  title,
  subtitle,
  selected,
  onToggleSelected,
  trailing,
}: SelectableRowProps) {
  return (
    <TapTarget onPress={onToggleSelected} feedback="soft">
      <Row centered spread between="sm">
        <Row centered between="sm">
          {selected ? (
            <Chip tone="success" pad="none">
              <Icon name="check" size="sm" />
            </Chip>
          ) : (
            <Card variant="subtle" pad="none" />
          )}
          <Col between="xs">
            <Body numberOfLines={1}>{title}</Body>
            {subtitle ? <MetaText numberOfLines={1}>{subtitle}</MetaText> : null}
          </Col>
        </Row>
        {trailing}
      </Row>
    </TapTarget>
  );
}

// TODO: extract CheckWell block (22×22 fixed-size selectable indicator)
