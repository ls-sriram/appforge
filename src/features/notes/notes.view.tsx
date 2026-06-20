import React from "react";
import { Body, Heading, ScrollView, View, YStack } from "@appforge/platform/ui";
import type { NotesViewActions, NotesViewState } from "./notes.model";

interface Props {
  state: NotesViewState;
  actions: NotesViewActions;
}

export function NotesView({ state, actions }: Props) {
  return (
    <ScrollView f={1}>
      <YStack p="$4" pb="$12" gap="$4">
        <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$4">
          <YStack gap="$3">
            <Heading>{state.title}</Heading>
            <Body color="$textMuted">
              Replace this starter panel with feature-specific sections.
            </Body>
            {state.items.map((item) => (
              <Body key={item.id} onPress={() => actions.onSelect(item.id)}>
                {item.title}
              </Body>
            ))}
          </YStack>
        </View>
      </YStack>
    </ScrollView>
  );
}
