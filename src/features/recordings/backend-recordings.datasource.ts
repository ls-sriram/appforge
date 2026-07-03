import { dateOwner, fromProtoTimestamp, type ProtoTimestampLike } from "../../platform/core/dates/index";
import { Result } from "../../platform/core/types";
import { api } from "../../platform/api/client";
import { RecordingsRepository } from "./recordings.repository";
import { RecordingCapturePayload, RecordingContentRef, RecordingModel } from "./recordings.model";

interface RecordingResponsePayload {
  id: string;
  createdAt: ProtoTimestampLike;
  durationSeconds?: number;
  contentType: string;
  sizeBytes: number;
}

interface RecordingListPayload {
  recordings: RecordingResponsePayload[];
}

// TODO: Move recordings path construction to generated API route manifest once recordings endpoints are represented in proto route generation.
const RECORDINGS_PATH = "/recordings";

function buildRecordingContentPath(recordingId: string): string {
  return `${RECORDINGS_PATH}/${encodeURIComponent(recordingId)}/content`;
}

export class BackendRecordingsRepository implements RecordingsRepository {
  async createRecording(input: RecordingCapturePayload): Promise<Result<RecordingModel>> {
    const result = await api.post<RecordingResponsePayload>(RECORDINGS_PATH, {
      audioBase64: input.audioBase64,
      contentType: input.contentType,
      durationSeconds: input.durationSeconds,
    });
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: mapRecording(result.data) };
  }

  async listRecordings(limit = 20): Promise<Result<RecordingModel[]>> {
    const result = await api.get<RecordingListPayload>(`${RECORDINGS_PATH}?limit=${limit}`);
    if (!result.ok) return { ok: false, error: result.error };
    const items = result.data.recordings.map(mapRecording);
    return { ok: true, data: items };
  }

  async getRecordingContent(recordingId: string): Promise<Result<RecordingContentRef>> {
    const id = recordingId.trim();
    if (!id) return { ok: false, error: "Recording id is required." };
    return {
      ok: true,
      data: {
        playbackUrl: api.buildUrl(buildRecordingContentPath(id)),
      },
    };
  }
}

function mapRecording(payload: RecordingResponsePayload): RecordingModel {
  const createdAt = fromProtoTimestamp(payload.createdAt) ?? dateOwner.nowIso();
  return {
    id: payload.id,
    createdAt,
    durationSeconds: payload.durationSeconds,
    contentType: payload.contentType,
    sizeBytes: Number(payload.sizeBytes),
  };
}
