import React from "react";
import { Body, Heading, Label, XStack, YStack } from "@ui";
import { ui } from "@ui/viz";
import type { PhilosophyTopic } from "../session/domain/content";

export interface SitPhilosophyLayoutProps {
  topics: PhilosophyTopic[];
  openTopicId: string | null;
  onBack: () => void;
  onToggleTopic: (topicId: string) => void;
}

export function SitPhilosophyLayout({
  topics,
  openTopicId,
  onBack,
  onToggleTopic,
}: SitPhilosophyLayoutProps) {
  return ui(
    "sitphilosophy-0",
    <YStack f={1} bg="$bg" px="$4" pt="$7" pb="$5" gap="$4">
      {ui("sitphilosophy-1", <Label tone="muted" tt="uppercase" letterSpacing={1.5} onPress={onBack}>back</Label>)}
      {ui("sitphilosophy-2", <Heading size="display" tone="inverse">sit.</Heading>)}
      {ui("sitphilosophy-3", <Label tone="muted" ta="center" tt="uppercase" letterSpacing={2}>On the nature of this practice</Label>)}
      {ui("sitphilosophy-4", <YStack h={1} bg="$borderSubtle" />)}
      {ui(
        "sitphilosophy-5",
        <YStack gap="$4">
          {topics.map((topic) => {
            const isOpen = topic.id === openTopicId;
            return ui(
              `sitphilosophy-topic-${topic.id}`,
              <YStack gap="$3">
                {ui(
                  `sitphilosophy-header-${topic.id}`,
                  <XStack ai="center" jc="space-between">
                    {ui(
                      `sitphilosophy-title-${topic.id}`,
                      <Heading tone="accent" size="xl" onPress={() => onToggleTopic(topic.id)}>
                        {topic.title}
                      </Heading>,
                    )}
                    {ui(`sitphilosophy-chevron-${topic.id}`, <Label tone="muted">{isOpen ? "⌃" : "⌄"}</Label>)}
                  </XStack>,
                )}
                {isOpen
                  ? topic.body.map((paragraph, index) =>
                      ui(`sitphilosophy-body-${topic.id}-${index}`, <Body tone="muted">{paragraph}</Body>),
                    )
                  : null}
                {isOpen && topic.quote
                  ? ui(`sitphilosophy-quote-${topic.id}`, <Body tone="inverse">{topic.quote}</Body>)
                  : null}
                {ui(`sitphilosophy-rule-${topic.id}`, <YStack h={1} bg="$borderSubtle" />)}
              </YStack>,
            );
          })}
        </YStack>,
      )}
      {ui("sitphilosophy-6", <Body tone="muted">This app holds no data about you. Each session is its own complete thing.</Body>)}
    </YStack>,
  );
}
