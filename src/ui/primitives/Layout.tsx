import React from "react";
import { ScrollView, ScrollViewProps } from "react-native";

type ScrollAreaProps = Omit<ScrollViewProps, "style"> & {
  fill?: boolean;
};

export function ScrollArea({ fill = true, children, ...rest }: ScrollAreaProps) {
  return (
    <ScrollView style={{ flex: fill ? 1 : undefined }} {...rest}>
      {children}
    </ScrollView>
  );
}
