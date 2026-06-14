import React from "react";
import { Block, Icon, TapTarget, Text } from "../primitives"

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
      <Block paint={active ? "panel" : "none"} pad="none">
        <Block padV="xs">
          <Block frame="center">
            <Block space="xs" align="center">
              <Icon name={icon} size={active ? "xl" : "lg"} tone={active ? "primary" : "secondary"} />
              <Text variant={active ? "bodySm" : "caption"} tone={active ? "primary" : "secondary"}>
                {label}
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
    </TapTarget>
  );
}
