import React from "react";
import { UI_PLAYGROUND_DOCUMENTS } from "../domain/ui-document.fixtures";
import {
  UI_DOCUMENTS_REGISTRY,
  REGISTRY_APP_NAMES,
} from "../../../../../generated/ui-documents.registry";
import { UI_BLOCKS_REGISTRY } from "../../../../../generated/ui-blocks.registry";
import { useDesktopRepoSource } from "../use-desktop-repo-source";
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

type PendingChange = {
  sourcePath: string;
  documentName: string;
  content: string;
  stagedAt: number;
};

export function useUiPlayground() {
  const repo = useDesktopRepoSource();

  // Runtime app list + documents — populated via IPC when running inside the desktop shell.
  const [runtimeApps, setRuntimeApps] = React.useState<typeof AVAILABLE_APPS | null>(null);
  const [runtimeDocs, setRuntimeDocs] = React.useState<UiDocument[] | null>(null);
  const [runtimeBlocks, setRuntimeBlocks] = React.useState<UiBlock[] | null>(null);
  const [docsLoading, setDocsLoading] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Load available apps from the selected repo once it's valid.
  React.useEffect(() => {
    if (!repo.isDesktop || !repo.repoValid || !repo.loaded) return;
    window.appforgeDesktop!.listApps().then((apps) => setRuntimeApps(apps)).catch(console.error);
  }, [repo.isDesktop, repo.repoValid, repo.loaded]);

  const availableApps = runtimeApps ?? AVAILABLE_APPS;

  const [selectedAppId, setSelectedAppIdRaw] = React.useState<string>(
    () => lsGet("appforge:selected-app") ?? AVAILABLE_APPS[0]?.id ?? "example-app",
  );

  // Scan documents from the selected repo whenever the app, repo, or refresh changes.
  React.useEffect(() => {
    if (!repo.isDesktop || !repo.repoValid || !repo.loaded) return;
    setDocsLoading(true);
    setRuntimeDocs(null);
    setRuntimeBlocks(null);
    window.appforgeDesktop!.scanApp({ appId: selectedAppId })
      .then(({ documents, blocks }) => {
        setRuntimeDocs(documents.length > 0 ? documents : null);
        setRuntimeBlocks(blocks ?? null);
        setDocsLoading(false);
      })
      .catch((err) => {
        console.error("[desktop] scanApp failed:", err);
        setDocsLoading(false);
      });
  }, [repo.isDesktop, repo.repoValid, repo.loaded, selectedAppId, refreshKey]);

  const allDocs = React.useMemo(
    () => runtimeDocs ?? docsForApp(selectedAppId),
    [runtimeDocs, selectedAppId],
  );

  const [tab, setTab] = React.useState<UiEditorTab>("design");
  const [previewState, setPreviewState] = React.useState<UiPreviewState>("data");
  const [selectedDocumentId, setSelectedDocumentIdRaw] = React.useState(allDocs[0].id);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string>();
  const [pendingChanges, setPendingChanges] = React.useState<PendingChange[]>([]);
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

  function stageChange() {
    if (!selectedDocument.sourcePath) {
      console.warn("[stage] document has no sourcePath — cannot stage");
      return;
    }
    const content = generateLayoutFile(selectedDocument);
    const change: PendingChange = {
      sourcePath: selectedDocument.sourcePath,
      documentName: selectedDocument.name,
      content,
      stagedAt: Date.now(),
    };
    setPendingChanges((prev) => {
      const without = prev.filter((c) => c.sourcePath !== change.sourcePath);
      return [...without, change];
    });
    // Clear in-memory override for this document — the staged version is now the intent
    setDocOverrides((prev) => { const next = { ...prev }; delete next[documentKey]; return next; });
  }

  function refresh() {
    setDocOverrides({});
    setLivePropOverrides({});
    setThemeOverrides({});
    setPendingChanges([]);
    setRefreshKey((k) => k + 1);
  }

  function copyChangesContext() {
    const text = pendingChanges
      .map((c) => `Update \`${c.sourcePath}\` with the following content:\n\`\`\`tsx\n${c.content}\n\`\`\``)
      .join("\n\n");
    navigator.clipboard?.writeText(text).catch(console.error);
  }

  return {
    // App selection
    availableApps,
    docsLoading,
    selectedAppId,
    setSelectedAppId(appId: string) {
      setSelectedAppIdRaw(appId);
      lsSet("appforge:selected-app", appId);
      setRuntimeDocs(null);
      setRuntimeBlocks(null);
      const docs = runtimeDocs ?? docsForApp(appId);
      setSelectedDocumentIdRaw(docs[0]?.id ?? docsForApp(appId)[0]?.id);
      setDocOverrides({});
      setLivePropOverrides({});
      setThemeOverrides({});
      setPendingChanges([]);
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
    pendingChanges,
    stageChange,
    refresh,
    copyChangesContext,
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
    fileBlocks: runtimeBlocks ?? fileBlocksForApp(selectedAppId),
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
