import React, { createContext, useContext, useRef, useSyncExternalStore } from "react";
import type { TranscriptResult, Transcript, TranscriptState } from "./transcription.model";
import type { StreamingTranscriptionHandler, TranscriptionContentResolver, TranscriptionHandler } from "./transcription.provider";
import { TranscriptionService } from "./transcription.service";

interface TranscriptionContextValue {
  service: TranscriptionService;
  streamingHandler?: StreamingTranscriptionHandler;
}

const TranscriptionContext = createContext<TranscriptionContextValue | undefined>(undefined);

export function TranscriptionProvider({
  children,
  resolver,
  handler,
  streamingHandler,
}: {
  children: React.ReactNode;
  resolver: TranscriptionContentResolver;
  handler: TranscriptionHandler;
  streamingHandler?: StreamingTranscriptionHandler;
}) {
  const serviceRef = useRef<TranscriptionService | undefined>(undefined);
  serviceRef.current ??= new TranscriptionService(resolver, handler);
  return (
    <TranscriptionContext.Provider value={{ service: serviceRef.current, streamingHandler }}>
      {children}
    </TranscriptionContext.Provider>
  );
}

export function useTranscriptionContext(): TranscriptionContextValue {
  const value = useContext(TranscriptionContext);
  if (!value) throw new Error("Transcription hooks must be used inside TranscriptionProvider.");
  return value;
}

export function useTranscript(recordingId: string): {
  state: TranscriptState;
  request: () => Promise<TranscriptResult<Transcript>>;
  clear: () => void;
} {
  const { service } = useTranscriptionContext();

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
