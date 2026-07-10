import React from "react";
import { Button, useUI } from "../../platform/ui/index";
import type { TranscriptStatus } from "./transcription.model";

export function TranscriptButton({
  status,
  onRequest,
  onOpen,
  disabled = false,
}: {
  status: TranscriptStatus;
  onRequest: () => void;
  onOpen?: () => void;
  disabled?: boolean;
}) {
  const { contracts } = useUI();
  const ready = status === "ready";
  const loading = status === "loading";
  const label = loading ? "Transcribing..." : ready ? "View transcript" : status === "error" ? "Retry transcript" : "Transcript";

  return (
    <Button
      contract={contracts.button![ready ? "secondary" : "ghost"]}
      onPress={ready && onOpen ? onOpen : onRequest}
      disabled={disabled || loading}
    >
      {label}
    </Button>
  );
}

