import React from "react";
import { Pressable } from "react-native";
import { Body, View, XStack } from "@ui";

export function UiProjectSelectorView({
  apps,
  selectedAppId,
  onSelect,
}: {
  apps: { id: string; displayName: string }[];
  selectedAppId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const current = apps.find((a) => a.id === selectedAppId);

  return (
    <View style={{ position: "relative" }}>
      <Pressable onPress={() => setOpen((v) => !v)}>
        <XStack ai="center" gap="$1">
          <Body fontSize="$2" color={open ? "$textPrimary" : "$textSecondary"} fontFamily="$bold">
            {current?.displayName ?? selectedAppId}
          </Body>
          <Body fontSize={9} color="$textMuted">▾</Body>
        </XStack>
      </Pressable>
      {open && (
        <View
          style={{ position: "absolute", top: 28, left: 0, zIndex: 300, minWidth: 160 }}
          bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} overflow="hidden"
        >
          {apps.map((app) => {
            const active = app.id === selectedAppId;
            return (
              <Pressable key={app.id} onPress={() => { onSelect(app.id); setOpen(false); }}>
                {({ pressed }: { pressed: boolean }) => (
                  <XStack
                    ai="center" gap="$2" px="$3" py="$2"
                    borderBottomColor="$borderSubtle" borderBottomWidth={1}
                    bg={pressed ? "$errorMuted" : active ? "$surfaceAlt" : "transparent"}
                  >
                    <Body fontSize="$1" color={active ? "$textPrimary" : "$textSecondary"}>{app.displayName}</Body>
                  </XStack>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
