import React from "react";
import { createPortal } from "react-dom";
import { Body, View, YStack } from "@ui";
import { VisualizerProvider } from "@ui/visualizer-context";
import { DARK_THEME_RESOLVED } from "../domain/ui-theme-palette";
import type { UiDocument, UiNodeProps } from "../domain/ui-document.types";
import { renderUiNode } from "../renderers/render-ui-node";
import { LIVE_LAYOUTS } from "../renderers/live-layout-registry";
import { useLiveNodeSelection } from "../renderers/use-live-node-selection";

// Injected once per canvas mount. Keeps selection styling completely out of
// Tamagui's prop pipeline — no style={} mixed with Tamagui shorthands.
const VIZ_CSS = `
  [data-viz-selected="true"] {
    outline: 1.5px solid ${DARK_THEME_RESOLVED.primary} !important;
    outline-offset: -1px;
    border-radius: 3px;
  }
  [data-viz-node], [data-uiid] { cursor: pointer; }
`;

function useVizStyles() {
  React.useEffect(() => {
    const el = document.createElement("style");
    el.dataset.vizStyles = "1";
    el.textContent = VIZ_CSS;
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, []);
}

export function UiCanvasView({
  document,
  selectedNodeId,
  propOverrides,
  onSelectNode,
  useDocumentRenderer = false,
  insertedRootIds = [],
  isActive = false,
}: {
  document: UiDocument;
  selectedNodeId?: string;
  propOverrides: Record<string, Partial<UiNodeProps>>;
  onSelectNode: (nodeId: string) => void;
  useDocumentRenderer?: boolean;
  insertedRootIds?: string[];
  isActive?: boolean;
}) {
  useVizStyles();

  const LiveLayout = LIVE_LAYOUTS[document.id];
  const { attachRef, containerRef } = useLiveNodeSelection(document, onSelectNode);
  const shouldRenderDocument = useDocumentRenderer || !LiveLayout;

  return (
    <YStack ai="center" gap="$3">
      <View
        w={360}
        minHeight={640}
        borderColor={isActive ? "$primary" : "$borderSubtle"}
        borderWidth={isActive ? 2 : 1}
        br={28}
        overflow="hidden"
        // @ts-ignore — web-only drop shadow
        style={{ boxShadow: isActive ? `0 8px 48px rgba(0,0,0,0.60)` : "0 4px 24px rgba(0,0,0,0.35)" }}
      >
        {!shouldRenderDocument ? (
          <VisualizerProvider
            selectedNodeId={selectedNodeId}
            onSelect={onSelectNode}
            propOverrides={propOverrides}
          >
            <div ref={attachRef} style={{ display: "contents" }}>
              <LiveLayout />
            </div>
            <InsertedNodePortals
              document={document}
              selectedNodeId={selectedNodeId}
              insertedRootIds={insertedRootIds}
              onSelectNode={onSelectNode}
              host={containerRef.current}
            />
          </VisualizerProvider>
        ) : (
          renderUiNode(document, document.rootId, selectedNodeId, onSelectNode)
        )}
      </View>

      <Body fontSize="$1" color="$textMuted" opacity={0.5}>
        {document.name}
      </Body>
    </YStack>
  );
}

function InsertedNodePortals({
  document,
  selectedNodeId,
  insertedRootIds,
  onSelectNode,
  host,
}: {
  document: UiDocument;
  selectedNodeId?: string;
  insertedRootIds: string[];
  onSelectNode: (nodeId: string) => void;
  host: HTMLElement | null;
}) {
  const mounts = React.useMemo(
    () =>
      insertedRootIds.map((nodeId) => {
        const parentId = document.nodes[nodeId]?.parentId;
        if (!host || !parentId) return null;
        const mount = host.querySelector(`[data-uiid="${parentId}"]`);
        if (!(mount instanceof HTMLElement)) return null;
        return { nodeId, mount };
      }),
    [document, host, insertedRootIds],
  );

  return (
    <>
      {mounts.map((entry) =>
        entry
          ? createPortal(
              renderUiNode(
                document,
                entry.nodeId,
                selectedNodeId,
                onSelectNode,
              ),
              entry.mount,
              entry.nodeId,
            )
          : null,
      )}
    </>
  );
}
