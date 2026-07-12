import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deleteRecording, finalizeRecording, listRecordings, loadRecordingContent } from "./recording-actions.usecase";
import { RecordingFinalizeOptions, RecordingModel, RecordingUiStatus } from "./recordings.model";
import { recordingConfig } from "./recording.config";
import { getDefaultRecordingRuntimeAdapter } from "./default-recording.adapter";
import { RecordingRuntimeAdapter } from "./recordings.adapter";

const MAX_SECONDS = recordingConfig.maxSeconds;

export function useRecordingsViewModel(adapter?: RecordingRuntimeAdapter) {
  const adapterRef = useRef<RecordingRuntimeAdapter>(adapter ?? getDefaultRecordingRuntimeAdapter());
  const [status, setStatus] = useState<RecordingUiStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);
  const [recordings, setRecordings] = useState<RecordingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [playbackUrlById, setPlaybackUrlById] = useState<Record<string, string>>({});
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [playingId, setPlayingId] = useState<string | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | undefined>(undefined);
  const recordingSinceRef = useRef<number | undefined>(undefined);
  const stopRef = useRef<() => Promise<void>>(async () => undefined);

  const refresh = useCallback(async () => {
    const result = await listRecordings(20);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setRecordings(result.data);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await refresh();
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  useEffect(() => {
    if (status !== "recording") return;
    const timer = setInterval(() => {
      const since = recordingSinceRef.current;
      if (!since) return;
      const next = Math.min(MAX_SECONDS, Math.floor((Date.now() - since) / 1000));
      setSecondsElapsed(next);
      if (next >= MAX_SECONDS) {
        void stopRef.current();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const start = useCallback(async () => {
    if (status === "recording" || status === "uploading") return;
    setError(undefined);
    const result = await adapterRef.current.start();
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    recordingSinceRef.current = Date.now();
    setSecondsElapsed(0);
    setStatus("recording");
  }, [status]);

  const finalize = useCallback(async (options: RecordingFinalizeOptions = {}) => {
    if (status !== "recording") return;
    setStatus("uploading");
    const since = recordingSinceRef.current;
    const durationSeconds = since
      ? Math.min(MAX_SECONDS, Math.max(0, Math.floor((Date.now() - since) / 1000)))
      : secondsElapsed;
    const captured = await adapterRef.current.stop();
    if (!captured.ok) {
      setStatus("error");
      setError(captured.error);
      return;
    }
    const result = await finalizeRecording({
      audioBase64: captured.data.audioBase64,
      contentType: captured.data.contentType,
      durationSeconds: captured.data.durationSeconds ?? durationSeconds,
    }, options);
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    if (result.data.outcome === "saved") {
      await refresh();
    }
    setStatus("ready");
    recordingSinceRef.current = undefined;
    setSecondsElapsed(0);
  }, [refresh, secondsElapsed, status]);

  const stop = useCallback(async () => {
    await finalize({ persistenceMode: "save" });
  }, [finalize]);

  const discard = useCallback(async () => {
    await finalize({ persistenceMode: "discard" });
  }, [finalize]);

  stopRef.current = stop;

  const play = useCallback(async (recordingId: string) => {
    const existing = playbackUrlById[recordingId];
    if (existing) {
      setPlayingId(recordingId);
      return;
    }
    const result = await loadRecordingContent(recordingId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPlaybackUrlById((current) => ({ ...current, [recordingId]: result.data.playbackUrl }));
    setPlayingId(recordingId);
  }, [playbackUrlById]);

  const remove = useCallback(async (recordingId: string) => {
    const id = recordingId.trim();
    if (!id || deletingId) return;
    setDeletingId(id);
    const result = await deleteRecording(id);
    if (!result.ok) {
      setError(result.error);
      setDeletingId(undefined);
      return;
    }
    setRecordings((current) => current.filter((item) => item.id !== id));
    setPlaybackUrlById((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setPlayingId((current) => (current === id ? undefined : current));
    setDeletingId(undefined);
  }, [deletingId]);

  const state = useMemo(() => ({
    status,
    error,
    recordings,
    loading,
    maxSeconds: MAX_SECONDS,
    secondsElapsed,
    secondsRemaining: Math.max(0, MAX_SECONDS - secondsElapsed),
    playbackUrlById,
    playingId,
    deletingId,
  }), [deletingId, error, loading, playbackUrlById, playingId, recordings, secondsElapsed, status]);

  return {
    state,
    actions: {
      start,
      stop,
      discard,
      refresh,
      play,
      deleteRecording: remove,
    },
  };
}
