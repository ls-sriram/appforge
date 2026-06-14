import React from "react";
import { Block, Chip, Icon, MetaText, TapTarget, Text } from "../primitives"

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
      <Block direction="horizontal" align="center" justify="space-between" space="sm">
        <Block direction="horizontal" align="center" space="sm">
          {selected ? (
            <Chip tone="success" pad="none">
              <Icon name="check" size="sm" />
            </Chip>
          ) : (
            <Block paint="panel-subtle" pad="none" align="center" justify="center" />
          )}
          <Block space="xs">
            <Text variant="body" numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <MetaText numberOfLines={1}>{subtitle}</MetaText>
            ) : null}
          </Block>
        </Block>
        {trailing}
      </Block>
    </TapTarget>
  );
}

// TODO: extract CheckWell block (22×22 fixed-size selectable indicator)
