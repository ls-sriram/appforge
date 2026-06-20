import React from "react";
import { Body, Button, YStack } from "../../../platform/ui/index";

interface Props {
  playing: boolean;
  error: string | undefined;
  onPlay: () => void;
}

export function AudioPlayBlock({ playing, error, onPlay }: Props) {
  return (
    <YStack gap="$3">
      <Button bg="$primary" onPress={onPlay}>
        <Body color="$textInverse" fontFamily="$bold">
          {playing ? "Playing..." : "Play recording"}
        </Body>
      </Button>
      {error ? <Body fontSize="$2" color="$error">{error}</Body> : null}
    </YStack>
  );
}
