import React from "react";
import { View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Icon, Pressable } from "../ui";
import { isRoute } from "./routes";
import type { MobileBottomNavItemProps } from "./mobile-bottom-nav-item.contract";

export type { MobileBottomNavItemProps };
export { MobileBottomNavItemSchema } from "./mobile-bottom-nav-item.contract";

export function MobileBottomNavItem({
  contract,
  route,
  icon,
  accessibilityLabel,
}: MobileBottomNavItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const active = isRoute(pathname, route);

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        role="link"
        accessibilityLabel={accessibilityLabel}
        selected={active}
        onPress={() => router.push(route)}
      >
        {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => {
          const opacity = active ? 1 : pressed ? 0.78 : hovered ? 0.88 : contract.interaction.restingOpacity;
          const backgroundColor = active ? contract.interaction.activeBackgroundColor : undefined;
          const color = active ? contract.interaction.activeColor : contract.interaction.inactiveColor;

          return (
            <View
              style={{
                width: "100%",
                minHeight: contract.frame.minHeight,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: contract.frame.borderRadius,
                backgroundColor,
                opacity,
              }}
            >
              <Icon name={icon} color={color} size={contract.frame.iconSize} />
            </View>
          );
        }}
      </Pressable>
    </View>
  );
}
