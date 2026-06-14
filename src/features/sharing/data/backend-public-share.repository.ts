import { fromProtoTimestamp, ProtoTimestampLike } from "../../../core/dates";
import { Result } from "../../../core/types";
import { api } from "../../../services/ApiClient";
import { PublicShareModel } from "../domain/model";

interface PublicSharePayload {
  share?: {
    token?: string;
    entityType?: string;
    entityId?: string;
    accessMode?: string;
    expiresAt?: ProtoTimestampLike;
    revokedAt?: ProtoTimestampLike;
  };
  entity?: {
    id?: string;
    category?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    question?: string;
    assetUrl?: string;
  };
}

function mapPayload(payload: PublicSharePayload): PublicShareModel | undefined {
  if (!payload.share || !payload.entity) return undefined;
  if (!payload.share.token || !payload.share.entityType || !payload.share.entityId || !payload.share.accessMode) return undefined;
  if (!payload.entity.id || !payload.entity.category) return undefined;

  return {
    share: {
      token: payload.share.token,
      entityType: payload.share.entityType,
      entityId: payload.share.entityId,
      accessMode: payload.share.accessMode,
      expiresAt: fromProtoTimestamp(payload.share.expiresAt),
      revokedAt: fromProtoTimestamp(payload.share.revokedAt),
    },
    entity: {
      id: payload.entity.id,
      category: payload.entity.category,
      title: payload.entity.title,
      subtitle: payload.entity.subtitle,
      content: payload.entity.content,
      question: payload.entity.question,
      assetUrl: payload.entity.assetUrl,
    },
  };
}

export class BackendPublicShareRepository {
  async getByToken(token: string): Promise<Result<PublicShareModel>> {
    const normalizedToken = token.trim();
    if (!normalizedToken) return { ok: false, error: "Share token is required." };
    const result = await api.get<PublicSharePayload>(`/shares/${encodeURIComponent(normalizedToken)}`);
    if (!result.ok) return { ok: false, error: result.error };
    const mapped = mapPayload(result.data);
    if (!mapped) return { ok: false, error: "Share payload is malformed." };
    return { ok: true, data: mapped };
  }

  buildContentUrl(token: string): string {
    return api.buildUrl(`/shares/${encodeURIComponent(token)}/content`);
  }
}
