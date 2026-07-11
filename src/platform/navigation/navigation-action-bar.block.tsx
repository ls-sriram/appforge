import React from "react";
import { Pressable, View } from "react-native";
import { Body, Icon, noopUi, useTheme } from "../ui";
import type { NavigationActionBarProps } from "./navigation-action-bar.contract";
import { pathNavigationStyles } from "./path-navigation.styles";
export type { NavigationActionBarProps, NavigationBackAction, NavigationTerminalAction } from "./navigation-action-bar.contract";
export { NavigationActionBarSchema, NavigationBackActionSchema, NavigationTerminalActionSchema } from "./navigation-action-bar.contract";

export function NavigationActionBar({ ui = noopUi, back, action }: NavigationActionBarProps) {
  const s = pathNavigationStyles(useTheme());
  const backLabel = back.label ?? "Back";
  const actionLabel = action.label ?? (action.kind === "forward" ? "Continue" : "Exit");
  const actionColor = action.kind === "exit" ? s.action.exitColor : s.action.color;

  return (
    <View nativeID={ui("root", "Navigation action bar root").__uiid} testID={ui("root", "Navigation action bar root").__uiid} style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Pressable accessibilityRole="button" accessibilityLabel={backLabel} disabled={back.disabled} onPress={back.onPress} style={{ opacity: back.disabled ? s.action.disabledOpacity : 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: s.action.gap, paddingHorizontal: s.action.paddingHorizontal, paddingVertical: s.action.paddingVertical }}>
          <Icon name="chevron-left" size={16} color={s.action.color} />
          <Body fontSize={s.action.fontSize} fontWeight={s.action.fontWeight} color={s.action.color}>{backLabel}</Body>
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={actionLabel} disabled={action.disabled} onPress={action.onPress} style={{ opacity: action.disabled ? s.action.disabledOpacity : 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: s.action.gap, paddingHorizontal: s.action.paddingHorizontal, paddingVertical: s.action.paddingVertical }}>
          <Body fontSize={s.action.fontSize} fontWeight={s.action.fontWeight} color={actionColor}>{actionLabel}</Body>
          <Icon name={action.kind === "forward" ? "chevron-right" : "x"} size={16} color={actionColor} />
        </View>
      </Pressable>
    </View>
  );
}
