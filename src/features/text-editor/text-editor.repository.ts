import { Result } from "../../platform/core/types";
import { SaveTextDocumentInput, TextDocumentModel } from "./text-editor.model";

export interface TextEditorRepository {
  saveDocument(input: SaveTextDocumentInput): Promise<Result<TextDocumentModel>>;
  listDocuments(limit?: number): Promise<Result<TextDocumentModel[]>>;
}
