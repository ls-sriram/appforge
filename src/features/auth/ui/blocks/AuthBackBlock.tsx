import React from "react";
import { Body, Button } from "../../../../platform/ui/index";

export function AuthBackBlock({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Button onPress={onPress} bg="$surfaceAlt" borderWidth={1} borderColor="$border">
      <Body>{label}</Body>
    </Button>
  );
}
