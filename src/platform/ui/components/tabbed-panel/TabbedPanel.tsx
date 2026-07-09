import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { PanelScaffold } from "../../scaffolds/index";
import { noopUi } from "../../viz";
import { Icon, type IconName } from "../../primitives/Icon";
import { Tabs } from "../tabs/Tabs";
import type { TabbedPanelContract } from "./tabbed-panel.styles";
import type {
  TabbedPanelMoveDirection,
  TabbedPanelProps,
  TabbedPanelTab,
} from "./tabbed-panel.contract";
export type { TabbedPanelContract };
export type { TabbedPanelMoveDirection, TabbedPanelProps, TabbedPanelTab };
export {
  TabbedPanelSchema,
  TabbedPanelTabSchema,
  TabbedPanelMoveDirectionSchema,
} from "./tabbed-panel.contract";

interface IconActionButtonProps {
  contract: TabbedPanelContract;
  icon: IconName;
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
}

function hasContent(node: React.ReactNode) {
  return node !== undefined && node !== null && node !== false;
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

export function TabbedPanel({
  tabsContract,
  tabbedPanelContract,
  tabs,
  activeTabId,
  onActiveTabChange,
  onCloseTab,
  onMoveTab,
  actions,
  emptyState = null,
  ui = noopUi,
}: TabbedPanelProps) {
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? null;
  const activeIndex = activeTab ? tabs.findIndex((tab) => tab.id === activeTab.id) : -1;
  const canClose = !!activeTab && !!onCloseTab && activeTab.closeable !== false;
  const canMove = !!activeTab && !!onMoveTab && activeTab.movable !== false;
  const canMoveLeft = canMove && activeIndex > 0;
  const canMoveRight = canMove && activeIndex >= 0 && activeIndex < tabs.length - 1;
  const s = tabbedPanelContract;

  const header = tabs.length > 0 ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabsScroll}
    >
      <Tabs
      contract={tabsContract}
      onValueChange={onActiveTabChange}
      options={tabs.map((tab) => ({
        label: tab.label,
        value: tab.id,
        icon: tab.icon,
        disabled: tab.disabled,
      }))}
      testID={ui("tabs", "Tabbed panel tabs").__uiid}
      value={activeTabId ?? ""}
      />
    </ScrollView>
  ) : null;

  const builtInActions = activeTab ? (
    <View style={styles.actionsRow}>
      {hasContent(actions) ? <View style={getInlineActionsStyle(s.layout.inlineActionsMarginRight)}>{actions}</View> : null}
      {canMove ? (
        <>
          <IconActionButton
            contract={tabbedPanelContract}
            accessibilityLabel="Move active tab left"
            disabled={!canMoveLeft}
            icon="chevron-left"
            onPress={() => {
              if (canMoveLeft && onMoveTab) {
                onMoveTab(activeTab.id, "left");
              }
            }}
            testID={ui("move-left", "Move tab left button").__uiid}
          />
          <IconActionButton
            contract={tabbedPanelContract}
            accessibilityLabel="Move active tab right"
            disabled={!canMoveRight}
            icon="chevron-right"
            onPress={() => {
              if (canMoveRight && onMoveTab) {
                onMoveTab(activeTab.id, "right");
              }
            }}
            testID={ui("move-right", "Move tab right button").__uiid}
          />
        </>
      ) : null}
      {canClose ? (
        <IconActionButton
          contract={tabbedPanelContract}
          accessibilityLabel="Close active tab"
          icon="x"
          onPress={() => onCloseTab?.(activeTab.id)}
          testID={ui("close", "Close tab button").__uiid}
        />
      ) : null}
    </View>
  ) : hasContent(actions) ? (
    <View style={styles.actionsRow}>
      <View style={getInlineActionsStyle(s.layout.inlineActionsMarginRight)}>{actions}</View>
    </View>
  ) : null;

  return (
    <PanelScaffold
      actions={builtInActions}
      content={activeTab ? activeTab.content : emptyState}
      header={header}
      ui={ui}
    />
  );
}

const styles = {
  tabsScroll: {
    flexGrow: 0,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
} as const;

function getInlineActionsStyle(marginRight: number) {
  return {
    flexDirection: "row",
    alignItems: "center",
    marginRight,
  } as const;
}
