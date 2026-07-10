import React, { createContext, useContext, useRef, useSyncExternalStore } from "react";
import type { TranscriptResult, Transcript, TranscriptState } from "./transcription.model";
import type { TranscriptionContentResolver, TranscriptionHandler } from "./transcription.provider";
import { TranscriptionService } from "./transcription.service";

const TranscriptionContext = createContext<TranscriptionService | undefined>(undefined);

export function TranscriptionProvider({
  children,
  resolver,
  handler,
}: {
  children: React.ReactNode;
  resolver: TranscriptionContentResolver;
  handler: TranscriptionHandler;
}) {
  const serviceRef = useRef<TranscriptionService | undefined>(undefined);
  serviceRef.current ??= new TranscriptionService(resolver, handler);
  return <TranscriptionContext.Provider value={serviceRef.current}>{children}</TranscriptionContext.Provider>;
}

export function useTranscript(recordingId: string): {
  state: TranscriptState;
  request: () => Promise<TranscriptResult<Transcript>>;
  clear: () => void;
} {
  const service = useContext(TranscriptionContext);
  if (!service) throw new Error("useTranscript() must be used inside TranscriptionProvider.");

  const state = useSyncExternalStore(
    (listener) => service.subscribe(listener),
    () => service.getState(recordingId),
    () => service.getState(recordingId),
  );

  return {
    state,
    request: () => service.request(recordingId),
    clear: () => service.clear(recordingId),
  };
}

