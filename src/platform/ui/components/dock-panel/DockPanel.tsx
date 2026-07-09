import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Body } from "../text/Text";
import { Icon, type IconName } from "../icon/Icon";
import { type UiStamp, noopUi } from "../../viz";

import type { DockPanelContract } from "./dock-panel.styles";
import type {
  DockPanelDisplayMode,
  DockPanelItem,
  DockPanelMoveDirection,
  DockPanelPlacement,
  DockPanelProps,
} from "./dock-panel.contract";
export type { DockPanelContract };
export type { DockPanelDisplayMode, DockPanelItem, DockPanelMoveDirection, DockPanelPlacement, DockPanelProps };
export {
  DockPanelSchema,
  DockPanelItemSchema,
  DockPanelDisplayModeSchema,
  DockPanelPlacementSchema,
  DockPanelMoveDirectionSchema,
} from "./dock-panel.contract";

interface IconActionButtonProps {
  contract: DockPanelContract;
  icon: IconName;
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
}

function hasContent(node: React.ReactNode) {
  return node !== undefined && node !== null && node !== false;
}

function isVertical(placement: DockPanelPlacement) {
  return placement === "left" || placement === "right";
}

function getCollapseIcon(placement: DockPanelPlacement) {
  switch (placement) {
    case "left":
      return "chevron-left";
    case "right":
      return "chevron-right";
    case "top":
    case "bottom":
      return "chevron-down";
  }
}

function getSizeStyle(
  size: number | string | undefined,
  minSize: number | undefined,
  maxSize: number | undefined,
  vertical: boolean,
) {
  const nextStyle: Record<string, number | string> = {};

  if (size !== undefined) {
    nextStyle[vertical ? "width" : "height"] = size;
  }
  if (minSize !== undefined) {
    nextStyle[vertical ? "minWidth" : "minHeight"] = minSize;
  }
  if (maxSize !== undefined) {
    nextStyle[vertical ? "maxWidth" : "maxHeight"] = maxSize;
  }

  return nextStyle;
}

function resolveDisplayMode({
  collapsed,
  displayMode,
  canIconCollapse,
}: {
  collapsed: boolean;
  displayMode: DockPanelDisplayMode;
  canIconCollapse: boolean;
}) {
  if (collapsed && canIconCollapse) {
    return "icon-rail";
  }

  return displayMode;
}

function IconActionButton({
  contract,
  icon,
  accessibilityLabel,
  disabled = false,
  onPress,
  testID,
}: IconActionButtonProps) {
  const s = contract;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      nativeID={testID}
      onPress={onPress}
      style={{
        minWidth: s.actionButton.minWidth,
        minHeight: s.actionButton.minHeight,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: s.actionButton.borderRadius,
        opacity: disabled ? s.actionButton.disabledOpacity : 1,
      }}
      testID={testID}
    >
      <Icon
        color={disabled ? s.actionIcon.disabledColor : s.actionIcon.color}
        name={icon}
        size={s.actionIcon.size}
      />
    </Pressable>
  );
}

interface DockItemButtonProps {
  contract: DockPanelContract;
  item: DockPanelItem;
  selected: boolean;
  iconOnly: boolean;
  onPress: () => void;
  testID?: string;
}

