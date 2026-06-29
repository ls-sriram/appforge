import React from "react";
import { Body, Button, useUI, YStack } from "../../../platform/ui/index";

interface Props {
  playing: boolean;
  error: string | undefined;
  onPlay: () => void;
}

export function AudioPlayBlock({ playing, error, onPlay }: Props) {
  const { contracts } = useUI();
  return (
    <YStack gap="$3">
      <Button contract={contracts.button!["primary"]} onPress={onPlay}>
        {playing ? "Playing..." : "Play recording"}
      </Button>
      {error ? <Body fontSize="$2" color="$error">{error}</Body> : null}
    </YStack>
  );
}
