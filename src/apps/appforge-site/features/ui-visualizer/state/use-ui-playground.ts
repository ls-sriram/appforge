import React from "react";
import { UI_PLAYGROUND_DOCUMENTS } from "../domain/ui-document.fixtures";
import {
  UI_DOCUMENTS_REGISTRY,
  REGISTRY_APP_NAMES,
} from "../../../../../generated/ui-documents.registry";
import { UI_BLOCKS_REGISTRY } from "../../../../../generated/ui-blocks.registry";
import { LIVE_LAYOUTS } from "../renderers/live-layout-registry";
import {
  addBlockNode,
  addNode,
  extractSubtreeAsBlock,
  generateLayoutFile,
  getInsertedRootIds,
  getComponentUsage,
  hasOnlyAdditiveChanges,
  hasStructuralChanges,
  insertCustomBlockNode,
  materializeDocumentState,
  removeNode,
  serializeDocument,
  updateNodeProps,
} from "../domain/ui-document.operations";
import type {
  CustomBlockDef,
  UiBlock,
  UiComponentType,
  UiDocument,
  UiEditorTab,
  UiNodeProps,
  UiPreviewState,
} from "../domain/ui-document.types";

// ── App registry ──────────────────────────────────────────────────────────────

export const AVAILABLE_APPS = Object.keys(UI_DOCUMENTS_REGISTRY).map((id) => ({
  id,
  displayName: REGISTRY_APP_NAMES[id] ?? id,
}));

// ── localStorage helpers ──────────────────────────────────────────────────────

function lsGet(key: string): string | null {
  try { return typeof window !== "undefined" ? window.localStorage.getItem(key) : null; } catch { return null; }
}
function lsSet(key: string, value: string) {
  try { if (typeof window !== "undefined") window.localStorage.setItem(key, value); } catch {}
}
function customBlocksKey(appId: string) { return `appforge:custom-blocks:${appId}`; }