function DockItemButton({
  contract,
  item,
  selected,
  iconOnly,
  onPress,
  testID,
}: DockItemButtonProps) {
  const isDisabled = !!item.disabled;
  const s = contract;
  const iconColor = isDisabled
    ? s.itemIcon.disabledColor
    : selected
      ? s.itemIcon.selectedColor
      : s.itemIcon.unselectedColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ disabled: isDisabled, selected }}
      disabled={isDisabled}
      nativeID={testID}
      onPress={onPress}
      style={{
        minWidth: s.itemButton.minWidth,
        minHeight: s.itemButton.minHeight,
        paddingHorizontal: s.itemButton.paddingHorizontal,
        paddingVertical: s.itemButton.paddingVertical,
        borderRadius: s.itemButton.borderRadius,
        backgroundColor: selected
          ? s.itemButton.activeBackgroundColor
          : s.itemButton.inactiveBackgroundColor,
        alignItems: "center",
        justifyContent: "center",
        opacity: isDisabled ? s.itemButton.disabledOpacity : 1,
      }}
      testID={testID}
    >
      <View
        style={{
          flexDirection: iconOnly ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: s.itemButton.gap,
        }}
      >
        <Icon color={iconColor} name={item.icon} size={s.itemIcon.size} />
        {!iconOnly ? (
          <Body color={iconColor}>
            {item.label}
          </Body>
        ) : null}
      </View>
    </Pressable>
  );
}

