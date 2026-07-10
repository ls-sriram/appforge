import React from "react";
import { Pressable as RNPressable, View } from "react-native";
import type { PressableContract } from "./pressable.styles";
import type { PressableProps } from "./pressable.contract";
export type { PressableContract };
export type { PressableProps };
export { PressableSchema, PressableRoleSchema } from "./pressable.contract";

type RenderState = { pressed: boolean; hovered?: boolean; focused?: boolean };
type WebKeyboardEvent = { key: string; preventDefault: () => void };

// react-native-web's Pressable forwards an `onKeyDown` prop at runtime (see
// the comment below), but @types/react-native's PressableProps doesn't
// declare it — RN native has no such concept, and these types aren't
// platform-split. Cast once here rather than sprinkling `as any` at the
// call site.
const WebAwarePressable = RNPressable as unknown as React.ComponentType<
  React.ComponentProps<typeof RNPressable> & { onKeyDown?: (e: WebKeyboardEvent) => void }
>;

// react-native-web's own Pressable/PressResponder already wires up tabIndex,
// cursor:pointer, and Enter-key activation for any element it renders (see
// node_modules/react-native-web/src/modules/usePressEvents/PressResponder.js
// isValidKeyPress). The one gap it leaves: Space-key activation is gated on
// accessibilityRole === "button" (isButtonish check), so "tab",
// "menuitemcheckbox", "option", and "link" roles never get it from RNW for
// free. This handler exists solely to cover that gap — it must not fire for
// role="button", or Space would double-invoke onPress there.
function handleSupplementalSpaceKey(
  e: WebKeyboardEvent,
  role: string,
  disabled: boolean,
  onPress: () => void,
) {
  if (disabled || role === "button") return;
  if (e.key === " " || e.key === "Spacebar") {
    e.preventDefault();
    onPress();
  }
}

export function Pressable({
  contract,
  role = "button",
  accessibilityLabel,
  selected = false,
  disabled = false,
  onPress,
  children,
  testID,
}: PressableProps) {
  const s = contract;
  const ix = s.interaction;

  return (
    <WebAwarePressable
      accessibilityRole={role as never}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected }}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      onPress={onPress}
      onKeyDown={(e) => handleSupplementalSpaceKey(e, role, disabled, onPress)}
      testID={testID}
    >
      {({ pressed, hovered, focused }: RenderState) => {
        const activeStyle = selected ? ix?.selected
          : disabled ? undefined
          : pressed ? ix?.pressed
          : hovered ? ix?.hover
          : focused ? ix?.focused
          : undefined;

        const opacity = disabled
          ? (ix?.disabledOpacity ?? 0.45)
          : (activeStyle as { opacity?: number } | undefined)?.opacity ?? 1;

        const activeBorderWidth = (activeStyle as { borderWidth?: number } | undefined)?.borderWidth;

        return (
          <View
            style={{
              backgroundColor: activeStyle?.backgroundColor ?? s.frame.backgroundColor,
              borderRadius: s.frame.borderRadius,
              borderWidth: activeBorderWidth ?? s.frame.borderWidth,
              borderColor: activeStyle?.borderColor ?? s.frame.borderColor,
              paddingVertical: s.frame.paddingVertical,
              paddingHorizontal: s.frame.paddingHorizontal,
              minHeight: s.frame.minHeight,
              opacity,
            }}
          >
            {children}
          </View>
        );
      }}
    </WebAwarePressable>
  );
}
