import React from "react";
import { Body, Button, Label, SelectableChip, XStack, YStack } from "@ui";
import { ui } from "@ui/viz";
import {
  SIT_DURATION_OPTIONS,
  SIT_SESSION_TYPE_DESCRIPTIONS,
  SIT_SESSION_TYPE_LABELS,
  type SitSessionType,
} from "../session/domain/content";

export interface SitMeditateLayoutProps {
  sessionType: SitSessionType;
  sessionMinutes: number;
  onBack: () => void;
  onInfo: () => void;
  onBegin: () => void;
  onSelectSessionType: (value: SitSessionType) => void;
  onSelectSessionMinutes: (value: number) => void;
}

export function SitMeditateLayout({
  sessionType,
  sessionMinutes,
  onBack,
  onInfo,
  onBegin,
  onSelectSessionType,
  onSelectSessionMinutes,
}: SitMeditateLayoutProps) {
  return ui(
    "sitmeditate-0",
    <YStack f={1} bg="$bg" px="$4" pt="$7" pb="$5" jc="space-between" gap="$5">
      {ui(
        "sitmeditate-1",
        <XStack ai="center" jc="space-between">
          {ui("sitmeditate-2", <Label tone="muted" tt="uppercase" letterSpacing={1.5} onPress={onBack}>back</Label>)}
          {ui("sitmeditate-3", <Label tone="muted" tt="uppercase" letterSpacing={1.5} onPress={onInfo}>?</Label>)}
        </XStack>,
      )}
      {ui(
        "sitmeditate-4",
        <YStack gap="$5" f={1} jc="center">
          {ui("sitmeditate-5", <Label tone="muted" tt="uppercase" letterSpacing={2}>gain clarity</Label>)}
          {ui("sitmeditate-6", <Body tone="inverse" size="2xl">{SIT_SESSION_TYPE_LABELS[sessionType]}</Body>)}
          {ui("sitmeditate-7", <Body tone="muted">{SIT_SESSION_TYPE_DESCRIPTIONS[sessionType]}</Body>)}
          {ui("sitmeditate-8", <YStack h={1} bg="$borderSubtle" />)}
          {ui(
            "sitmeditate-9",
            <YStack gap="$3">
              {ui("sitmeditate-10", <Label tone="muted" tt="uppercase" letterSpacing={2}>technique</Label>)}
              {ui(
                "sitmeditate-11",
                <XStack gap="$2" flexWrap="wrap">
                  {(Object.keys(SIT_SESSION_TYPE_LABELS) as SitSessionType[]).map((type) =>
                    ui(
                      `sitmeditate-tech-${type}`,
                      <SelectableChip
                        label={SIT_SESSION_TYPE_LABELS[type]}
                        selected={sessionType === type}
                        onPress={() => onSelectSessionType(type)}
                      />,
                    ),
                  )}
                </XStack>,
              )}
            </YStack>,
          )}
          {ui(
            "sitmeditate-12",
            <YStack gap="$3">
              {ui("sitmeditate-13", <Label tone="muted" tt="uppercase" letterSpacing={2}>duration</Label>)}
              {ui(
                "sitmeditate-14",
                <XStack gap="$2" flexWrap="wrap">
                  {SIT_DURATION_OPTIONS.map((minutes) =>
                    ui(
                      `sitmeditate-duration-${minutes}`,
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
      {ui("sitmeditate-15", <Button size="lg" label="begin" onPress={onBegin} />)}
    </YStack>,
  );
}
