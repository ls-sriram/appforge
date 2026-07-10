import { useCallback, useMemo, useSyncExternalStore } from "react";
import type {
  LiveTranscriptEvent,
  LiveTranscriptionOptions,
  LiveTranscriptionRuntime,
} from "./transcription.model";
import { getDefaultLiveTranscriptionManager } from "./live-transcription.runtime";

export function useLiveTranscription(
  options: LiveTranscriptionOptions = {},
): LiveTranscriptionRuntime {
  const manager = getDefaultLiveTranscriptionManager();
  const state = useSyncExternalStore(
    (listener) => manager.subscribeState(listener),
    () => manager.getState(),
    () => manager.getState(),
  );
  const language = options.language;
  const interimResults = options.interimResults;
  const continuous = options.continuous;
  const contextualStrings = options.contextualStrings;

  const start = useCallback(() => {
    manager.start({ language, interimResults, continuous, contextualStrings });
  }, [manager, language, interimResults, continuous, contextualStrings]);
  const stop = useCallback(() => manager.stop(), [manager]);
  const subscribe = useCallback(
    (listener: (event: LiveTranscriptEvent) => void) => manager.subscribeTranscript(listener),
    [manager],
  );

  return useMemo(() => ({ ...state, start, stop, subscribe }), [state, start, stop, subscribe]);
}

