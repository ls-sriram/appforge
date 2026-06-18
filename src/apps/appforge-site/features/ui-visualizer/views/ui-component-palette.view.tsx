import React from "react";
import { Pressable, TextInput } from "react-native";
import { Body, View, XStack, YStack } from "../../../../../ui";
import { DARK_THEME_RESOLVED } from "../domain/ui-theme-palette";
import type { CustomBlockDef, UiBlock, UiComponentType } from "../domain/ui-document.types";

// ── Primitive groups ──────────────────────────────────────────────────────────

const GROUPS: Array<{ label: string; types: UiComponentType[] }> = [
  { label: "Layout",      types: ["YStack", "XStack"] },
  { label: "Text",        types: ["Display", "Heading", "Body", "Label"] },
  { label: "Interactive", types: ["Button", "Input", "TextArea", "SelectableChip"] },
  { label: "Atoms",       types: ["Tag", "Icon", "Avatar", "Badge", "ProgressBar"] },
];

const GLYPHS: Partial<Record<UiComponentType, string>> = {
  YStack:         "≡",
  XStack:         "⋯",
  View:           "□",
  Display:        "D",
  Heading:        "H",
  Body:           "¶",
  Label:          "L",
  Button:         "▷",
  Input:          "▭",
  TextArea:       "▬",
  SelectableChip: "◉",
  Tag:            "◈",
  Icon:           "✦",
  Avatar:         "⬤",
  Badge:          "●",
  ProgressBar:    "━",
};

const LABELS: Partial<Record<UiComponentType, string>> = {
  YStack:         "Stack (col)",
  XStack:         "Stack (row)",
  View:           "Surface",
  Display:        "Display",
  Heading:        "Heading",
  Body:           "Body",
  Label:          "Label",
  Button:         "Button",
  Input:          "Input",
  TextArea:       "Text Area",
  SelectableChip: "Chip",
  Tag:            "Tag",
  Icon:           "Icon",
  Avatar:         "Avatar",
  Badge:          "Badge",
  ProgressBar:    "Progress Bar",
};

// ── Primitives tab ────────────────────────────────────────────────────────────

export function UiPrimitivePalette({ onAdd }: { onAdd: (type: UiComponentType) => void }) {
  return (
    <YStack f={1}>
      {GROUPS.map((group) => (
        <YStack key={group.label}>
          <Body
            px="$3" pt="$2" pb="$1"
            fontSize="$1" color="$textSecondary"
            textTransform="uppercase" letterSpacing={1}
          >
            {group.label}
          </Body>
          {group.types.map((type) => (
            <Pressable key={type} onPress={() => onAdd(type)} style={{ width: "100%" }}>
              {({ pressed }: { pressed: boolean }) => (
                <XStack
                  ai="center" gap="$2" px="$3" py="$2"
                  bg={pressed ? "$errorMuted" : "transparent"}
                  borderBottomColor="$borderSubtle" borderBottomWidth={1}
                >
                  <View
                    w={20} h={20}
                    bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1}
                    ai="center" jc="center"
                  >
                    <Body fontSize="$1" color="$textMuted">{GLYPHS[type] ?? "□"}</Body>
                  </View>
                  <Body fontSize="$2" color="$textPrimary">
                    {LABELS[type] ?? type}
                  </Body>
                </XStack>
              )}
            </Pressable>
          ))}
        </YStack>
      ))}
    </YStack>
  );
}

// ── My Blocks tab ─────────────────────────────────────────────────────────────

function BlockRow({
  id, label, isFileBacked, onAdd, onDelete,
}: {
  id: string; label: string; isFileBacked: boolean;
  onAdd: (id: string) => void; onDelete?: (id: string) => void;
}) {
  return (
    <XStack ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
      <Pressable onPress={() => onAdd(id)} style={{ flex: 1 }}>
        {({ pressed }: { pressed: boolean }) => (
          <XStack ai="center" gap="$2" px="$3" py="$2" bg={pressed ? "$errorMuted" : "transparent"}>
            <View
              w={20} h={20}
              bg={isFileBacked ? "$surfaceStrong" : "$primaryMuted"}
              borderColor={isFileBacked ? "$border" : "$primary"}
              borderWidth={1}
              ai="center" jc="center"
            >
              <Body fontSize="$1" color={isFileBacked ? "$textMuted" : "$primary"}>
                {isFileBacked ? "⊞" : "⬡"}
              </Body>
            </View>
            <Body fontSize="$2" color="$textPrimary" f={1} numberOfLines={1}>{label}</Body>
          </XStack>
        )}
      </Pressable>
      {onDelete && (
        <Pressable onPress={() => onDelete(id)} style={{ padding: 12 }}>
          <Body fontSize="$1" color="$textMuted">✕</Body>
        </Pressable>
      )}
    </XStack>
  );
}

export function UiCustomBlocksPanel({
  fileBlocks = [],
  customBlocks,
  onAdd,
  onDelete,
}: {
  fileBlocks?: UiBlock[];
  customBlocks: CustomBlockDef[];
  onAdd: (blockId: string) => void;
  onDelete: (id: string) => void;
}) {
  const isEmpty = fileBlocks.length === 0 && customBlocks.length === 0;

  if (isEmpty) {
    return (
      <YStack px="$3" py="$5" ai="center" gap="$2">
        <Body fontSize="$1" color="$textMuted" ta="center">
          No blocks saved yet.{"\n"}Select a node and tap ⬡ to save it as a reusable block.
        </Body>
      </YStack>
    );
  }

  return (
    <YStack f={1}>
      {fileBlocks.length > 0 && (
        <YStack>
          <XStack px="$3" pt="$2" pb="$1">
            <Body fontSize={9} color="$textSecondary" tt="uppercase" letterSpacing={1.5}>From blocks/</Body>
          </XStack>
          {fileBlocks.map((b) => (
            <BlockRow key={b.id} id={b.id} label={b.label} isFileBacked onAdd={onAdd} />
          ))}
        </YStack>
      )}
      {customBlocks.length > 0 && (
        <YStack>
          {fileBlocks.length > 0 && (
            <XStack px="$3" pt="$2" pb="$1" borderTopColor="$borderSubtle" borderTopWidth={1}>
              <Body fontSize={9} color="$textSecondary" tt="uppercase" letterSpacing={1.5}>Saved</Body>
            </XStack>
          )}
          {customBlocks.map((b) => (
            <BlockRow key={b.id} id={b.id} label={b.label} isFileBacked={false} onAdd={onAdd} onDelete={onDelete} />
          ))}
        </YStack>
      )}
    </YStack>
  );
}
