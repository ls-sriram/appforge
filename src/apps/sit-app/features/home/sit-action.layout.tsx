import React from "react";
import { Button, Body, Input, Label, SelectableChip, XStack, YStack } from "@ui";
import { ui } from "@ui/viz";
import { SIT_DURATION_OPTIONS } from "../session/domain/content";

export interface SitActionLayoutProps {
  prompt?: string;
  placeholder?: string;
  intentionText?: string;
  sessionMinutes: number;
  onBack: () => void;
  onInfo: () => void;
  onBegin: () => void;
  onChangeIntentionText?: (value: string) => void;
  onSelectSessionMinutes: (value: number) => void;
}

export function SitActionLayout({
  prompt = "What will you do?",
  placeholder = "write it here",
  intentionText = "",
  sessionMinutes,
  onBack,
  onInfo,
  onBegin,
  onChangeIntentionText,
  onSelectSessionMinutes,
}: SitActionLayoutProps) {
  return ui(
    "sitaction-0",
    <YStack f={1} bg="$bg" px="$4" pt="$7" pb="$5" jc="space-between" gap="$5">
      {ui(
        "sitaction-1",
        <XStack ai="center" jc="space-between">
          {ui("sitaction-2", <Label tone="muted" tt="uppercase" letterSpacing={1.5} onPress={onBack}>back</Label>)}
          {ui("sitaction-3", <Label tone="muted" tt="uppercase" letterSpacing={1.5} onPress={onInfo}>?</Label>)}
        </XStack>,
      )}
      {ui(
        "sitaction-4",
        <YStack gap="$5" f={1} jc="center">
          {ui("sitaction-5", <Label tone="muted" tt="uppercase" letterSpacing={2}>take action</Label>)}
          {ui("sitaction-6", <Body tone="inverse" size="2xl" ta="center">{prompt}</Body>)}
          {ui(
            "sitaction-7",
            <Input
              value={intentionText}
              onChangeText={onChangeIntentionText}
              placeholder={placeholder}
              autoCorrect={false}
              autoCapitalize="none"
            />,
          )}
          {ui("sitaction-8", <YStack h={1} bg="$borderSubtle" />)}
          {ui(
            "sitaction-9",
            <YStack gap="$3">
              {ui("sitaction-10", <Label tone="muted" tt="uppercase" letterSpacing={2}>duration</Label>)}
              {ui(
                "sitaction-11",
                <XStack gap="$2" flexWrap="wrap">
                  {SIT_DURATION_OPTIONS.map((minutes) =>
                    ui(
                      `sitaction-duration-${minutes}`,
                      <SelectableChip
                        label={`${minutes} min`}
                        selected={sessionMinutes === minutes}
                        onPress={() => onSelectSessionMinutes(minutes)}
                      />,
                    ),
                  )}
                </XStack>,
              )}
            </YStack>,
          )}
        </YStack>,
      )}
      {ui("sitaction-12", <Button size="lg" label="begin" onPress={onBegin} />)}
    </YStack>,
  );
}
