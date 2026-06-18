import React from "react";
import { Body, View, YStack } from "../../../../../ui";
import { VisualizerProvider } from "../../../../../ui/visualizer-context";
import type { UiDocument, UiNodeProps } from "../domain/ui-document.types";
import { renderUiNode } from "../renderers/render-ui-node";
import { LIVE_LAYOUTS } from "../renderers/live-layout-registry";
import { useLiveNodeSelection } from "../renderers/use-live-node-selection";

// Injected once per canvas mount. Keeps selection styling completely out of
// Tamagui's prop pipeline — no style={} mixed with Tamagui shorthands.
const VIZ_CSS = `
  [data-viz-selected="true"] {
    outline: 1.5px solid #4F8EF7 !important;
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
  customNodeIds = [],
}: {
  document: UiDocument;
  selectedNodeId?: string;
  propOverrides: Record<string, Partial<UiNodeProps>>;
  onSelectNode: (nodeId: string) => void;
  customNodeIds?: string[];
}) {
  useVizStyles();

  const LiveLayout = LIVE_LAYOUTS[document.id];
  const { attachRef } = useLiveNodeSelection(document, onSelectNode);

  return (
    <YStack ai="center" gap="$3">
      <View
        w={360}
        minHeight={640}
        borderColor="rgba(255,255,255,0.10)"
        borderWidth={1}
        br={28}
        overflow="hidden"
        // @ts-ignore — web-only drop shadow
        style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.60)" }}
      >
        {LiveLayout ? (
          <VisualizerProvider
            selectedNodeId={selectedNodeId}
            onSelect={onSelectNode}
            propOverrides={propOverrides}
          >
            <div ref={attachRef} style={{ display: "contents" }}>
              <LiveLayout />
            </div>
          </VisualizerProvider>
        ) : (
          renderUiNode(document, document.rootId, selectedNodeId, onSelectNode)
        )}
      </View>

      {/* Custom-added blocks (not part of the live component tree) rendered
          below the phone frame so the LiveLayout's own styling stays intact. */}
      {LiveLayout && customNodeIds.length > 0 && (
        <View
          w={360}
          br={16}
          borderColor="rgba(255,255,255,0.10)"
          borderWidth={1}
          overflow="hidden"
          // @ts-ignore
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.40)" }}
        >
          <Body
            px="$3"
            py="$2"
            fontSize="$1"
            color="$textMuted"
            opacity={0.5}
            // @ts-ignore
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            Added blocks
          </Body>
          <YStack p="$3" gap="$3">
            {customNodeIds.map((id) =>
              renderUiNode(document, id, selectedNodeId, onSelectNode),
            )}
          </YStack>
        </View>
      )}

      <Body fontSize="$1" color="$textMuted" opacity={0.5}>
        {document.name}
      </Body>
    </YStack>
  );
}
