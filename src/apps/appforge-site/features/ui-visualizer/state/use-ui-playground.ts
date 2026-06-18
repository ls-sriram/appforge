import React from "react";
import { UI_PLAYGROUND_DOCUMENTS } from "../domain/ui-document.fixtures";
import {
  UI_DOCUMENTS_REGISTRY,
  REGISTRY_APP_NAMES,
} from "../../../../../generated/ui-documents.registry";
import { LIVE_LAYOUTS } from "../renderers/live-layout-registry";
import {
  addBlockNode,
  addNode,
  extractSubtreeAsBlock,
  getComponentUsage,
  hasStructuralChanges,
  insertCustomBlockNode,
  materializeDocumentState,
  removeNode,
  serializeDocument,
  updateNodeProps,
} from "../domain/ui-document.operations";
import type {
  CustomBlockDef,
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
  const [showPaywall, setShowPaywall] = React.useState(false);
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

  function applyDocument(next: UiDocument) {
    setDocOverrides((current) => ({ ...current, [documentKey]: next }));
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
    showPaywall,
    setShowPaywall,
    livePropOverrides,

    // Tokens
    themeOverrides,
    setThemeOverride(key: string, value: string) {
      setThemeOverrides((prev) => ({ ...prev, [key]: value }));
    },

    // Block library operations
    addBlock(blockId: string) {
      applyDocument(addBlockNode(selectedDocument, blockId, selectedNodeId));
    },
    addComponent(type: UiComponentType) {
      applyDocument(addNode(selectedDocument, type, selectedNodeId));
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

    // Custom blocks
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
