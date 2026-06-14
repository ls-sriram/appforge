import { Result } from "../../../core/types";
import { BackendTextEditorRepository } from "../data/backend-text-editor.repository";
import { SaveTextDocumentInput, TextDocumentModel } from "../domain/model";
import { clearTextEditorDraft, loadTextEditorDraft, saveTextEditorDraft } from "../storage";

const repository = new BackendTextEditorRepository();

export async function saveDocument(input: SaveTextDocumentInput): Promise<Result<TextDocumentModel>> {
  return repository.saveDocument(input);
}

export async function listDocuments(limit = 20): Promise<Result<TextDocumentModel[]>> {
  return repository.listDocuments(limit);
}

export { clearTextEditorDraft, loadTextEditorDraft, saveTextEditorDraft };
