import React from "react";
import { View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Icon, Body, Pressable } from "../ui";
import { isRoute } from "./routes";
import type { NavItemProps } from "./nav-item.contract";
export type { NavItemProps };
export { NavItemSchema } from "./nav-item.contract";

export function NavItem({ contract, route, label, icon }: NavItemProps) {
  const s = contract;
  const pathname = usePathname();
  const router = useRouter();
  const active = isRoute(pathname, route);

  return (
    <Pressable
      role="link"
      accessibilityLabel={label}
      selected={active}
      onPress={() => router.push(route)}
    >
      {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => {
        const ix = s.interaction;

        const activeStyle = active ? ix.selected
          : pressed ? ix.pressed
          : hovered ? ix.hover
          : undefined;

        const opacity = (activeStyle as { opacity?: number } | undefined)?.opacity
          ?? s.frame.restingOpacity;
        const scale = (activeStyle as { scale?: number } | undefined)?.scale;

        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: activeStyle?.backgroundColor,
              borderRadius: s.frame.borderRadius,
              paddingVertical: s.frame.paddingVertical,
              paddingHorizontal: s.frame.paddingHorizontal,
              opacity,
              transform: scale !== undefined ? [{ scale }] : undefined,
            }}
          >
            {icon ? <Icon name={icon} color={activeStyle?.color ?? s.text.color} size={16} /> : null}
            <Body
              fontSize={s.text.fontSize}
              fontWeight={((activeStyle as { fontWeight?: string | number } | undefined)?.fontWeight ?? s.text.fontWeight) as any}
              color={activeStyle?.color ?? s.text.color}
            >
              {label}
            </Body>
          </View>
        );
      }}
    </Pressable>
  );
}
