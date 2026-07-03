import { useCallback, useMemo, useState } from "react";
import { RecordingModel } from "./recordings.model";
import { RecordingShareModel } from "./share.model";
import { recordingShareUsecase } from "./recording-share.usecase";

export function useRecordingSharesViewModel() {
  const [sharesByRecordingId, setSharesByRecordingId] = useState<Record<string, RecordingShareModel[]>>({});
  const [loadingByRecordingId, setLoadingByRecordingId] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | undefined>(undefined);

  const refreshForRecording = useCallback(async (recordingId: string) => {
    const id = recordingId.trim();
    if (!id) return;
    setLoadingByRecordingId((current) => ({ ...current, [id]: true }));
    const result = await recordingShareUsecase.listRecordingShares(id);
    if (!result.ok) {
      setError(result.error);
      setLoadingByRecordingId((current) => ({ ...current, [id]: false }));
      return;
    }
    setSharesByRecordingId((current) => ({ ...current, [id]: result.data }));
    setLoadingByRecordingId((current) => ({ ...current, [id]: false }));
  }, []);

  const ensureLoaded = useCallback(async (recordingId: string) => {
    const id = recordingId.trim();
    if (!id) return;
    if (sharesByRecordingId[id] !== undefined) return;
    await refreshForRecording(id);
  }, [refreshForRecording, sharesByRecordingId]);

  const create = useCallback(async (recordingId: string) => {
    const result = await recordingShareUsecase.createRecordingShare(recordingId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await refreshForRecording(recordingId);
  }, [refreshForRecording]);

  const revoke = useCallback(async (recordingId: string, shareUrl: string) => {
    const result = await recordingShareUsecase.revokeRecordingShare(recordingId, shareUrl);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await refreshForRecording(recordingId);
  }, [refreshForRecording]);

  const sharedItems = useMemo(() => {
    const items: Array<{ recordingId: string; share: RecordingShareModel }> = [];
    Object.entries(sharesByRecordingId).forEach(([recordingId, shares]) => {
      shares.forEach((share) => {
        items.push({ recordingId: share.entityId || recordingId, share });
      });
    });
    return items;
  }, [sharesByRecordingId]);

  const refreshOwnerShares = useCallback(async () => {
    const result = await recordingShareUsecase.listOwnerEntityShares();
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const next: Record<string, RecordingShareModel[]> = {};
    result.data.forEach((share) => {
      const key = share.entityId;
      if (!next[key]) next[key] = [];
      next[key].push(share);
    });
    setSharesByRecordingId(next);
  }, []);

  const mapRecordingById = useCallback((recordings: RecordingModel[]) => {
    const map: Record<string, RecordingModel> = {};
    recordings.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, []);

  return {
    state: {
      sharesByRecordingId,
      loadingByRecordingId,
      error,
      sharedItems,
    },
    actions: {
      ensureLoaded,
      create,
      revoke,
      refreshForRecording,
      refreshOwnerShares,
      mapRecordingById,
      clearError: () => setError(undefined),
    },
  };
}
