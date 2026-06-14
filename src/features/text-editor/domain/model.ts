import type { IsoUtcTimestamp, ProtoTimestampLike } from "../../../core/dates";

export const DOCUMENT_CONTENT_MAX_CHARS = 20_000;

export interface TextDocumentModel {
  id: string;
  title: string;
  tag: string;
  version: string;
  content: string;
  contentLength: number;
  createdAt: IsoUtcTimestamp;
  updatedAt: IsoUtcTimestamp;
}

export interface SaveTextDocumentInput {
  id?: string;
  title: string;
  tag: string;
  version: string;
  content: string;
}

export interface TextDocumentPayload {
  id: string;
  title: string;
  tag: string;
  version: string;
  content: string;
  contentLength: number;
  createdAt: ProtoTimestampLike;
  updatedAt: ProtoTimestampLike;
}

export interface TextDocumentListPayload {
  documents: TextDocumentPayload[];
}

export interface TextEditorDraft {
  docId: string;
  title: string;
  tag: string;
  version: string;
  content: string;
  updatedAtIso: IsoUtcTimestamp;
}
