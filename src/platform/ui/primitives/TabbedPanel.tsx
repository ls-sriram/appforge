import React from "react";
import { Pressable, View } from "react-native";
import { useUI } from "../theme/ThemeProvider";
import { PanelScaffold } from "../scaffolds";
import { type UiStamp, noopUi } from "../viz";
import { Icon, type IconName, type IconTone } from "./Icon";
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
  variant?: string;
  onCloseTab?: (tabId: string) => void;
  onMoveTab?: (tabId: string, direction: TabbedPanelMoveDirection) => void;
  actions?: React.ReactNode;
  emptyState?: React.ReactNode;
  ui?: UiStamp;
}

export interface TabbedPanelVariant {
  actionButtonMinWidth: number;
  actionButtonMinHeight: number;
  actionButtonBorderRadius: number;
  actionButtonDisabledOpacity: number;
  actionIconTone: IconTone;
  disabledActionIconTone: IconTone;
  inlineActionsMarginRight: number;
}

interface IconActionButtonProps {
  icon: IconName;
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
  variant: string;
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
  variant,
}: IconActionButtonProps) {
  const { variants } = useUI();
  const s = variants.tabbedPanel?.[variant];
  if (!s) throw new Error(`Unknown tabbedPanel variant "${variant}"`);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      nativeID={testID}
      onPress={onPress}
      style={{
        minWidth: s.actionButtonMinWidth,
        minHeight: s.actionButtonMinHeight,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: s.actionButtonBorderRadius,
        opacity: disabled ? s.actionButtonDisabledOpacity : 1,
      }}
      testID={testID}
    >
      <Icon name={icon} size="sm" tone={disabled ? s.disabledActionIconTone : s.actionIconTone} />
    </Pressable>
  );
}

export function TabbedPanel({
  tabs,
  activeTabId,
  onActiveTabChange,
  variant = "default",
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
  const { variants } = useUI();
  const s = variants.tabbedPanel?.[variant];
  if (!s) throw new Error(`Unknown tabbedPanel variant "${variant}"`);

  const header = tabs.length > 0 ? (
    <Tabs
      onValueChange={onActiveTabChange}
      options={tabs.map((tab) => ({
        label: tab.label,
        value: tab.id,
        icon: tab.icon,
        disabled: tab.disabled,
      }))}
      testID={ui("tabs", "Tabbed panel tabs").__uiid}
      value={activeTabId ?? ""}
      variant={variant}
    />
  ) : null;

  const builtInActions = activeTab ? (
    <View style={styles.actionsRow}>
      {hasContent(actions) ? <View style={getInlineActionsStyle(s.inlineActionsMarginRight)}>{actions}</View> : null}
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
            testID={ui("move-left", "Move tab left button").__uiid}
            variant={variant}
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
            testID={ui("move-right", "Move tab right button").__uiid}
            variant={variant}
          />
        </>
      ) : null}
      {canClose ? (
        <IconActionButton
          accessibilityLabel="Close active tab"
          icon="x"
          onPress={() => onCloseTab?.(activeTab.id)}
          testID={ui("close", "Close tab button").__uiid}
          variant={variant}
        />
      ) : null}
    </View>
  ) : hasContent(actions) ? (
    <View style={styles.actionsRow}>
      <View style={getInlineActionsStyle(s.inlineActionsMarginRight)}>{actions}</View>
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
} as const;

function getInlineActionsStyle(marginRight: number) {
  return {
    flexDirection: "row",
    alignItems: "center",
    marginRight,
  } as const;
}
