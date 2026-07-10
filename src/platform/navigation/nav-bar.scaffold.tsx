import React from "react";
import { View } from "react-native";
import { noopUi, useViewport, pageShell } from "../ui";
import type { NavBarScaffoldProps } from "./nav-bar.contract";
export type { NavBarScaffoldProps };
export { NavBarScaffoldSchema } from "./nav-bar.contract";

function hasContent(node: React.ReactNode) {
  return node !== undefined && node !== null && node !== false;
}

export function NavBarScaffold({ ui = noopUi, logo, title, items }: NavBarScaffoldProps) {
  const viewport = useViewport();
  const isBar = viewport.isMobile;

  return (
    <View
      nativeID={ui("root", "Nav bar scaffold root").__uiid}
      testID={ui("root", "Nav bar scaffold root").__uiid}
      style={{
        flexDirection: isBar ? "row" : "column",
        alignItems: isBar ? "center" : "stretch",
        justifyContent: isBar ? "space-between" : "flex-start",
        width: isBar ? "100%" : pageShell.sidebarWidth,
      }}
    >
      <View
        nativeID={ui("brand", "Nav bar scaffold brand").__uiid}
        testID={ui("brand", "Nav bar scaffold brand").__uiid}
        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
      >
        {hasContent(logo) ? logo : null}
        {hasContent(title) ? title : null}
      </View>
      <View
        nativeID={ui("items", "Nav bar scaffold items").__uiid}
        testID={ui("items", "Nav bar scaffold items").__uiid}
        style={{
          flexDirection: isBar ? "row" : "column",
          alignItems: isBar ? "center" : "stretch",
          minWidth: isBar ? pageShell.mobileNavMinWidth : undefined,
          maxWidth: isBar ? pageShell.mobileNavMaxWidth : undefined,
        }}
      >
        {items}
      </View>
    </View>
  );
}
