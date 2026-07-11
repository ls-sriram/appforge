import React, { useState } from "react";
import { View } from "react-native";
import { Pressable } from "../pressable/Pressable";
import { Body } from "../text/Text";
import { Icon } from "../icon/Icon";
import type { CardContract } from "./card.styles";
import type { CardProps } from "./card.contract";
export type { CardContract };
export type { CardProps };
export { CardSchema } from "./card.contract";

export function Card({
  contract,
  accessibilityLabel,
  title,
  subtitle,
  leading,
  image,
  trailing,
  highlight,
  status,
  action,
  collapsible = false,
  defaultExpanded = false,
  selected = false,
  disabled = false,
  onPress,
  children,
  testID,
}: CardProps) {
  const s = contract;
  const [expanded, setExpanded] = useState(defaultExpanded);
  const showSecondRow = (status !== undefined || action !== undefined) && (!collapsible || expanded);
  const handlePress = () => {
    if (collapsible) setExpanded((current) => !current);
    onPress();
  };

  return (
    <View>
      <Pressable
        contract={s}
        accessibilityLabel={accessibilityLabel}
        expanded={collapsible ? expanded : undefined}
        selected={selected}
        disabled={disabled}
        onPress={handlePress}
        testID={testID}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: s.gap }}>
          {image ?? leading}
          <View style={{ flex: 1, gap: s.contentGap }}>
            {title !== undefined ? (
              <Body
                color={selected ? (s.title.selectedColor ?? s.title.color) : s.title.color}
                fontSize={s.title.fontSize}
                fontWeight={s.title.fontWeight as never}
              >
                {title}
              </Body>
            ) : null}
            {subtitle !== undefined ? (
              <Body color={s.subtitle.color} fontSize={s.subtitle.fontSize} fontWeight={s.subtitle.fontWeight as never}>
                {subtitle}
              </Body>
            ) : null}
            {children}
          </View>
          {highlight ?? trailing}
          {collapsible ? (
            <View style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}>
              <Icon name="chevron-down" color={s.disclosure.color} size={s.disclosure.size} />
            </View>
          ) : null}
        </View>
      </Pressable>
      {showSecondRow ? (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: s.secondRow.gap,
            justifyContent: "space-between",
            paddingHorizontal: s.secondRow.paddingHorizontal,
            paddingTop: s.secondRow.paddingTop,
          }}
        >
          <View>{status}</View>
          <View>{action}</View>
        </View>
      ) : null}
    </View>
  );
}
