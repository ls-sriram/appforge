import { Result } from "../../platform/core/types";
import { BackendTextEditorRepository } from "./backend-text-editor.datasource";
import { SaveTextDocumentInput, TextDocumentModel } from "./text-editor.model";
import { clearTextEditorDraft, loadTextEditorDraft, saveTextEditorDraft } from "./text-editor.storage";

const repository = new BackendTextEditorRepository();

export async function saveDocument(input: SaveTextDocumentInput): Promise<Result<TextDocumentModel>> {
  return repository.saveDocument(input);
}

export async function listDocuments(limit = 20): Promise<Result<TextDocumentModel[]>> {
  return repository.listDocuments(limit);
}

export { clearTextEditorDraft, loadTextEditorDraft, saveTextEditorDraft };
