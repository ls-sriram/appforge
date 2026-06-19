import { Result } from "@core/types";
import { SaveTextDocumentInput, TextDocumentModel } from "./model";

export interface TextEditorRepository {
  saveDocument(input: SaveTextDocumentInput): Promise<Result<TextDocumentModel>>;
  listDocuments(limit?: number): Promise<Result<TextDocumentModel[]>>;
}
