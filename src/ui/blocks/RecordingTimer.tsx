import React from "react";
import { Block } from "../primitives";
import { MetaText, ProgressBar, Text } from "../primitives";

interface RecordingTimerProps {
  elapsedSeconds: number;
  maxSeconds: number;
}

export function RecordingTimer({ elapsedSeconds, maxSeconds }: RecordingTimerProps) {
  const progress = maxSeconds <= 0 ? 0 : Math.min(1, Math.max(0, elapsedSeconds / maxSeconds));
  const remaining = Math.max(0, maxSeconds - elapsedSeconds);
  return (
    <Block space="xs">
      <Text variant="bodySm">{`Recording: ${elapsedSeconds}s / ${maxSeconds}s`}</Text>
      <ProgressBar value={progress} />
      <MetaText>{`${remaining}s remaining`}</MetaText>
    </Block>
  );
}
