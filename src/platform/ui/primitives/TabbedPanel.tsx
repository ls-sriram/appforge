import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { PanelScaffold } from "../scaffolds";
import { type UiStamp, noopUi } from "../viz";
import { Icon, type IconName } from "./Icon";
import { Tabs } from "./Tabs";

export interface TabbedPanelTab {
  id: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
  closeable?: boolean;
  movable?: boolean;
  content: React.ReactNode;
}

export type TabbedPanelMoveDirection = "left" | "right";

export interface TabbedPanelProps {
  tabs: TabbedPanelTab[];
  activeTabId: string | null;
  onActiveTabChange: (tabId: string) => void;
  onCloseTab?: (tabId: string) => void;
  onMoveTab?: (tabId: string, direction: TabbedPanelMoveDirection) => void;
  actions?: React.ReactNode;
  emptyState?: React.ReactNode;
  ui?: UiStamp;
}

interface IconActionButtonProps {
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
  icon,
  accessibilityLabel,
  disabled = false,
  onPress,
  testID,
}: IconActionButtonProps) {
  const t = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      nativeID={testID}
      onPress={onPress}
      style={{
        minWidth: 28,
        minHeight: 28,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: t.colors.radii.pill,
        opacity: disabled ? 0.4 : 1,
      }}
      testID={testID}
    >
      <Icon name={icon} size="sm" tone={disabled ? "muted" : "secondary"} />
    </Pressable>
  );
}

export function TabbedPanel({
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

  const header = tabs.length > 0 ? (
    <Tabs
      onValueChange={onActiveTabChange}
      options={tabs.map((tab) => ({
        label: tab.label,
        value: tab.id,
        icon: tab.icon,
        disabled: tab.disabled,
      }))}
      testID={ui("tabs").__uiid}
      value={activeTabId ?? ""}
    />
  ) : null;

  const builtInActions = activeTab ? (
    <View style={styles.actionsRow}>
      {hasContent(actions) ? <View style={styles.inlineActions}>{actions}</View> : null}
      {canMove ? (
        <>
          <IconActionButton
            accessibilityLabel="Move active tab left"
            disabled={!canMoveLeft}
            icon="chevron-left"
            onPress={() => {
              if (canMoveLeft && onMoveTab) {
                onMoveTab(activeTab.id, "left");
              }
            }}
            testID={ui("move-left").__uiid}
          />
          <IconActionButton
            accessibilityLabel="Move active tab right"
            disabled={!canMoveRight}
            icon="chevron-right"
            onPress={() => {
              if (canMoveRight && onMoveTab) {
                onMoveTab(activeTab.id, "right");
              }
            }}
            testID={ui("move-right").__uiid}
          />
        </>
      ) : null}
      {canClose ? (
        <IconActionButton
          accessibilityLabel="Close active tab"
          icon="x"
          onPress={() => onCloseTab?.(activeTab.id)}
          testID={ui("close").__uiid}
        />
      ) : null}
    </View>
  ) : hasContent(actions) ? (
    <View style={styles.actionsRow}>
      <View style={styles.inlineActions}>{actions}</View>
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
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  inlineActions: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 4,
  },
} as const;
