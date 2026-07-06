import React from "react";
import { Pressable, View } from "react-native";
import { type UiStamp, noopUi } from "../viz";

import type { DockSplitterContract } from "../contracts/primitives/docksplitter";
export type { DockSplitterContract };

export type DockSplitterOrientation = "vertical" | "horizontal";

export interface DockSplitterProps {
  contract: DockSplitterContract;
  orientation?: DockSplitterOrientation;
  disabled?: boolean;
  onDragStart?: () => void;
  onDrag?: () => void;
  onDragEnd?: () => void;
  ui?: UiStamp;
}

export function DockSplitter({
  contract,
  orientation = "vertical",
  disabled = false,
  onDragStart,
  onDrag,
  onDragEnd,
  ui = noopUi,
}: DockSplitterProps) {
  const vertical = orientation === "vertical";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Resize panels ${orientation}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      nativeID={ui("root", "Dock splitter root").__uiid}
      onPress={() => {
        if (disabled) {
          return;
        }

        onDragStart?.();
        onDrag?.();
        onDragEnd?.();
      }}
      style={{
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        minWidth: vertical ? contract.container.minHitSize : undefined,
        minHeight: vertical ? undefined : contract.container.minHitSize,
        width: vertical ? contract.container.thickness : "100%",
        height: vertical ? "100%" : contract.container.thickness,
        backgroundColor: disabled
          ? contract.container.backgroundColor
          : contract.container.activeBackgroundColor,
        opacity: disabled ? contract.container.disabledOpacity : 1,
      }}
      testID={ui("root", "Dock splitter root").__uiid}
    >
      <View
        nativeID={ui("grip", "Dock splitter grip").__uiid}
        style={{
          width: vertical ? contract.grip.thickness : contract.grip.length,
          height: vertical ? contract.grip.length : contract.grip.thickness,
          borderRadius: contract.grip.borderRadius,
          backgroundColor: contract.grip.color,
        }}
        testID={ui("grip", "Dock splitter grip").__uiid}
      />
    </Pressable>
  );
}