export function DockPanel({
  tabsContract,
  dockPanelContract,
  items = [],
  activeItemId = null,
  onActiveItemChange,
  title,
  icon,
  children,
  displayMode = "expanded",
  placement = "left",
  visible = true,
  collapsed = false,
  size,
  minSize,
  maxSize,
  collapsedSize,
  collapseThreshold,
  canClose = false,
  canCollapse = false,
  canIconCollapse = false,
  canResize = false,
  onDisplayModeChange,
  onCollapsedChange,
  onVisibleChange,
  onClose,
  onResizeStart,
  onResize,
  onResizeEnd,
  onCloseItem,
  onMoveItem,
  headerActions,
  actions,
  emptyState = null,
  menuLabel = "Open dock menu",
  onMenuPress,
  showHeader = true,
  ui = noopUi,
}: DockPanelProps) {
  void tabsContract;

  if (!visible) {
    return null;
  }

  const activeItem = items.find((item) => item.id === activeItemId) ?? null;
  const activeIndex = activeItem ? items.findIndex((item) => item.id === activeItem.id) : -1;
  const canMove = !!activeItem && !!onMoveItem && activeItem.movable !== false;
  const canMoveBackward = canMove && activeIndex > 0;
  const canMoveForward = canMove && activeIndex >= 0 && activeIndex < items.length - 1;
  const vertical = isVertical(placement);
  const resolvedDisplayMode = resolveDisplayMode({
    collapsed,
    displayMode,
    canIconCollapse,
  });
  const iconOnly = resolvedDisplayMode === "icon-rail";
  const showMenuTrigger = resolvedDisplayMode === "menu-trigger";
  const s = dockPanelContract;
  const effectiveMinSize = collapsed && !canIconCollapse ? minSize : undefined;
  const effectiveSize = collapsed && canIconCollapse
    ? (collapsedSize ?? s.rail.collapsedWidth)
    : size;
  const panelBody = activeItem
    ? activeItem.content
    : hasContent(children)
      ? children
      : emptyState;
  const hasItems = items.length > 0;
  const isCollapsedPaneRail = collapsed && canIconCollapse && !hasItems;
  const showSelector = hasItems && resolvedDisplayMode !== "expanded" ? true : hasItems;
  const showPanelHeader = showHeader && (hasContent(title) || !!icon || hasContent(headerActions) || canCollapse || canClose);
  const canCloseActiveItem = !!activeItem && !!onCloseItem && activeItem.closeable !== false;

  if (isCollapsedPaneRail) {
    return (
      <View
        nativeID={ui("root", "Dock panel root").__uiid}
        style={[
          getCollapsedRailStyle(s, vertical),
          getContainerStyle(s),
          getSizeStyle(collapsedSize ?? s.rail.collapsedWidth, effectiveMinSize, maxSize, vertical),
        ]}
        testID={ui("root", "Dock panel root").__uiid}
      >
        <View
          nativeID={ui("collapsed-rail", "Dock panel collapsed rail").__uiid}
          style={getSelectorContainerStyle(s, vertical, false)}
          testID={ui("collapsed-rail", "Dock panel collapsed rail").__uiid}
        >
          {icon ? (
            <Icon
              color={s.itemIcon.selectedColor}
              name={icon}
              size={s.itemIcon.size}
            />
          ) : null}
          {title ? (
            <View
              nativeID={ui("collapsed-title", "Dock panel collapsed title").__uiid}
              testID={ui("collapsed-title", "Dock panel collapsed title").__uiid}
            >
              <Body color={s.title.color}>{title}</Body>
            </View>
          ) : null}
          {canCollapse ? (
            <IconActionButton
              contract={dockPanelContract}
              accessibilityLabel="Expand dock panel"
              icon="plus"
              onPress={() => {
                onCollapsedChange?.(false);
                onDisplayModeChange?.("expanded");
              }}
              testID={ui("expand", "Expand dock panel button").__uiid}
            />
          ) : null}
          {canClose ? (
            <IconActionButton
              contract={dockPanelContract}
              accessibilityLabel="Close dock panel"
              icon="x"
              onPress={() => {
                onClose?.();
                onVisibleChange?.(false);
              }}
              testID={ui("header-close", "Dock panel header close button").__uiid}
            />
          ) : null}
        </View>
      </View>
    );
  }

  const selector = showMenuTrigger ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={menuLabel}
      nativeID={ui("menu", "Dock panel menu trigger").__uiid}
      onPress={onMenuPress}
      style={{
        width: s.menuButton.width,
        height: s.menuButton.height,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: s.actionButton.borderRadius,
        backgroundColor: s.itemButton.inactiveBackgroundColor,
      }}
      testID={ui("menu", "Dock panel menu trigger").__uiid}
    >
      <Icon color={s.actionIcon.color} name="menu" size={s.actionIcon.size} />
    </Pressable>
  ) : showSelector ? (
    <ScrollView
      horizontal={!vertical}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={vertical ? { flexGrow: 0, width: s.rail.collapsedWidth } : { flexGrow: 0 }}
      contentContainerStyle={{
        flexDirection: vertical ? "column" : "row",
        gap: s.rail.gap,
        padding: s.rail.padding,
      }}
      testID={ui("selector-scroll", "Dock panel selector scroll").__uiid}
    >
      {items.map((item) => (
        <DockItemButton
          contract={dockPanelContract}
          iconOnly={iconOnly}
          item={item}
          key={item.id}
          onPress={() => onActiveItemChange?.(item.id)}
          selected={item.id === activeItemId}
          testID={ui(`item-${item.id}`, `Dock panel item ${item.label}`).__uiid}
        />
      ))}
    </ScrollView>
  ) : null;

  const selectorRail = selector ? (
    <View
      nativeID={ui("selector", "Dock panel selector").__uiid}
      style={getSelectorContainerStyle(s, vertical, showMenuTrigger)}
      testID={ui("selector", "Dock panel selector").__uiid}
    >
      {selector}
      {resolvedDisplayMode === "icon-rail" && canCollapse ? (
        <IconActionButton
          contract={dockPanelContract}
          accessibilityLabel="Expand dock panel"
          icon="plus"
          onPress={() => {
            onCollapsedChange?.(false);
            onDisplayModeChange?.("expanded");
          }}
          testID={ui("expand", "Expand dock panel button").__uiid}
        />
      ) : null}
      {resolvedDisplayMode === "icon-rail" && onMenuPress ? (
        <IconActionButton
          contract={dockPanelContract}
          accessibilityLabel={menuLabel}
          icon="menu"
          onPress={onMenuPress}
          testID={ui("open-menu", "Open dock menu button").__uiid}
        />
      ) : null}
    </View>
  ) : null;

  const header = showPanelHeader ? (
    <View
      nativeID={ui("header", "Dock panel header").__uiid}
      style={getHeaderStyle(s)}
      testID={ui("header", "Dock panel header").__uiid}
    >
      <View style={styles.headerTitleRow}>
        {icon ? <Icon color={s.title.color} name={icon} size={s.itemIcon.size} /> : null}
        {title ? (
          <Body color={s.title.color}>
            {title}
          </Body>
        ) : null}
      </View>
      <View style={styles.headerActionsRow}>
        {hasContent(headerActions) ? headerActions : null}
        {canCollapse ? (
          <IconActionButton
            contract={dockPanelContract}
            accessibilityLabel={collapsed ? "Expand dock panel" : "Collapse dock panel"}
            icon={collapsed ? "plus" : getCollapseIcon(placement)}
            onPress={() => {
              const nextCollapsed = !collapsed;
              const nextMode = nextCollapsed && canIconCollapse ? "icon-rail" : "expanded";
              onCollapsedChange?.(nextCollapsed);
              onDisplayModeChange?.(nextMode);
            }}
            testID={ui("header-collapse", "Dock panel header collapse button").__uiid}
          />
        ) : null}
        {canClose ? (
          <IconActionButton
            contract={dockPanelContract}
            accessibilityLabel="Close dock panel"
            icon="x"
            onPress={() => {
              onClose?.();
              onVisibleChange?.(false);
            }}
            testID={ui("header-close", "Dock panel header close button").__uiid}
          />
        ) : null}
      </View>
    </View>
  ) : null;

  const builtInActions = activeItem ? (
    <View style={getActionsRowStyle()}>
      {hasContent(actions) ? <View style={getInlineActionsStyle(s.layout.inlineActionsMarginRight, vertical)}>{actions}</View> : null}
      {canMove ? (
        <>
          <IconActionButton
            contract={dockPanelContract}
            accessibilityLabel="Move active item backward"
            disabled={!canMoveBackward}
            icon="chevron-left"
            onPress={() => {
              if (canMoveBackward && onMoveItem) {
                onMoveItem(activeItem.id, "backward");
              }
            }}
            testID={ui("move-backward", "Move item backward button").__uiid}
          />
          <IconActionButton
            contract={dockPanelContract}
            accessibilityLabel="Move active item forward"
            disabled={!canMoveForward}
            icon={vertical ? "chevron-down" : "chevron-right"}
            onPress={() => {
              if (canMoveForward && onMoveItem) {
                onMoveItem(activeItem.id, "forward");
              }
            }}
            testID={ui("move-forward", "Move item forward button").__uiid}
          />
        </>
      ) : null}
      {canCloseActiveItem ? (
        <IconActionButton
          contract={dockPanelContract}
          accessibilityLabel="Close active item"
          icon="x"
          onPress={() => onCloseItem?.(activeItem.id)}
          testID={ui("close", "Close active item button").__uiid}
        />
      ) : null}
    </View>
  ) : hasContent(actions) ? (
    <View style={getActionsRowStyle()}>
      <View style={getInlineActionsStyle(s.layout.inlineActionsMarginRight, vertical)}>{actions}</View>
    </View>
  ) : null;

  return (
    <View
      nativeID={ui("root", "Dock panel root").__uiid}
      style={[
        getRootStyle(vertical),
        getContainerStyle(s),
        getSizeStyle(effectiveSize, effectiveMinSize, maxSize, vertical),
      ]}
      testID={ui("root", "Dock panel root").__uiid}
    >
      {placement === "left" || placement === "top" ? selectorRail : null}
      <View
        nativeID={ui("content-frame", "Dock panel content frame").__uiid}
        style={getContentFrameStyle(s, vertical)}
        testID={ui("content-frame", "Dock panel content frame").__uiid}
      >
        {header}
        {builtInActions ? (
          <View
            nativeID={ui("actions", "Dock panel actions").__uiid}
            style={getActionsContainerStyle(vertical)}
            testID={ui("actions", "Dock panel actions").__uiid}
          >
            {builtInActions}
          </View>
        ) : null}
        <View
          nativeID={ui("content", "Dock panel content").__uiid}
          style={getContentStyle(s)}
          testID={ui("content", "Dock panel content").__uiid}
        >
          {panelBody}
        </View>
        {canResize ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Resize dock panel"
            nativeID={ui("resize", "Dock panel resize handle").__uiid}
            onPress={() => {
              const baseSize = typeof effectiveSize === "number" ? effectiveSize : minSize ?? collapsedSize ?? 0;
              const nextSize = collapseThreshold !== undefined
                ? Math.max(baseSize, collapseThreshold)
                : baseSize;
              onResizeStart?.();
              onResize?.(nextSize);
              onResizeEnd?.(nextSize);
            }}
            style={getResizeHandleStyle(s, vertical)}
            testID={ui("resize", "Dock panel resize handle").__uiid}
          />
        ) : null}
      </View>
      {placement === "right" || placement === "bottom" ? selectorRail : null}
    </View>
  );
}

