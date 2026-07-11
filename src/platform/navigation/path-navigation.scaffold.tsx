import React from "react";
import { View } from "react-native";
import { noopUi, useTheme } from "../ui";
import { NavigationActionBar } from "./navigation-action-bar.block";
import { PathBreadcrumb } from "./path-breadcrumb.block";
import type { PathNavigationScaffoldProps } from "./path-navigation.contract";
import { pathNavigationStyles } from "./path-navigation.styles";
export type { PathNavigationScaffoldProps } from "./path-navigation.contract";
export { PathNavigationScaffoldSchema } from "./path-navigation.contract";

export function PathNavigationScaffold({ ui = noopUi, path, backLabel, onBack, backDisabled, action }: PathNavigationScaffoldProps) {
  const s = pathNavigationStyles(useTheme());

  return (
    <View nativeID={ui("root", "Path navigation root").__uiid} testID={ui("root", "Path navigation root").__uiid} style={{ width: "100%", backgroundColor: s.root.backgroundColor, borderBottomWidth: 1, borderColor: s.root.borderColor, paddingHorizontal: s.root.paddingHorizontal, paddingVertical: s.root.paddingVertical, gap: s.root.gap }}>
      <PathBreadcrumb ui={ui.scope("breadcrumb")} items={path} />
      <NavigationActionBar ui={ui.scope("actions")} back={{ label: backLabel, onPress: onBack, disabled: backDisabled }} action={action} />
    </View>
  );
}
