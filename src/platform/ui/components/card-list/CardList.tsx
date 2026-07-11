import React, { Children } from "react";
import { View } from "react-native";
import type { CardListProps } from "./card-list.contract";

export type { CardListProps };
export type { CardListContract } from "./card-list.styles";
export { CardListSchema } from "./card-list.contract";

export function CardList({ contract, accessibilityLabel, children, testID }: CardListProps) {
  const items = Children.toArray(children);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="list"
      style={{ gap: contract.gap, alignItems: contract.alignItems }}
      testID={testID}
    >
      {items.map((item, index) => (
        <View
          key={(item as React.ReactElement).key ?? index}
        >
          {item}
        </View>
      ))}
    </View>
  );
}
