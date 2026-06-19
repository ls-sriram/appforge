import React from "react";
import { Body, Label, View, XStack, YStack } from "@ui";
import { ui } from "@ui/viz";

function PropRow({ id, label, value, divider }: { id: string; label: string; value: string; divider?: boolean }) {
  return (
    ui(id,
    <XStack f={1} ai="center" px="$3" gap="$2"
      borderRightColor={divider ? "$borderSubtle" : "transparent"} borderRightWidth={divider ? 1 : 0}
    >
      {ui(`${id}-label`, <Label color="$textSecondary" style={{ width: 64 }}>{label}</Label>)}
      {ui(`${id}-value`, <Body color="$textPrimary" f={1} ta="right">{value}</Body>)}
    </XStack>
    )
  );
}

function SectionLabel({ id, label }: { id: string; label: string }) {
  return (
    ui(id,
    <XStack px="$3" pt="$3" pb="$1" borderTopColor="$borderSubtle" borderTopWidth={1}>
      {ui(`${id}-text`, <Label color="$textSecondary">{label.toUpperCase()}</Label>)}
    </XStack>
    )
  );
}

function Row({ id, left, right }: { id: string; left: React.ReactElement; right: React.ReactElement }) {
  return (
    ui(id,
    <XStack h={32} borderBottomColor="$borderSubtle" borderBottomWidth={1}>
      {left}
      {right}
    </XStack>
    )
  );
}

export function DesignPanelLayout() {
  return (
    ui("designpanel-0",
    <YStack bg="$surfaceAlt" f={1}>

      {/* Header */}
      {ui("designpanel-1",
      <XStack px="$3" h={36} ai="center" gap="$2" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        {ui("designpanel-2", <Body color="$textPrimary" f={1}>YStack</Body>)}
        {ui("designpanel-3", <Body color="$textMuted">⬡</Body>)}
        {ui("designpanel-4", <Body color="$textSecondary">+</Body>)}
        {ui("designpanel-5", <Body color="$textMuted">✕</Body>)}
      </XStack>
      )}

      {/* Typography */}
      {SectionLabel({ id: "designpanel-6", label: "Typography" })}
      {ui("designpanel-7",
      <XStack h={32} borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        {PropRow({ id: "designpanel-7a", label: "Font", value: "—", divider: false })}
      </XStack>
      )}
      {Row({ id: "designpanel-8",
        left:  PropRow({ id: "designpanel-8a", label: "Size",   value: "—", divider: true }),
        right: PropRow({ id: "designpanel-8b", label: "Weight", value: "—" }),
      })}
      {Row({ id: "designpanel-9",
        left:  PropRow({ id: "designpanel-9a", label: "Color", value: "—", divider: true }),
        right: PropRow({ id: "designpanel-9b", label: "Align", value: "—" }),
      })}

      {/* Size */}
      {SectionLabel({ id: "designpanel-10", label: "Size" })}
      {Row({ id: "designpanel-11",
        left:  PropRow({ id: "designpanel-11a", label: "Width",  value: "auto", divider: true }),
        right: PropRow({ id: "designpanel-11b", label: "Height", value: "auto" }),
      })}

      {/* Layout */}
      {SectionLabel({ id: "designpanel-12", label: "Layout" })}
      {Row({ id: "designpanel-13",
        left:  PropRow({ id: "designpanel-13a", label: "Gap",       value: "—", divider: true }),
        right: PropRow({ id: "designpanel-13b", label: "Direction", value: "col" }),
      })}
      {Row({ id: "designpanel-14",
        left:  PropRow({ id: "designpanel-14a", label: "Justify", value: "center", divider: true }),
        right: PropRow({ id: "designpanel-14b", label: "Align",   value: "center" }),
      })}

      {/* Box */}
      {SectionLabel({ id: "designpanel-15", label: "Box" })}
      {Row({ id: "designpanel-16",
        left:  PropRow({ id: "designpanel-16a", label: "Fill",    value: "$bg", divider: true }),
        right: PropRow({ id: "designpanel-16b", label: "Opacity", value: "100%" }),
      })}
      {ui("designpanel-17",
      <XStack h={32} borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        {PropRow({ id: "designpanel-17a", label: "Padding", value: "$4" })}
      </XStack>
      )}
      {ui("designpanel-18",
      <XStack h={32} borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        {PropRow({ id: "designpanel-18a", label: "Border Radius", value: "None" })}
      </XStack>
      )}

      {/* Layers */}
      {ui("designpanel-19",
      <YStack mt="$2" borderTopColor="$borderSubtle" borderTopWidth={1}>
        {ui("designpanel-20", <Label px="$3" pt="$3" pb="$1" color="$textSecondary">LAYERS</Label>)}
        {[
          { id: "designpanel-layer-0", indent: 0, name: "YStack", isRoot: true },
          { id: "designpanel-layer-1", indent: 1, name: "YStack" },
          { id: "designpanel-layer-2", indent: 2, name: "XStack" },
          { id: "designpanel-layer-3", indent: 3, name: "Icon" },
          { id: "designpanel-layer-4", indent: 3, name: "Heading" },
          { id: "designpanel-layer-5", indent: 2, name: "Body" },
          { id: "designpanel-layer-6", indent: 2, name: "Button" },
        ].map(({ id, indent, name, isRoot }) =>
          ui(id,
          <XStack key={id} ai="center" gap="$1" h={24}
            pl={(indent * 10 + 10) as any}
            bg={isRoot ? "$errorMuted" : "transparent"}
            borderLeftColor={isRoot ? "$primary" : "transparent"} borderLeftWidth={2}
          >
            {ui(`${id}-caret`, <Body color="$textMuted" w={10}>{indent < 2 ? "▾" : " "}</Body>)}
            {ui(`${id}-name`,  <Body color={isRoot ? "$primary" : "$textSecondary"}>{name}</Body>)}
            {isRoot ? ui(`${id}-root`, <Body color="$textMuted" opacity={0.4} ml="$1">root</Body>) : null}
          </XStack>
          )
        )}
      </YStack>
      )}

    </YStack>
    )
  );
}
