import React from "react";
import { Pressable } from "react-native";
import { Body, View, XStack, YStack } from "../../../../../ui";
import { UI_BLOCK_LIBRARY } from "../domain/ui-document.operations";

const CATEGORIES: Array<{ key: "layout" | "data" | "feedback" | "input"; label: string }> = [
  { key: "layout",   label: "Layout" },
  { key: "data",     label: "Data" },
  { key: "feedback", label: "Feedback" },
  { key: "input",    label: "Input" },
];

// Tiny icon glyphs per block — keep them simple SVG-free characters
const BLOCK_GLYPHS: Record<string, string> = {
  "nav-bar":  "≡",
  "hero":     "⊡",
  "section":  "▭",
  "list":     "☰",
  "card":     "▢",
  "table":    "⊞",
  "status":   "⚠",
  "empty":    "◌",
  "skeleton": "░",
  "form":     "⊟",
  "action":   "▶",
  "search":   "⌕",
};

export function UiComponentPalette({ onAdd }: { onAdd: (blockId: string) => void }) {
  return (
    <YStack f={1}>
      <View
        px="$3"
        py="$2"
        borderBottomColor="$borderSubtle"
        borderBottomWidth={1}
      >
        <Body fontSize="$1" color="$textMuted" textTransform="uppercase" letterSpacing={1}>
          Blocks
        </Body>
      </View>

      <YStack py="$1" f={1}>
        {CATEGORIES.map((cat) => {
          const blocks = UI_BLOCK_LIBRARY.filter((b) => b.category === cat.key);
          return (
            <YStack key={cat.key} pb="$2">
              <Body
                px="$3"
                pt="$2"
                pb="$1"
                fontSize="$1"
                color="$textMuted"
                textTransform="uppercase"
                letterSpacing={1}
                opacity={0.55}
              >
                {cat.label}
              </Body>
              {blocks.map((block) => (
                <Pressable key={block.id} onPress={() => onAdd(block.id)} style={{ width: "100%" }}>
                  {({ pressed }: { pressed: boolean }) => (
                  <XStack
                    ai="center"
                    gap="$2"
                    px="$3"
                    py="$2"
                    bg={pressed ? "$surfaceStrong" : "transparent"}
                  >
                    <View
                      w={20}
                      h={20}
                      br="$1"
                      bg="$surfaceStrong"
                      borderColor="$borderSubtle"
                      borderWidth={1}
                      ai="center"
                      jc="center"
                    >
                      <Body fontSize="$1" color="$textMuted">
                        {BLOCK_GLYPHS[block.id] ?? "□"}
                      </Body>
                    </View>
                    <Body fontSize="$2" color="$textSecondary">
                      {block.label}
                    </Body>
                  </XStack>
                  )}
                </Pressable>
              ))}
            </YStack>
          );
        })}
      </YStack>
    </YStack>
  );
}
