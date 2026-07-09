import React from "react";
import { View } from "react-native";
import { type UiStamp, noopUi } from "../../viz";

import type { DockSplitterContract } from "./dock-splitter.styles";
import type { DockSplitterDragEvent, DockSplitterOrientation, DockSplitterProps } from "./dock-splitter.contract";
export type { DockSplitterContract };
export type { DockSplitterDragEvent, DockSplitterOrientation, DockSplitterProps };
export { DockSplitterSchema, DockSplitterDragEventSchema } from "./dock-splitter.contract";

function getEventCoordinate(event: DockSplitterDragEvent, orientation: DockSplitterOrientation) {
  const nativeEvent = event.nativeEvent;

  if (orientation === "vertical") {
    return event.clientX
      ?? nativeEvent?.clientX
      ?? nativeEvent?.pageX
      ?? nativeEvent?.locationX
      ?? null;
  }

  return event.clientY
    ?? nativeEvent?.clientY
    ?? nativeEvent?.pageY
    ?? nativeEvent?.locationY
    ?? null;
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
  const draggingRef = React.useRef(false);
  const lastCoordinateRef = React.useRef<number | null>(null);

  const beginDrag = React.useCallback((event: DockSplitterDragEvent) => {
    if (disabled) {
      return;
    }

    draggingRef.current = true;
    lastCoordinateRef.current = getEventCoordinate(event, orientation);
    onDragStart?.(event);
  }, [disabled, onDragStart, orientation]);

  const continueDrag = React.useCallback((event: DockSplitterDragEvent) => {
    if (disabled || !draggingRef.current) {
      return;
    }

    const nextCoordinate = getEventCoordinate(event, orientation);
    if (nextCoordinate === null) {
      return;
    }

    if (lastCoordinateRef.current === null) {
      lastCoordinateRef.current = nextCoordinate;
      return;
    }

    const delta = nextCoordinate - lastCoordinateRef.current;
    lastCoordinateRef.current = nextCoordinate;

    if (delta !== 0) {
      onDrag?.(delta, event);
    }
  }, [disabled, onDrag, orientation]);

  const endDrag = React.useCallback((event: DockSplitterDragEvent) => {
    if (disabled || !draggingRef.current) {
      return;
    }

    draggingRef.current = false;
    lastCoordinateRef.current = null;
    onDragEnd?.(event);
  }, [disabled, onDragEnd]);

  const interactionProps = {
    onMouseDown: beginDrag,
    onMouseMove: continueDrag,
    onMouseUp: endDrag,
    onPointerDown: beginDrag,
    onPointerMove: continueDrag,
    onPointerUp: endDrag,
  } as const;

  return (
    <View
      accessibilityRole="button"
      accessibilityLabel={`Resize panels ${orientation}`}
      accessibilityState={{ disabled }}
      nativeID={ui("root", "Dock splitter root").__uiid}
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
      {...(interactionProps as unknown as Record<string, unknown>)}
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
    </View>
  );
}