function loadCustomBlocks(appId: string): CustomBlockDef[] {
  try {
    const raw = lsGet(customBlocksKey(appId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCustomBlocks(appId: string, blocks: CustomBlockDef[]) {
  lsSet(customBlocksKey(appId), JSON.stringify(blocks));
}

function docsForApp(appId: string): UiDocument[] {
  const docs = UI_DOCUMENTS_REGISTRY[appId] ?? [];
  return docs.length > 0 ? docs : UI_PLAYGROUND_DOCUMENTS;
}

function fileBlocksForApp(appId: string): UiBlock[] {
  return UI_BLOCKS_REGISTRY[appId] ?? [];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useUiPlayground() {
  const [selectedAppId, setSelectedAppIdRaw] = React.useState<string>(
    () => lsGet("appforge:selected-app") ?? AVAILABLE_APPS[0]?.id ?? "example-app",
  );

  const allDocs = React.useMemo(() => docsForApp(selectedAppId), [selectedAppId]);

  const [tab, setTab] = React.useState<UiEditorTab>("design");
  const [previewState, setPreviewState] = React.useState<UiPreviewState>("data");
  const [selectedDocumentId, setSelectedDocumentIdRaw] = React.useState(allDocs[0].id);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string>();
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const [docOverrides, setDocOverrides] = React.useState<Record<string, UiDocument>>({});
  const [themeOverrides, setThemeOverrides] = React.useState<Record<string, string>>({});
  const [livePropOverrides, setLivePropOverrides] = React.useState<Record<string, Partial<UiNodeProps>>>({});
  const [customBlocks, setCustomBlocks] = React.useState<CustomBlockDef[]>(
    () => loadCustomBlocks(selectedAppId),
  );

  // Reload custom blocks when app changes
  React.useEffect(() => {
    setCustomBlocks(loadCustomBlocks(selectedAppId));
  }, [selectedAppId]);

  const selectedBaseDocument =
    allDocs.find((d) => d.id === selectedDocumentId) ?? allDocs[0];
  const documentKey = `${selectedBaseDocument.id}:${previewState}`;
  const selectedDocument = docOverrides[documentKey] ?? materializeDocumentState(selectedBaseDocument, previewState);

  React.useEffect(() => {
    if (!selectedNodeId || !selectedDocument.nodes[selectedNodeId]) {
      setSelectedNodeId(selectedDocument.rootId);
    }
  }, [selectedDocument, selectedNodeId]);

  const selectedNode = selectedNodeId ? selectedDocument.nodes[selectedNodeId] : undefined;
  const componentUsage = React.useMemo(() => getComponentUsage(selectedDocument), [selectedDocument]);
  const serialized = React.useMemo(() => serializeDocument(selectedDocument), [selectedDocument]);
  const unsaved = Object.keys(docOverrides).length > 0 || Object.keys(themeOverrides).length > 0;
  const hasStructureChanges = React.useMemo(
    () => hasStructuralChanges(selectedBaseDocument, selectedDocument),
    [selectedBaseDocument, selectedDocument],
  );
  const hasOnlyInsertedChanges = React.useMemo(
    () => hasOnlyAdditiveChanges(selectedBaseDocument, selectedDocument),
    [selectedBaseDocument, selectedDocument],
  );
  const insertedRootIds = React.useMemo(
    () => getInsertedRootIds(selectedBaseDocument, selectedDocument),
    [selectedBaseDocument, selectedDocument],
  );

  function applyDocument(next: UiDocument) {
    setDocOverrides((current) => ({ ...current, [documentKey]: next }));
  }

  async function save() {
    if (!selectedDocument.sourcePath) {
      console.warn("[save] document has no sourcePath — cannot emit");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
      return;
    }
    setSaveStatus("saving");
    try {
      const content = generateLayoutFile(selectedDocument);
      const resp = await fetch("http://localhost:8089/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourcePath: selectedDocument.sourcePath, content }),
      });
      if (resp.ok) {
        setSaveStatus("saved");
        // Clear in-memory overrides for this document — source is now authoritative
        setDocOverrides((prev) => { const next = { ...prev }; delete next[documentKey]; return next; });
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        const err = await resp.json().catch(() => ({}));
        console.error("[save] server error:", err);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (e) {
      console.error("[save] fetch failed (is save-server running on :8089?):", e);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  return {
    // App selection
    availableApps: AVAILABLE_APPS,
    selectedAppId,
    setSelectedAppId(appId: string) {
      setSelectedAppIdRaw(appId);
      lsSet("appforge:selected-app", appId);
      const docs = docsForApp(appId);
      setSelectedDocumentIdRaw(docs[0].id);
      setDocOverrides({});
      setLivePropOverrides({});
      setThemeOverrides({});
    },

    // Documents
    tab,
    setTab,
    previewState,
    setPreviewState,
    documents: allDocs,
    selectedDocumentId,
    setSelectedDocumentId(id: string) {
      setSelectedDocumentIdRaw(id);
      setLivePropOverrides({});
    },
    selectedDocument,
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
    componentUsage,
    serialized,
    unsaved,
    hasStructureChanges,
    hasOnlyInsertedChanges,
    insertedRootIds,
    saveStatus,
    save,
    livePropOverrides,

    // Tokens
    themeOverrides,
    setThemeOverride(key: string, value: string) {
      setThemeOverrides((prev) => ({ ...prev, [key]: value }));
    },
    clearThemeOverride(key: string) {
      setThemeOverrides((prev) => { const n = { ...prev }; delete n[key]; return n; });
    },
    clearAllThemeOverrides() {
      setThemeOverrides({});
    },
    applyThemePreset(overrides: Record<string, string>) {
      setThemeOverrides(overrides);
    },

    // Block library operations
    addBlock(blockId: string) {
      applyDocument(addBlockNode(selectedDocument, blockId, selectedNodeId));
    },
    addComponent(type: UiComponentType) {
      const { document: next, nodeId } = addNode(selectedDocument, type, selectedNodeId);
      applyDocument(next);
      setSelectedNodeId(nodeId);
    },
    removeSelectedNode() {
      if (!selectedNodeId || selectedNodeId === selectedDocument.rootId) return;
      const fallback = selectedDocument.nodes[selectedNodeId]?.parentId ?? selectedDocument.rootId;
      applyDocument(removeNode(selectedDocument, selectedNodeId));
      setSelectedNodeId(fallback);
    },
    updateSelectedNodeProp(
      key: string,
      value: string | number | boolean | undefined,
    ) {
      if (!selectedNodeId) return;
      applyDocument(updateNodeProps(selectedDocument, selectedNodeId, { [key]: value }));
      if (LIVE_LAYOUTS[selectedDocumentId]) {
        setLivePropOverrides((prev) => ({
          ...prev,
          [selectedNodeId]: { ...(prev[selectedNodeId] ?? {}), [key]: value },
        }));
      }
    },

    // Blocks — file-backed (from blocks/ directory) + in-memory (saved this session)
    fileBlocks: fileBlocksForApp(selectedAppId),
    customBlocks,
    saveSelectionAsBlock(name: string) {
      if (!selectedNodeId || selectedNodeId === selectedDocument.rootId) return;
      const { rootId, nodes } = extractSubtreeAsBlock(selectedDocument, selectedNodeId);
      const block: CustomBlockDef = {
        id: `custom_${Math.random().toString(36).slice(2, 9)}`,
        label: name,
        appId: selectedAppId,
        rootId,
        nodes,
      };
      const next = [...customBlocks, block];
      setCustomBlocks(next);
      saveCustomBlocks(selectedAppId, next);
    },
    deleteCustomBlock(id: string) {
      const next = customBlocks.filter((b) => b.id !== id);
      setCustomBlocks(next);
      saveCustomBlocks(selectedAppId, next);
    },
    addCustomBlock(blockId: string) {
      const block = customBlocks.find((b) => b.id === blockId);
      if (!block) return;
      applyDocument(insertCustomBlockNode(selectedDocument, block, selectedNodeId));
    },
  };
}
