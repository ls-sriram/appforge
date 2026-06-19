import { dateOwner, fromProtoTimestamp } from "../../../platform/core/dates";
import { Result } from "../../../platform/core/types";
import { api } from "../../../platform/api/client";
import {
  SaveTextDocumentInput,
  TextDocumentListPayload,
  TextDocumentModel,
  TextDocumentPayload,
} from "../domain/model";
import { TextEditorRepository } from "../domain/repository";

const DOCUMENTS_PATH = "/documents";

export class BackendTextEditorRepository implements TextEditorRepository {
  async saveDocument(input: SaveTextDocumentInput): Promise<Result<TextDocumentModel>> {
    const result = await api.post<TextDocumentPayload>(DOCUMENTS_PATH, {
      id: input.id,
      title: input.title,
      tag: input.tag,
      version: input.version,
      content: input.content,
    });
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: mapDocument(result.data) };
  }

  async listDocuments(limit = 20): Promise<Result<TextDocumentModel[]>> {
    const result = await api.get<TextDocumentListPayload>(`${DOCUMENTS_PATH}?limit=${limit}`);
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: result.data.documents.map(mapDocument) };
  }
}

function mapDocument(payload: TextDocumentPayload): TextDocumentModel {
  return {
    id: payload.id,
    title: payload.title,
    tag: payload.tag,
    version: payload.version,
    content: payload.content,
    contentLength: payload.contentLength,
    createdAt: fromProtoTimestamp(payload.createdAt) ?? dateOwner.nowIso(),
    updatedAt: fromProtoTimestamp(payload.updatedAt) ?? dateOwner.nowIso(),
  };
}
