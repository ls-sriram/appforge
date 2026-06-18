import React from "react";
import { UI_PLAYGROUND_DOCUMENTS } from "../domain/ui-document.fixtures";
import { SCANNED_UI_DOCUMENTS } from "../../../../../generated/ui-documents.example-app";
import { LIVE_LAYOUTS } from "../renderers/live-layout-registry";
import {
  addBlockNode,
  addNode,
  getComponentUsage,
  materializeDocumentState,
  removeNode,
  serializeDocument,
  updateNodeProps,
} from "../domain/ui-document.operations";
import type {
  UiComponentType,
  UiDocument,
  UiEditorTab,
  UiNodeProps,
  UiPreviewState,
} from "../domain/ui-document.types";

// Scanned documents take priority; fall back to hand-crafted fixtures if
// the generator hasn't been run yet or the app has no screen files.
const ALL_DOCUMENTS = SCANNED_UI_DOCUMENTS.length > 0 ? SCANNED_UI_DOCUMENTS : UI_PLAYGROUND_DOCUMENTS;

export function useUiPlayground() {
  const [tab, setTab] = React.useState<UiEditorTab>("design");
  const [previewState, setPreviewState] = React.useState<UiPreviewState>("data");
  const [selectedDocumentId, setSelectedDocumentIdRaw] = React.useState(ALL_DOCUMENTS[0].id);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string>();
  const [showPaywall, setShowPaywall] = React.useState(false);
  const [docOverrides, setDocOverrides] = React.useState<Record<string, UiDocument>>({});
  const [themeOverrides, setThemeOverrides] = React.useState<Record<string, string>>({});
  // Per-node prop overrides for LiveLayout screens (keyed by data-uiid / __uiid).
  const [livePropOverrides, setLivePropOverrides] = React.useState<Record<string, Partial<UiNodeProps>>>({});

  const selectedBaseDocument =
    ALL_DOCUMENTS.find((d: UiDocument) => d.id === selectedDocumentId) ?? ALL_DOCUMENTS[0];
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
  const unsaved =
    Object.keys(docOverrides).length > 0 || Object.keys(themeOverrides).length > 0;
  // IDs of nodes added by the user that are not in the base document (e.g. via
  // addBlock). Only top-level roots of each custom subtree are included — children
  // of custom nodes are rendered recursively by renderUiNode, not listed here.
  const customNodeIds = React.useMemo(() => {
    const all = Object.keys(selectedDocument.nodes).filter(
      (id) => !selectedBaseDocument.nodes[id],
    );
    return all.filter((id) => {
      const parentId = selectedDocument.nodes[id]?.parentId;
      // Top-level: parent exists in the base document (or no parent).
      return !parentId || !!selectedBaseDocument.nodes[parentId];
    });
  }, [selectedDocument, selectedBaseDocument]);

  function applyDocument(next: UiDocument) {
    setDocOverrides((current) => ({ ...current, [documentKey]: next }));
  }

  return {
    tab,
    setTab,
    previewState,
    setPreviewState,
    documents: ALL_DOCUMENTS,
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
    customNodeIds,
    showPaywall,
    setShowPaywall,
    livePropOverrides,
    themeOverrides,
    setThemeOverride(key: string, value: string) {
      setThemeOverrides((prev) => ({ ...prev, [key]: value }));
    },
    addBlock(blockId: string) {
      applyDocument(addBlockNode(selectedDocument, blockId, selectedNodeId));
    },
    addComponent(type: UiComponentType) {
      applyDocument(addNode(selectedDocument, type, selectedNodeId));
    },
    removeSelectedNode() {
      if (!selectedNodeId || selectedNodeId === selectedDocument.rootId) return;
      const fallback =
        selectedDocument.nodes[selectedNodeId]?.parentId ?? selectedDocument.rootId;
      applyDocument(removeNode(selectedDocument, selectedNodeId));
      setSelectedNodeId(fallback);
    },
    updateSelectedNodeProp(key: string, value: string | number | undefined) {
      if (!selectedNodeId) return;
      // Always update the UiDocument so the inspector panel stays in sync.
      applyDocument(updateNodeProps(selectedDocument, selectedNodeId, { [key]: value }));
      // For LiveLayout screens, also push the override into livePropOverrides
      // so the VisualizerProvider propagates it to the wrapped barrel components.
      if (LIVE_LAYOUTS[selectedDocumentId]) {
        setLivePropOverrides((prev) => ({
          ...prev,
          [selectedNodeId]: { ...(prev[selectedNodeId] ?? {}), [key]: value },
        }));
      }
    },
  };
}
