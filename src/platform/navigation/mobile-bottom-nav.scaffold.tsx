import React from "react";
import { View } from "react-native";
import { SafeAreaView, noopUi, useTheme } from "../ui";
import type { MobileBottomNavScaffoldProps } from "./mobile-bottom-nav.contract";
import { mobileBottomNavChrome } from "./mobile-bottom-nav.styles";

export type { MobileBottomNavScaffoldProps };
export { MobileBottomNavScaffoldSchema } from "./mobile-bottom-nav.contract";

function hasContent(node: React.ReactNode) {
  return node !== undefined && node !== null && node !== false;
}

export function MobileBottomNavScaffold({
  ui = noopUi,
  logo,
  items,
}: MobileBottomNavScaffoldProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      nativeID={ui("root", "Mobile bottom nav root").__uiid}
      testID={ui("root", "Mobile bottom nav root").__uiid}
      style={{
        width: "100%",
        backgroundColor: theme.palette.surface,
        borderTopWidth: 1,
        borderTopColor: theme.palette.borderSubtle,
        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -4 },
        elevation: 12,
      }}
    >
      <View
        nativeID={ui("rail", "Mobile bottom nav rail").__uiid}
        testID={ui("rail", "Mobile bottom nav rail").__uiid}
        style={{
          width: "100%",
          minHeight: mobileBottomNavChrome.minHeight,
          flexDirection: "row",
          alignItems: "center",
          gap: mobileBottomNavChrome.brandGap,
          paddingHorizontal: mobileBottomNavChrome.paddingHorizontal,
          paddingTop: mobileBottomNavChrome.paddingTop,
          paddingBottom: mobileBottomNavChrome.paddingBottom,
        }}
      >
        {hasContent(logo) ? (
          <View
            nativeID={ui("logo", "Mobile bottom nav logo").__uiid}
            testID={ui("logo", "Mobile bottom nav logo").__uiid}
          >
            {logo}
          </View>
        ) : null}
        <View
          nativeID={ui("items", "Mobile bottom nav items").__uiid}
          testID={ui("items", "Mobile bottom nav items").__uiid}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-around",
            gap: mobileBottomNavChrome.railGap,
          }}
        >
          {items}
        </View>
      </View>
    </SafeAreaView>
  );
}
