import { dateOwner, fromProtoTimestamp, type ProtoTimestampLike } from "@core/dates";
import { Result } from "@core/types";
import { api } from "@api/client";
import { RecordingShareRepository } from "../domain/share-repository";
import { RecordingShareModel } from "../domain/share-model";

interface SharePayload {
  id: string;
  entityType: string;
  entityId: string;
  shareUrl: string;
  expiresAt?: ProtoTimestampLike;
  revokedAt?: ProtoTimestampLike;
}

const RECORDING_ENTITY_TYPE = "recording";

function sharesPath(recordingId: string): string {
  return `/entities/${RECORDING_ENTITY_TYPE}/${encodeURIComponent(recordingId)}/shares`;
}

function parseToken(shareUrl: string): string | undefined {
  const marker = "/shares/";
  const index = shareUrl.indexOf(marker);
  if (index < 0) return undefined;
  const token = shareUrl.slice(index + marker.length).trim();
  return token || undefined;
}

function mapShare(payload: SharePayload): RecordingShareModel {
  const expiresAt = fromProtoTimestamp(payload.expiresAt) ?? dateOwner.nowIso();
  const revokedAt = fromProtoTimestamp(payload.revokedAt);
  return {
    id: payload.id,
    entityType: payload.entityType,
    entityId: payload.entityId,
    shareUrl: payload.shareUrl,
    expiresAt,
    revokedAt: revokedAt ?? undefined,
  };
}

export class BackendRecordingSharesRepository implements RecordingShareRepository {
  async createShare(recordingId: string): Promise<Result<RecordingShareModel>> {
    const id = recordingId.trim();
    if (!id) return { ok: false, error: "Recording id is required." };
    const result = await api.post<SharePayload>(sharesPath(id), { entityType: RECORDING_ENTITY_TYPE });
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: mapShare(result.data) };
  }

  async listShares(recordingId: string): Promise<Result<RecordingShareModel[]>> {
    const id = recordingId.trim();
    if (!id) return { ok: false, error: "Recording id is required." };
    const result = await api.get<SharePayload[]>(sharesPath(id));
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: result.data.map((item) => mapShare(item)) };
  }

  async revokeShare(recordingId: string, shareUrl: string): Promise<Result<void>> {
    const id = recordingId.trim();
    if (!id) return { ok: false, error: "Recording id is required." };
    const token = parseToken(shareUrl);
    if (!token) return { ok: false, error: "Share token is invalid." };
    const result = await api.post<void>(`/entities/shares/${encodeURIComponent(token)}/revoke`);
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: undefined };
  }

  async listOwnerShares(): Promise<Result<RecordingShareModel[]>> {
    const result = await api.get<SharePayload[]>("/entities/shares");
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: result.data.map(mapShare) };
  }
}
