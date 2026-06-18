import React from "react";
import { Body, Label, Tag, View, XStack, YStack } from "../../../../../ui";
import { ui } from "../../../../../ui/viz";

export function TokenPanelLayout() {
  return (
    ui("tokenpanel-0",
    <YStack bg="$surfaceAlt" f={1}>

      {/* Presets */}
      {ui("tokenpanel-1",
      <YStack borderBottomColor="$borderSubtle" borderBottomWidth={1} px="$3" pt="$3" pb="$3" gap="$2">
        {ui("tokenpanel-2", <Label color="$textMuted">PRESETS</Label>)}
        {ui("tokenpanel-3",
        <XStack gap="$2" flexWrap="wrap">
          {ui("tokenpanel-4",  <Tag label="Blue" tone="info" />)}
          {ui("tokenpanel-5",  <Tag label="Violet" />)}
          {ui("tokenpanel-6",  <Tag label="Emerald" />)}
          {ui("tokenpanel-7",  <Tag label="Rose" />)}
          {ui("tokenpanel-8",  <Tag label="Amber" />)}
          {ui("tokenpanel-9",  <Tag label="Light" />)}
        </XStack>
        )}
      </YStack>
      )}

      {/* Brand */}
      {ui("tokenpanel-10",
      <YStack borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        {ui("tokenpanel-11", <Label px="$3" pt="$3" pb="$1" color="$textMuted">BRAND</Label>)}
        {ui("tokenpanel-12",
        <XStack px="$3" h={32} ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1} gap="$2">
          {ui("tokenpanel-13", <View w={18} h={12} bg="$primary" borderColor="$borderSubtle" borderWidth={1} />)}
          {ui("tokenpanel-14", <Body f={1} color="$textSecondary">primary</Body>)}
          {ui("tokenpanel-15", <Label color="$textMuted">#4F8EF7</Label>)}
        </XStack>
        )}
        {ui("tokenpanel-16",
        <XStack px="$3" h={32} ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1} gap="$2">
          {ui("tokenpanel-17", <View w={18} h={12} bg="$primaryMuted" borderColor="$borderSubtle" borderWidth={1} />)}
          {ui("tokenpanel-18", <Body f={1} color="$textSecondary">primaryMuted</Body>)}
          {ui("tokenpanel-19", <Label color="$textMuted">rgba(79,142,247,0.14)</Label>)}
        </XStack>
        )}
        {ui("tokenpanel-20",
        <XStack px="$3" h={32} ai="center" gap="$2">
          {ui("tokenpanel-21", <View w={18} h={12} bg="$primary" borderColor="$borderSubtle" borderWidth={1} />)}
          {ui("tokenpanel-22", <Body f={1} color="$textSecondary">accent</Body>)}
          {ui("tokenpanel-23", <Label color="$textMuted">#4F8EF7</Label>)}
        </XStack>
        )}
      </YStack>
      )}

      {/* Surfaces */}
      {ui("tokenpanel-24",
      <YStack borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        {ui("tokenpanel-25", <Label px="$3" pt="$3" pb="$1" color="$textMuted">SURFACES</Label>)}
        {["bg", "surface", "surfaceStrong", "surfaceAlt"].map((token, i) => (
          ui(`tokenpanel-surf-${i}`,
          <XStack key={token} px="$3" h={32} ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1} gap="$2">
            {ui(`tokenpanel-surf-${i}-swatch`, <View w={18} h={12} bg="$surface" borderColor="$borderSubtle" borderWidth={1} />)}
            {ui(`tokenpanel-surf-${i}-name`,   <Body f={1} color="$textSecondary">{token}</Body>)}
          </XStack>
          )
        ))}
      </YStack>
      )}

      {/* Text */}
      {ui("tokenpanel-30",
      <YStack borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        {ui("tokenpanel-31", <Label px="$3" pt="$3" pb="$1" color="$textMuted">TEXT</Label>)}
        {ui("tokenpanel-32",
        <XStack px="$3" h={32} ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1} gap="$2">
          {ui("tokenpanel-33", <View w={18} h={12} bg="$textPrimary" borderColor="$borderSubtle" borderWidth={1} />)}
          {ui("tokenpanel-34", <Body f={1} color="$textSecondary">textPrimary</Body>)}
          {ui("tokenpanel-35", <Label color="$textMuted">#F2F2F2</Label>)}
        </XStack>
        )}
        {ui("tokenpanel-36",
        <XStack px="$3" h={32} ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1} gap="$2">
          {ui("tokenpanel-37", <View w={18} h={12} bg="$textSecondary" borderColor="$borderSubtle" borderWidth={1} />)}
          {ui("tokenpanel-38", <Body f={1} color="$textSecondary">textSecondary</Body>)}
          {ui("tokenpanel-39", <Label color="$textMuted">#A3A3A3</Label>)}
        </XStack>
        )}
        {ui("tokenpanel-40",
        <XStack px="$3" h={32} ai="center" gap="$2">
          {ui("tokenpanel-41", <View w={18} h={12} bg="$textMuted" borderColor="$borderSubtle" borderWidth={1} />)}
          {ui("tokenpanel-42", <Body f={1} color="$textSecondary">textMuted</Body>)}
          {ui("tokenpanel-43", <Label color="$textMuted">#525252</Label>)}
        </XStack>
        )}
      </YStack>
      )}

      {/* Status */}
      {ui("tokenpanel-50",
      <YStack>
        {ui("tokenpanel-51", <Label px="$3" pt="$3" pb="$1" color="$textMuted">STATUS</Label>)}
        {ui("tokenpanel-52",
        <XStack px="$3" h={32} ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1} gap="$2">
          {ui("tokenpanel-53", <View w={18} h={12} bg="$success" borderColor="$borderSubtle" borderWidth={1} />)}
          {ui("tokenpanel-54", <Body f={1} color="$textSecondary">success</Body>)}
        </XStack>
        )}
        {ui("tokenpanel-55",
        <XStack px="$3" h={32} ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1} gap="$2">
          {ui("tokenpanel-56", <View w={18} h={12} bg="$warning" borderColor="$borderSubtle" borderWidth={1} />)}
          {ui("tokenpanel-57", <Body f={1} color="$textSecondary">warning</Body>)}
        </XStack>
        )}
        {ui("tokenpanel-58",
        <XStack px="$3" h={32} ai="center" gap="$2">
          {ui("tokenpanel-59", <View w={18} h={12} bg="$error" borderColor="$borderSubtle" borderWidth={1} />)}
          {ui("tokenpanel-60", <Body f={1} color="$textSecondary">error</Body>)}
        </XStack>
        )}
      </YStack>
      )}

    </YStack>
    )
  );
}
