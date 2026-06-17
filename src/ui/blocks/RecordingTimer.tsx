import React from "react";
import { Col, MetaText, ProgressBar, Body } from "../primitives";

interface RecordingTimerProps {
  elapsedSeconds: number;
  maxSeconds: number;
}

export function RecordingTimer({ elapsedSeconds, maxSeconds }: RecordingTimerProps) {
  const progress = maxSeconds <= 0 ? 0 : Math.min(1, Math.max(0, elapsedSeconds / maxSeconds));
  const remaining = Math.max(0, maxSeconds - elapsedSeconds);
  return (
    <Col between="xs">
      <Body size="sm">{`Recording: ${elapsedSeconds}s / ${maxSeconds}s`}</Body>
      <ProgressBar value={progress} />
      <MetaText>{`${remaining}s remaining`}</MetaText>
    </Col>
  );
}