const styles = {
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
} as const;

function getRootStyle(vertical: boolean) {
  return {
    flexDirection: vertical ? "row" : "column",
    alignItems: "stretch",
    flex: 1,
  } as const;
}

function getCollapsedRailStyle(contract: DockPanelContract, vertical: boolean) {
  return {
    flexDirection: vertical ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    padding: contract.rail.padding,
  } as const;
}

function getContainerStyle(contract: DockPanelContract) {
  return {
    backgroundColor: contract.container.backgroundColor,
    borderColor: contract.container.borderColor,
    borderWidth: contract.container.borderWidth,
  } as const;
}

function getHeaderStyle(contract: DockPanelContract) {
  return {
    minHeight: contract.header.minHeight,
    paddingHorizontal: contract.header.paddingHorizontal,
    paddingVertical: contract.header.paddingVertical,
    backgroundColor: contract.header.backgroundColor,
    borderColor: contract.header.borderColor,
    borderBottomWidth: contract.header.borderWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } as const;
}

function getContentStyle(contract: DockPanelContract) {
  return {
    flex: 1,
    backgroundColor: contract.content.backgroundColor,
  } as const;
}

function getContentFrameStyle(contract: DockPanelContract, vertical: boolean) {
  return {
    flex: 1,
    flexDirection: "column",
    gap: contract.layout.contentGap,
    alignItems: "stretch",
  } as const;
}

