import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dateOwner } from "@core/dates";
import { idOwner } from "@core/providers";
import { DOCUMENT_CONTENT_MAX_CHARS, TextDocumentModel, TextEditorDraft } from "../domain/model";
import {
  clearTextEditorDraft,
  listDocuments,
  loadTextEditorDraft,
  saveDocument,
  saveTextEditorDraft,
} from "../usecases/text-editor-actions";

interface UseTextEditorViewModelParams {
  uid?: string;
}

export function useTextEditorViewModel({ uid }: UseTextEditorViewModelParams) {
  const [docId, setDocId] = useState(() => idOwner.generate());
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("notes");
  const [version, setVersion] = useState("v1");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [draftStatus, setDraftStatus] = useState<"idle" | "saved" | "error">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [documents, setDocuments] = useState<TextDocumentModel[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const refreshDocuments = useCallback(async () => {
    const result = await listDocuments(20);
    if (result.ok) {
      setDocuments(result.data);
    }
    setLoadingDocuments(false);
  }, []);

  useEffect(() => {
    void refreshDocuments();
  }, [refreshDocuments]);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    (async () => {
      const draft = await loadTextEditorDraft(uid, docId);
      if (cancelled || !draft) return;
      setTitle(draft.title);
      setTag(draft.tag);
      setVersion(draft.version);
      setContent(draft.content.slice(0, DOCUMENT_CONTENT_MAX_CHARS));
    })();
    return () => {
      cancelled = true;
    };
  }, [docId, uid]);

  const scheduleDraftSave = useCallback((next: { title: string; tag: string; version: string; content: string }) => {
    if (!uid) return;
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setTimeout(async () => {
      const draft: TextEditorDraft = {
        docId,
        title: next.title,
        tag: next.tag,
        version: next.version,
        content: next.content,
        updatedAtIso: dateOwner.nowIso(),
      };
      try {
        await saveTextEditorDraft(uid, draft);
        setDraftStatus("saved");
      } catch {
        setDraftStatus("error");
      }
    }, 400);
  }, [docId, uid]);

  useEffect(() => () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
  }, []);

  const updateTitle = useCallback((nextTitle: string) => {
    setTitle(nextTitle);
    scheduleDraftSave({ title: nextTitle, tag, version, content });
  }, [content, scheduleDraftSave, tag, version]);

  const updateTag = useCallback((nextTag: string) => {
    setTag(nextTag);
    scheduleDraftSave({ title, tag: nextTag, version, content });
  }, [content, scheduleDraftSave, title, version]);

  const updateVersion = useCallback((nextVersion: string) => {
    setVersion(nextVersion);
    scheduleDraftSave({ title, tag, version: nextVersion, content });
  }, [content, scheduleDraftSave, tag, title]);

  const updateContent = useCallback((nextContent: string) => {
    const clamped = nextContent.slice(0, DOCUMENT_CONTENT_MAX_CHARS);
    setContent(clamped);
    scheduleDraftSave({ title, tag, version, content: clamped });
  }, [scheduleDraftSave, tag, title, version]);

  const save = useCallback(async () => {
    const normalizedTitle = title.trim();
    const normalizedTag = tag.trim();
    const normalizedVersion = version.trim();

    if (!normalizedTitle) {
      setError("Title is required.");
      setSaveStatus("error");
      return;
    }
    if (!normalizedTag) {
      setError("Tag is required.");
      setSaveStatus("error");
      return;
    }
    if (!normalizedVersion) {
      setError("Version is required.");
      setSaveStatus("error");
      return;
    }
    if (content.length > DOCUMENT_CONTENT_MAX_CHARS) {
      setError(`Content must be <= ${DOCUMENT_CONTENT_MAX_CHARS} characters.`);
      setSaveStatus("error");
      return;
    }

    setError(undefined);
    setSaving(true);
    const result = await saveDocument({
      id: docId,
      title: normalizedTitle,
      tag: normalizedTag,
      version: normalizedVersion,
      content,
    });
    setSaving(false);

    if (!result.ok) {
      setSaveStatus("error");
      setError(result.error);
      return;
    }

    setDocId(result.data.id);
    setSaveStatus("success");
    setTitle(result.data.title);
    setTag(result.data.tag);
    setVersion(result.data.version);
    setContent(result.data.content);
    if (uid) {
      await clearTextEditorDraft(uid, result.data.id);
    }
    await refreshDocuments();
  }, [content, docId, refreshDocuments, tag, title, uid, version]);

  const createNew = useCallback(() => {
    setDocId(idOwner.generate());
    setTitle("");
    setTag("notes");
    setVersion("v1");
    setContent("");
    setError(undefined);
    setSaveStatus("idle");
    setDraftStatus("idle");
  }, []);

  return {
    state: useMemo(() => ({
      docId,
      title,
      tag,
      version,
      content,
      contentLength: content.length,
      maxContentLength: DOCUMENT_CONTENT_MAX_CHARS,
      saving,
      draftStatus,
      saveStatus,
      error,
      documents,
      loadingDocuments,
    }), [content, docId, documents, draftStatus, error, loadingDocuments, saveStatus, saving, tag, title, version]),
    actions: {
      setTitle: updateTitle,
      setTag: updateTag,
      setVersion: updateVersion,
      setContent: updateContent,
      save,
      createNew,
      refreshDocuments,
    },
  };
}
