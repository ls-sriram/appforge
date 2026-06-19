import React from "react";
import { Body, Label, View, XStack, YStack } from "@ui";
import { ui } from "@ui/viz";

const GROUPS: Array<{ label: string; items: Array<{ glyph: string; name: string }> }> = [
  { label: "Layout", items: [{ glyph: "≡", name: "Stack (col)" }, { glyph: "⋯", name: "Stack (row)" }, { glyph: "□", name: "Surface" }] },
  { label: "Text",   items: [{ glyph: "D", name: "Display" }, { glyph: "H", name: "Heading" }, { glyph: "¶", name: "Body" }, { glyph: "L", name: "Label" }] },
  { label: "Interactive", items: [{ glyph: "▷", name: "Button" }, { glyph: "▭", name: "Input" }, { glyph: "▬", name: "Text Area" }, { glyph: "◉", name: "Chip" }] },
  { label: "Atoms",  items: [{ glyph: "◈", name: "Tag" }, { glyph: "✦", name: "Icon" }, { glyph: "⬤", name: "Avatar" }, { glyph: "●", name: "Badge" }, { glyph: "━", name: "Progress Bar" }] },
];

export function PalettePanelLayout() {
  return (
    ui("palettepanel-0",
    <YStack bg="$surfaceAlt" f={1}>

      {/* Tab row */}
      {ui("palettepanel-1",
      <XStack px="$2" py="$2" gap="$1" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        {ui("palettepanel-2", <View px="$2" py="$1" bg="$surfaceStrong"><Body color="$textPrimary">Components</Body></View>)}
        {ui("palettepanel-3", <View px="$2" py="$1"><Body color="$textMuted">My Blocks</Body></View>)}
        {ui("palettepanel-4", <View px="$2" py="$1"><Body color="$textMuted">Screens</Body></View>)}
      </XStack>
      )}

      {/* Groups */}
      {GROUPS.map((group, gi) =>
        ui(`palettepanel-g${gi}`,
        <YStack key={group.label}>
          {ui(`palettepanel-g${gi}-label`,
          <Label px="$3" pt="$2" pb="$1" color="$textSecondary">{group.label.toUpperCase()}</Label>
          )}
          {group.items.map((item, ii) =>
            ui(`palettepanel-g${gi}-i${ii}`,
            <XStack
              key={item.name}
              ai="center" gap="$2" px="$3" py="$2"
              borderBottomColor="$borderSubtle" borderBottomWidth={1}
            >
              {ui(`palettepanel-g${gi}-i${ii}-glyph`,
              <View w={20} h={20} bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} ai="center" jc="center">
                <Body color="$textMuted">{item.glyph}</Body>
              </View>
              )}
              {ui(`palettepanel-g${gi}-i${ii}-name`,
              <Body color="$textPrimary">{item.name}</Body>
              )}
            </XStack>
            )
          )}
        </YStack>
        )
      )}

    </YStack>
    )
  );
}