function getActionsContainerStyle(vertical: boolean) {
  return {
    flexDirection: vertical ? "row" : "column",
    alignItems: "stretch",
  } as const;
}

function getActionsRowStyle() {
  return {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  } as const;
}

function getInlineActionsStyle(marginRight: number, vertical: boolean) {
  return {
    flexDirection: vertical ? "row" : "column",
    alignItems: "center",
    marginRight: vertical ? marginRight : 0,
    marginBottom: vertical ? 0 : marginRight,
  } as const;
}

function getResizeHandleStyle(contract: DockPanelContract, vertical: boolean) {
  return {
    alignSelf: vertical ? "stretch" : "auto",
    minWidth: vertical ? contract.splitterGrip.size : contract.splitterGrip.thickness,
    minHeight: vertical ? contract.splitterGrip.thickness : contract.splitterGrip.size,
    backgroundColor: contract.splitterGrip.color,
  } as const;
}

function getSelectorContainerStyle(
  contract: DockPanelContract,
  vertical: boolean,
  showMenuTrigger: boolean,
) {
  return {
    flexDirection: vertical ? "column" : "row",
    alignItems: "center",
    justifyContent: showMenuTrigger ? "center" : "flex-start",
    gap: contract.rail.gap,
    padding: contract.rail.padding,
    backgroundColor: contract.rail.backgroundColor,
    borderColor: contract.rail.borderColor,
    borderWidth: contract.rail.borderWidth,
    width: vertical ? contract.rail.collapsedWidth : undefined,
  } as const;
}
