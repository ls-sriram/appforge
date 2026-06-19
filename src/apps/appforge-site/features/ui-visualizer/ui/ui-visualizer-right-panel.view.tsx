import React from "react";
import { ScrollView } from "react-native";
import { Body, View, XStack } from "@ui";
import type { UiComponentType, UiDocument, UiNode } from "../domain/ui-document.types";
import { UiInspectorView } from "./ui-inspector.view";
import { UiTokenPaletteView } from "./ui-token-palette.view";

export function UiVisualizerRightPanelView({
  width,
  collapsed,
  tab,
  themeOverrides,
  onSetOverride,
  onClearOverride,
  onClearAll,
  onApplyPreset,
  node,
  document,
  selectedNodeId,
  onSelectNode,
  onUpdateProp,
  onRemove,
  onAddChild,
  onSaveBlock,
}: {
  width: number;
  collapsed: boolean;
  tab: "design" | "code" | "tokens";
  themeOverrides: Record<string, string>;
  onSetOverride: (key: string, value: string) => void;
  onClearOverride: (key: string) => void;
  onClearAll: () => void;
  onApplyPreset: (overrides: Record<string, string>) => void;
  node?: UiNode;
  document: UiDocument;
  selectedNodeId?: string;
  onSelectNode: (id: string) => void;
  onUpdateProp: (key: keyof UiNode["props"], value: string | number | boolean | undefined) => void;
  onRemove: () => void;
  onAddChild: (type: UiComponentType) => void;
  onSaveBlock?: (name: string) => void;
}) {
  return (
    <View bg="$surfaceAlt" flexShrink={0} overflow="hidden"
      // @ts-ignore
      style={{ width: collapsed ? 0 : width, transition: "width 220ms ease", minWidth: 0 }}>
      {tab === "tokens" && (
        <XStack px="$3" h={36} ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
          <Body fontSize="$2" color="$textPrimary" fontFamily="$bold">Tokens</Body>
        </XStack>
      )}
      {tab === "tokens" ? (
        <ScrollView style={{ flex: 1 }}>
          <UiTokenPaletteView
            themeOverrides={themeOverrides}
            onSetOverride={onSetOverride}
            onClearOverride={onClearOverride}
            onClearAll={onClearAll}
            onApplyPreset={onApplyPreset}
          />
        </ScrollView>
      ) : (
        <UiInspectorView
          node={node}
          document={document}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          onUpdateProp={onUpdateProp}
          onRemove={onRemove}
          onAddChild={onAddChild}
          onSaveBlock={onSaveBlock}
        />
      )}
    </View>
  );
}
