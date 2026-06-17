import React from "react";
import { Card, Col, Icon, TapTarget, Body, Label } from "../primitives";

export interface BottomNavItemBlockProps {
  label: string;
  icon: React.ComponentProps<typeof Icon>["name"];
  active?: boolean;
  onPress: () => void;
}

export function BottomNavItemBlock({
  label,
  icon,
  active = false,
  onPress,
}: BottomNavItemBlockProps) {
  return (
    <TapTarget onPress={onPress}>
      <Card variant={active ? "default" : "subtle"} pad="xs">
        <Col between="xs" centered padV="xs">
          <Icon name={icon} size={active ? "xl" : "lg"} tone={active ? "primary" : "secondary"} />
          {active
            ? <Body size="sm" primary>{label}</Body>
            : <Label size="xs" dim>{label}</Label>
          }
        </Col>
      </Card>
    </TapTarget>
  );
}
