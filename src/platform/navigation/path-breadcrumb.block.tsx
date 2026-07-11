import React from "react";
import { Pressable, View } from "react-native";
import { Body, Icon, noopUi, useTheme } from "../ui";
import type { PathBreadcrumbProps } from "./path-breadcrumb.contract";
import { pathNavigationStyles } from "./path-navigation.styles";
export type { PathBreadcrumbItem, PathBreadcrumbProps } from "./path-breadcrumb.contract";
export { PathBreadcrumbItemSchema, PathBreadcrumbSchema } from "./path-breadcrumb.contract";

export function PathBreadcrumb({ ui = noopUi, items }: PathBreadcrumbProps) {
  const s = pathNavigationStyles(useTheme());

  return (
    <View
      nativeID={ui("root", "Path breadcrumb root").__uiid}
      testID={ui("root", "Path breadcrumb root").__uiid}
      accessibilityRole="header"
      style={{ width: "100%", flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: s.breadcrumb.gap }}
    >
      {items.map((item, index) => {
        const current = index === items.length - 1;
        return (
          <React.Fragment key={item.id}>
            {index > 0 ? <Icon name="chevron-right" size={14} color={s.breadcrumb.color} /> : null}
            <Pressable accessibilityRole={item.onPress && !current ? "link" : undefined} accessibilityLabel={item.label} disabled={!item.onPress || current} onPress={item.onPress}>
              <Body fontSize={s.breadcrumb.fontSize} fontWeight={current ? "600" : "400"} color={current ? s.breadcrumb.currentColor : s.breadcrumb.color}>{item.label}</Body>
            </Pressable>
          </React.Fragment>
        );
      })}
    </View>
  );
}
