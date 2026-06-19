import React from "react";
import { Body, Button, Heading, Label, XStack, YStack } from "@ui";
import { ui } from "@ui/viz";
import type { VipassanaSession } from "../session/domain/content";

type VipassanaSessionState = VipassanaSession & {
  status: "done" | "active" | "upcoming";
};

export interface SitVipassanaLayoutProps {
  activeSession: VipassanaSessionState | null;
  schedule: VipassanaSessionState[];
  scheduleExpanded: boolean;
  onBack: () => void;
  onInfo: () => void;
  onBegin: () => void;
  onToggleSchedule: () => void;
}

function formatTime(hour: number, minute: number) {
  const hours = hour % 12 || 12;
  const suffix = hour < 12 ? "am" : "pm";
  const minutePart = minute === 0 ? "" : `:${String(minute).padStart(2, "0")}`;
  return `${hours}${minutePart} ${suffix}`;
}

export function SitVipassanaLayout({
  activeSession,
  schedule,
  scheduleExpanded,
  onBack,
  onInfo,
  onBegin,
  onToggleSchedule,
}: SitVipassanaLayoutProps) {
  return ui(
    "sitvipassana-0",
    <YStack f={1} bg="$bg" px="$4" pt="$7" pb="$5" gap="$4">
      {ui(
        "sitvipassana-1",
        <XStack ai="center" jc="space-between">
          {ui("sitvipassana-2", <Label tone="muted" tt="uppercase" letterSpacing={1.5} onPress={onBack}>back</Label>)}
          {ui("sitvipassana-3", <Label tone="muted" tt="uppercase" letterSpacing={1.5} onPress={onInfo}>?</Label>)}
        </XStack>,
      )}
      {ui(
        "sitvipassana-4",
        <YStack gap="$2" ai="center">
          {ui("sitvipassana-5", <Label tone="muted" tt="uppercase" letterSpacing={2}>vipassana challenge</Label>)}
          {ui("sitvipassana-6", <Heading size="display" tone="inverse" ta="center">full day</Heading>)}
        </YStack>,
      )}
      {ui("sitvipassana-7", <YStack h={1} bg="$borderSubtle" />)}
      {activeSession
        ? ui(
            "sitvipassana-8",
            <YStack gap="$3" ai="center">
              {ui("sitvipassana-9", <Body tone="muted" ta="center">{formatTime(activeSession.startHour, activeSession.startMin)} · {activeSession.duration} min</Body>)}
              {ui("sitvipassana-10", <Heading tone="inverse" size="xl" ta="center">{activeSession.description}</Heading>)}
              {activeSession.adhi ? ui("sitvipassana-11", <Label tone="accent" tt="uppercase" letterSpacing={1.5}>adhitthana</Label>) : null}
            </YStack>,
          )
        : ui("sitvipassana-12", <Body tone="muted" ta="center">day begins at 4:00 am</Body>)}
      {ui("sitvipassana-13", <Button size="lg" label="begin sitting" onPress={onBegin} />)}
      {ui("sitvipassana-14", <Label tone="muted" ta="center" tt="uppercase" letterSpacing={1.5} onPress={onToggleSchedule}>{scheduleExpanded ? "hide schedule" : "full schedule"}</Label>)}
      {scheduleExpanded
        ? ui(
            "sitvipassana-15",
            <YStack gap="$3">
              {schedule.map((session) =>
                ui(
                  `sitvipassana-row-${session.id}`,
                  <XStack gap="$3">
                    {ui(
                      `sitvipassana-time-${session.id}`,
                      <YStack w={64}>
                        {ui(`sitvipassana-time-label-${session.id}`, <Label tone="muted">{formatTime(session.startHour, session.startMin)}</Label>)}
                        {ui(`sitvipassana-duration-${session.id}`, <Label tone="muted">{session.duration} min</Label>)}
                      </YStack>,
                    )}
                    {ui(
                      `sitvipassana-copy-${session.id}`,
                      <YStack f={1}>
                        {ui(`sitvipassana-copy-title-${session.id}`, <Label tone={session.status === "active" ? "inverse" : "secondary"}>{session.kind === "sit" ? session.description : session.label}</Label>)}
                        {ui(`sitvipassana-copy-meta-${session.id}`, <Body tone="muted">{session.kind === "sit" ? session.label : session.description}</Body>)}
                      </YStack>,
                    )}
                    {ui(`sitvipassana-status-${session.id}`, <Label tone={session.status === "active" ? "accent" : "muted"} tt="uppercase">{session.status}</Label>)}
                  </XStack>,
                ),
              )}
            </YStack>,
          )
        : null}
    </YStack>,
  );
}
