import React from "react";
import { Pressable } from "react-native";
import { Body, View, XStack, YStack } from "../../../../../ui";
import { UI_BLOCK_LIBRARY, type SemanticBlockCategory } from "../domain/ui-document.operations";
import type { CustomBlockDef } from "../domain/ui-document.types";

const CATEGORIES: Array<{ key: SemanticBlockCategory; label: string }> = [
  { key: "layout",     label: "Layout" },
  { key: "data",       label: "Data" },
  { key: "feedback",   label: "Feedback" },
  { key: "input",      label: "Input" },
  { key: "primitives", label: "Primitives" },
];

const BLOCK_GLYPHS: Record<string, string> = {
  "nav-bar":       "≡",
  "hero":          "⊡",
  "section":       "▭",
  "list":          "☰",
  "card":          "▢",
  "table":         "⊞",
  "status":        "⚠",
  "empty":         "◌",
  "skeleton":      "░",
  "form":          "⊟",
  "action":        "▶",
  "search":        "⌕",
  "avatar":        "◉",
  "badge":         "◈",
  "progress-bar":  "▬",
  "input-field":   "▭",
  "chip":          "◯",
  "display-text":  "H",
};

export function UiComponentPalette({
  onAddBlock,
  onAddCustomBlock,
  customBlocks,
  onDeleteCustomBlock,
}: {
  onAddBlock: (blockId: string) => void;
  onAddCustomBlock: (blockId: string) => void;
  customBlocks: CustomBlockDef[];
  onDeleteCustomBlock: (id: string) => void;
}) {
  return (
    <YStack f={1}>
      <View px="$3" py="$2" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        <Body fontSize="$1" color="$textMuted" textTransform="uppercase" letterSpacing={1}>Blocks</Body>
      </View>

      <YStack py="$1" f={1}>
        {CATEGORIES.map((cat) => {
          const blocks = UI_BLOCK_LIBRARY.filter((b) => b.category === cat.key);
          return (
            <YStack key={cat.key} pb="$2">
              <Body px="$3" pt="$2" pb="$1" fontSize="$1" color="$textMuted" textTransform="uppercase" letterSpacing={1} opacity={0.55}>
                {cat.label}
              </Body>
              {blocks.map((block) => (
                <Pressable key={block.id} onPress={() => onAddBlock(block.id)} style={{ width: "100%" }}>
                  {({ pressed }: { pressed: boolean }) => (
                    <XStack ai="center" gap="$2" px="$3" py="$2" bg={pressed ? "$surfaceStrong" : "transparent"}>
                      <View w={20} h={20} br="$1" bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} ai="center" jc="center">
                        <Body fontSize="$1" color="$textMuted">{BLOCK_GLYPHS[block.id] ?? "□"}</Body>
                      </View>
                      <Body fontSize="$2" color="$textSecondary">{block.label}</Body>
                    </XStack>
                  )}
                </Pressable>
              ))}
            </YStack>
          );
        })}

        {/* ── Saved (custom) blocks ── */}
        {customBlocks.length > 0 && (
          <YStack pb="$2">
            <Body px="$3" pt="$2" pb="$1" fontSize="$1" color="$textMuted" textTransform="uppercase" letterSpacing={1} opacity={0.55}>
              Saved
            </Body>
            {customBlocks.map((block) => (
              <XStack key={block.id} ai="center" gap="$1" px="$3" py="$2">
                <Pressable onPress={() => onAddCustomBlock(block.id)} style={{ flex: 1 }}>
                  {({ pressed }: { pressed: boolean }) => (
                    <XStack ai="center" gap="$2" bg={pressed ? "$surfaceStrong" : "transparent"} br="$2" py="$1">
                      <View w={20} h={20} br="$1" bg="$primaryMuted" borderColor="$primary" borderWidth={1} ai="center" jc="center">
                        <Body fontSize="$1" color="$primary">⬡</Body>
                      </View>
                      <Body fontSize="$2" color="$textSecondary" f={1} numberOfLines={1}>{block.label}</Body>
                    </XStack>
                  )}
                </Pressable>
                <Pressable onPress={() => onDeleteCustomBlock(block.id)}>
                  <Body fontSize="$1" color="$error" px="$1">✕</Body>
                </Pressable>
              </XStack>
            ))}
          </YStack>
        )}
      </YStack>
    </YStack>
  );
}
