import { TextEditorDraft } from "./domain/model";

function storageKey(uid: string, docId: string): string {
  return `appforge_text_editor_draft:${uid}:${docId}`;
}

async function readStorage(key: string): Promise<string | undefined> {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key) ?? undefined;
    }
  } catch {
    // fall through to native storage
  }

  try {
    const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
    return (await AsyncStorage.getItem(key)) ?? undefined;
  } catch {
    // storage unavailable
  }
  return undefined;
}

async function writeStorage(key: string, value: string | undefined): Promise<void> {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      if (value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, value);
      }
      return;
    }
  } catch {
    // fall through to native storage
  }

  try {
    const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
    if (value === undefined) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch {
    // storage unavailable
  }
}

export async function loadTextEditorDraft(uid: string, docId: string): Promise<TextEditorDraft | undefined> {
  const raw = await readStorage(storageKey(uid, docId));
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as Partial<TextEditorDraft>;
    if (!parsed.docId || typeof parsed.content !== "string") return undefined;
    return {
      docId: parsed.docId,
      title: parsed.title ?? "",
      tag: parsed.tag ?? "",
      version: parsed.version ?? "v1",
      content: parsed.content,
      updatedAtIso: parsed.updatedAtIso ?? new Date().toISOString(),
    };
  } catch {
    return undefined;
  }
}

export async function saveTextEditorDraft(uid: string, draft: TextEditorDraft): Promise<void> {
  await writeStorage(storageKey(uid, draft.docId), JSON.stringify(draft));
}

export async function clearTextEditorDraft(uid: string, docId: string): Promise<void> {
  await writeStorage(storageKey(uid, docId), undefined);
}
