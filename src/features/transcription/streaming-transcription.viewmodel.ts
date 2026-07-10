import { useCallback, useEffect, useRef, useState } from "react";
import type {
  StreamingTranscriptState,
  Transcript,
  TranscriptError,
  TranscriptResult,
} from "./transcription.model";
import type {
  StreamingTranscriptionSession,
  StreamingTranscriptionStartOptions,
} from "./transcription.provider";
import { useTranscriptionContext } from "./transcription.context";

const IDLE_STATE: StreamingTranscriptState = { status: "idle", partialText: "" };

export function useStreamingTranscript(recordingId: string) {
  const { streamingHandler } = useTranscriptionContext();
  const [state, setState] = useState<StreamingTranscriptState>(IDLE_STATE);
  const sessionRef = useRef<StreamingTranscriptionSession | undefined>(undefined);
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);
  const operationRef = useRef<Promise<TranscriptResult<void>> | undefined>(undefined);

  const cleanupSubscription = useCallback(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = undefined;
  }, []);

  const start = useCallback(async (
    options: Omit<StreamingTranscriptionStartOptions, "recordingId">,
  ): Promise<TranscriptResult<void>> => {
    if (!streamingHandler) {
      const error: TranscriptError = {
        code: "provider_unavailable",
        message: "Streaming transcription is not configured.",
        recoverable: false,
      };
      setState({ status: "error", partialText: "", error });
      return { ok: false, error };
    }
    if (sessionRef.current || operationRef.current) {
      const error: TranscriptError = {
        code: "request_failed",
        message: "A streaming transcript is already active.",
        recoverable: false,
      };
      return { ok: false, error };
    }

    setState({ status: "starting", partialText: "" });
    const operation = (async (): Promise<TranscriptResult<void>> => {
      const result = await streamingHandler.start({ ...options, recordingId });
      if (!result.ok) {
        setState({ status: "error", partialText: "", error: result.error });
        return result;
      }
      sessionRef.current = result.data;
      unsubscribeRef.current = result.data.subscribe((update) => {
        setState((current) => ({
          ...current,
          status: "streaming",
          partialText: update.text,
        }));
      });
      setState({ status: "streaming", partialText: "" });
      return { ok: true, data: undefined };
    })();
    operationRef.current = operation;
    try {
      return await operation;
    } catch (cause) {
      const error: TranscriptError = {
        code: "request_failed",
        message: cause instanceof Error ? cause.message : "Could not start streaming transcription.",
        recoverable: true,
      };
      setState({ status: "error", partialText: "", error });
      return { ok: false, error };
    } finally {
      operationRef.current = undefined;
    }
  }, [recordingId, streamingHandler]);

  const append = useCallback(async (chunk: Uint8Array): Promise<TranscriptResult<void>> => {
    const session = sessionRef.current;
    if (!session) return inactiveSessionError();
    if (chunk.byteLength === 0) return { ok: true, data: undefined };
    try {
      const result = await session.append(chunk);
      if (!result.ok) setState((current) => ({ ...current, status: "error", error: result.error }));
      return result;
    } catch (cause) {
      const error = requestError(cause, "Could not stream audio.");
      setState((current) => ({ ...current, status: "error", error }));
      return { ok: false, error };
    }
  }, []);

  const finish = useCallback(async (): Promise<TranscriptResult<Transcript>> => {
    const session = sessionRef.current;
    if (!session) return inactiveSessionError();
    try {
      const result = await session.finish();
      if (result.ok) {
        setState({ status: "ready", partialText: result.data.text, transcript: result.data });
      } else {
        setState((current) => ({ ...current, status: "error", error: result.error }));
      }
      return result;
    } catch (cause) {
      const error = requestError(cause, "Could not finish streaming transcription.");
      setState((current) => ({ ...current, status: "error", error }));
      return { ok: false, error };
    } finally {
      cleanupSubscription();
      sessionRef.current = undefined;
    }
  }, [cleanupSubscription]);

  const cancel = useCallback(async (): Promise<TranscriptResult<void>> => {
    const session = sessionRef.current;
    cleanupSubscription();
    sessionRef.current = undefined;
    try {
      if (session) await session.cancel();
      setState(IDLE_STATE);
      return { ok: true, data: undefined };
    } catch (cause) {
      const error = requestError(cause, "Could not cancel streaming transcription.");
      setState({ status: "error", partialText: "", error });
      return { ok: false, error };
    }
  }, [cleanupSubscription]);

  useEffect(() => () => {
    const session = sessionRef.current;
    cleanupSubscription();
    sessionRef.current = undefined;
    if (session) void session.cancel();
  }, [cleanupSubscription]);

  return { state, start, append, finish, cancel };
}

function inactiveSessionError<T>(): TranscriptResult<T> {
  return {
    ok: false,
    error: {
      code: "request_failed",
      message: "No streaming transcript is active.",
      recoverable: false,
    },
  };
}

function requestError(cause: unknown, fallback: string): TranscriptError {
  return {
    code: "request_failed",
    message: cause instanceof Error ? cause.message : fallback,
    recoverable: true,
  };
}
