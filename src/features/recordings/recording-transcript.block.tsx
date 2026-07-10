import React from "react";
import { Body, YStack } from "../../platform/ui/index";
import { TranscriptButton, useTranscript } from "../transcription/index";
import type { Transcript } from "../transcription/transcription.model";

/** Optional composition UI; recording remains unaware of transcription internals. */
export function RecordingTranscriptControl({
  recordingId,
  onTranscriptAvailable,
  onOpen,
}: {
  recordingId: string;
  onTranscriptAvailable?: (transcript: Transcript) => void;
  onOpen?: (transcript: Transcript) => void;
}) {
  const { state, request } = useTranscript(recordingId);

  const handlePress = async () => {
    const result = await request();
    if (result.ok) onTranscriptAvailable?.(result.data);
  };

  return (
    <YStack gap="$1">
      <TranscriptButton
        status={state.status}
        onRequest={() => { void handlePress(); }}
        onOpen={state.transcript && onOpen ? () => onOpen(state.transcript!) : undefined}
      />
      {state.error ? <Body fontSize="$2" color="$error">{state.error.message}</Body> : null}
    </YStack>
  );
}

