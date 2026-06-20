import React from "react";
import { Body, YStack } from "@appforge/platform/ui";

// Visualizer stage — inert fixture for the design tool.
// Replace with: <NotesSurface data={MOCK} dispatch={() => {}} />
// once you have a Surface component and a typed ViewData.
export function NotesLayout() {
  return (
    <YStack bg="$bg" f={1} p="$4" gap="$4">
      <Body>Notes stage</Body>
    </YStack>
  );
}
