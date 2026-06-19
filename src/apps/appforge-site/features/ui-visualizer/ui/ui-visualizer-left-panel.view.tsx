import React from "react";
import { Pressable, ScrollView } from "react-native";
import { Body, View, XStack } from "@ui";
import type { CustomBlockDef, UiBlock, UiDocument, UiComponentType } from "../domain/ui-document.types";
import { UiPrimitivePalette, UiCustomBlocksPanel } from "./ui-component-palette.view";
import { ScreenLibrary } from "./ui-context-tree.view";

export type UiVisualizerLeftMode = "components" | "blocks" | "screens";

export function UiVisualizerLeftPanelView({
  width,
  collapsed,
  mode,
  onSelectMode,
  onAddComponent,
  fileBlocks,
  customBlocks,
  onAddCustomBlock,
  onDeleteCustomBlock,
  documents,
  selectedDocumentId,
  onSelectDocument,
}: {
  width: number;
  collapsed: boolean;
  mode: UiVisualizerLeftMode;
  onSelectMode: (mode: UiVisualizerLeftMode) => void;
  onAddComponent: (type: UiComponentType) => void;
  fileBlocks: UiBlock[];
  customBlocks: CustomBlockDef[];
  onAddCustomBlock: (blockId: string) => void;
  onDeleteCustomBlock: (id: string) => void;
  documents: UiDocument[];
  selectedDocumentId: string;
  onSelectDocument: (id: string) => void;
}) {
  return (
    <View bg="$surfaceAlt" flexShrink={0} overflow="hidden"
      // @ts-ignore
      style={{ width: collapsed ? 0 : width, transition: "width 220ms ease", minWidth: 0 }}>
      <XStack px="$2" py="$2" gap="$1" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        {([
          { key: "components", label: "Components" },
          { key: "blocks", label: "My Blocks" },
          { key: "screens", label: "Screens" },
        ] as { key: UiVisualizerLeftMode; label: string }[]).map(({ key, label }) => (
          <Pressable key={key} onPress={() => onSelectMode(key)}>
            <View px="$2" py="$1" bg={mode === key ? "$surfaceStrong" : "transparent"}>
              <Body fontSize="$1" color={mode === key ? "$textPrimary" : "$textMuted"}>
                {label}
              </Body>
            </View>
          </Pressable>
        ))}
      </XStack>
      <ScrollView>
        {mode === "components" && (
          <UiPrimitivePalette onAdd={onAddComponent} />
        )}
        {mode === "blocks" && (
          <UiCustomBlocksPanel
            fileBlocks={fileBlocks}
            customBlocks={customBlocks}
            onAdd={onAddCustomBlock}
            onDelete={onDeleteCustomBlock}
          />
        )}
        {mode === "screens" && (
          <ScreenLibrary
            documents={documents}
            selectedDocumentId={selectedDocumentId}
            onSelectDocument={onSelectDocument}
          />
        )}
      </ScrollView>
    </View>
  );
}
