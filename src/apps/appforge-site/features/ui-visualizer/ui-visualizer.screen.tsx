import React from "react";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";
import {
  Body,
  Button,
  Heading,
  Icon,
  SafeAreaView,
  View,
  XStack,
  YStack,
} from "../../../../ui";
import { useUiPlayground } from "./state/use-ui-playground";
import { ScreenLibrary } from "./views/ui-context-tree.view";
import { UiCanvasView } from "./views/ui-canvas.view";
import { UiInspectorView } from "./views/ui-inspector.view";
import { UiCodeView } from "./views/ui-code.view";
import { UiTokenPaletteView } from "./views/ui-token-palette.view";
import { UiComponentPalette } from "./views/ui-component-palette.view";
import { UiPaywallOverlay } from "./views/ui-paywall-overlay.view";
import type { UiEditorTab, UiPreviewState } from "./domain/ui-document.types";

// ── Atoms ─────────────────────────────────────────────────────────────────────

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View px="$3" h={28} jc="center" br="$2" bg={active ? "$surfaceStrong" : "transparent"}>
        <Body fontSize="$2" color={active ? "$textPrimary" : "$textMuted"} fontFamily={active ? "$bold" : "$reg"}>
          {label}
        </Body>
      </View>
    </Pressable>
  );
}

function PreviewPill({ state, active, onPress }: { state: UiPreviewState; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View px="$2" h={22} jc="center" br={999} bg={active ? "$primaryMuted" : "transparent"} borderColor={active ? "$primary" : "$borderSubtle"} borderWidth={1}>
        <Body fontSize="$1" color={active ? "$primary" : "$textMuted"}>{state}</Body>
      </View>
    </Pressable>
  );
}

// ── Project selector dropdown ─────────────────────────────────────────────────

function ProjectSelector({
  apps,
  selectedAppId,
  onSelect,
}: {
  apps: { id: string; displayName: string }[];
  selectedAppId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const current = apps.find((a) => a.id === selectedAppId);

  return (
    <View style={{ position: "relative" }}>
      <Pressable onPress={() => setOpen((v) => !v)}>
        <XStack
          ai="center" gap="$1" px="$2" py="$1" br="$2"
          bg="$surfaceStrong" borderColor={open ? "$primary" : "$borderSubtle"} borderWidth={1}
        >
          <Body fontSize="$1" color="$textSecondary">{current?.displayName ?? selectedAppId}</Body>
          <Body fontSize="$1" color="$textMuted">▾</Body>
        </XStack>
      </Pressable>
      {open && (
        <View
          style={{ position: "absolute", top: 30, left: 0, zIndex: 300, minWidth: 160 }}
          bg="$surfaceStrong" borderColor="$border" borderWidth={1} br="$2" overflow="hidden"
        >
          {apps.map((app) => {
            const active = app.id === selectedAppId;
            return (
              <Pressable key={app.id} onPress={() => { onSelect(app.id); setOpen(false); }}>
                <XStack
                  ai="center" gap="$2" px="$3" py="$2"
                  bg={active ? "$surfaceAlt" : "transparent"}
                >
                  <View w={6} h={6} br={999} bg={active ? "$primary" : "$border"} />
                  <Body fontSize="$2" color={active ? "$textPrimary" : "$textSecondary"}>{app.displayName}</Body>
                </XStack>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ── Panel collapse handle ─────────────────────────────────────────────────────

function PanelHandle({ side, collapsed, onToggle }: { side: "left" | "right"; collapsed: boolean; onToggle: () => void }) {
  const chevron = collapsed ? (side === "left" ? "›" : "‹") : (side === "left" ? "‹" : "›");
  return (
    <Pressable onPress={onToggle} style={{ alignSelf: "stretch", display: "flex" }}>
      <View w={12} f={1} ai="center" jc="center" bg="$surfaceStrong" borderLeftColor="$borderSubtle" borderLeftWidth={1} borderRightColor="$borderSubtle" borderRightWidth={1}
        // @ts-ignore
        style={{ cursor: "col-resize" }}>
        <Body fontSize={9} color="$textMuted" opacity={0.5}>{chevron}</Body>
      </View>
    </Pressable>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

type LeftMode = "blocks" | "screens";

export function AppforgeSiteUiVisualizerScreen() {
  const pg = useUiPlayground();
  const [leftMode, setLeftMode] = React.useState<LeftMode>("blocks");
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);

  const LEFT_W = 180;
  const RIGHT_W = 230;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack bg="$bg" f={1}>

        {/* ── Top bar ── */}
        <XStack ai="center" gap="$3" px="$4" h={44} bg="$surfaceAlt" borderBottomColor="$borderSubtle" borderBottomWidth={1} flexShrink={0}>
          <XStack ai="center" gap="$2" flexShrink={0}>
            <Icon name="flask" size="sm" tone="accent" />
            <Heading fontFamily="$bold" fontSize="$3">AppForge</Heading>
          </XStack>
          <Body color="$textMuted" fontSize="$1">/</Body>

          <ProjectSelector
            apps={pg.availableApps}
            selectedAppId={pg.selectedAppId}
            onSelect={pg.setSelectedAppId}
          />

          <Body color="$textMuted" fontSize="$1" numberOfLines={1}>{pg.selectedDocument.name}</Body>

          <View f={1} />

          <XStack ai="center" gap="$1">
            {(["data", "loading", "empty", "error"] as UiPreviewState[]).map((s) => (
              <PreviewPill key={s} state={s} active={pg.previewState === s} onPress={() => pg.setPreviewState(s)} />
            ))}
          </XStack>

          <XStack ai="center" gap="$1" px="$1" py="$1" br="$3" bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1}>
            {(["design", "code", "tokens"] as UiEditorTab[]).map((t) => (
              <Tab key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} active={pg.tab === t} onPress={() => pg.setTab(t)} />
            ))}
          </XStack>

          <Button bg="$primary" onPress={() => pg.setShowPaywall(true)}>
            <Body color="$textInverse" fontFamily="$bold" fontSize="$2">Save</Body>
          </Button>
        </XStack>

        {/* ── Workspace ── */}
        <XStack f={1} minHeight={0} overflow="hidden">

          {/* Left panel */}
          <View bg="$surfaceAlt" flexShrink={0} overflow="hidden"
            // @ts-ignore
            style={{ width: leftCollapsed ? 0 : LEFT_W, transition: "width 220ms ease", minWidth: 0 }}>
            <XStack px="$2" py="$2" gap="$1" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
              {(["blocks", "screens"] as LeftMode[]).map((m) => (
                <Pressable key={m} onPress={() => setLeftMode(m)}>
                  <View px="$2" py="$1" br="$2" bg={leftMode === m ? "$surfaceStrong" : "transparent"}>
                    <Body fontSize="$1" color={leftMode === m ? "$textPrimary" : "$textMuted"}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </Body>
                  </View>
                </Pressable>
              ))}
            </XStack>
            <ScrollView>
              {leftMode === "blocks" ? (
                <UiComponentPalette
                  onAddBlock={(blockId) => pg.addBlock(blockId)}
                  onAddCustomBlock={(blockId) => pg.addCustomBlock(blockId)}
                  customBlocks={pg.customBlocks}
                  onDeleteCustomBlock={pg.deleteCustomBlock}
                />
              ) : (
                <ScreenLibrary
                  documents={pg.documents}
                  selectedDocumentId={pg.selectedDocumentId}
                  onSelectDocument={pg.setSelectedDocumentId}
                />
              )}
            </ScrollView>
          </View>

          <PanelHandle side="left" collapsed={leftCollapsed} onToggle={() => setLeftCollapsed(v => !v)} />

          {/* Center — Canvas or Code */}
          <YStack f={1} minWidth={0} position="relative">
            <View
              position="absolute" top={0} left={0} right={0} bottom={0}
              pointerEvents="none"
              // @ts-ignore
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                backgroundColor: "#0a0a0e",
              }}
            />
            {pg.tab === "code" ? (
              <UiCodeView
                documentName={pg.selectedDocument.name}
                previewState={pg.previewState}
                serialized={pg.serialized}
              />
            ) : (
              <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingVertical: 48, paddingHorizontal: 32 }}>
                <UiCanvasView
                  document={pg.selectedDocument}
                  selectedNodeId={pg.selectedNodeId}
                  propOverrides={pg.livePropOverrides}
                  onSelectNode={pg.setSelectedNodeId}
                  useDocumentRenderer={pg.hasStructureChanges && !pg.hasOnlyInsertedChanges}
                  insertedRootIds={pg.insertedRootIds}
                />
              </ScrollView>
            )}
          </YStack>

          <PanelHandle side="right" collapsed={rightCollapsed} onToggle={() => setRightCollapsed(v => !v)} />

          {/* Right panel — Inspector or Tokens */}
          <View bg="$surfaceAlt" flexShrink={0} overflow="hidden"
            // @ts-ignore
            style={{ width: rightCollapsed ? 0 : RIGHT_W, transition: "width 220ms ease", minWidth: 0 }}>
            <XStack px="$2" py="$2" gap="$1" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
              <View px="$2" py="$1" br="$2" bg="$surfaceStrong">
                <Body fontSize="$1" color="$textPrimary">
                  {pg.tab === "tokens" ? "Tokens" : "Inspector"}
                </Body>
              </View>
            </XStack>
            {pg.tab === "tokens" ? (
              <ScrollView style={{ flex: 1 }}>
                <UiTokenPaletteView themeOverrides={pg.themeOverrides} onSetOverride={pg.setThemeOverride} />
              </ScrollView>
            ) : (
              <UiInspectorView
                node={pg.selectedNode}
                document={pg.selectedDocument}
                selectedNodeId={pg.selectedNodeId}
                onSelectNode={pg.setSelectedNodeId}
                onUpdateProp={pg.updateSelectedNodeProp}
                onRemove={pg.removeSelectedNode}
                onSaveBlock={pg.saveSelectionAsBlock}
              />
            )}
          </View>
        </XStack>

        {/* ── Status bar ── */}
        <XStack h={24} ai="center" gap="$4" px="$3" bg="$surfaceAlt" borderTopColor="$borderSubtle" borderTopWidth={1} flexShrink={0}>
          <XStack ai="center" gap="$2">
            <View w={6} h={6} br={999} bg="$success" />
            <Body fontSize="$1" color="$textMuted">editor live</Body>
          </XStack>
          <Body fontSize="$1" color="$textMuted">{pg.selectedAppId}</Body>
          <Body fontSize="$1" color={pg.unsaved ? "$warning" : "$textMuted"}>
            {pg.unsaved ? "unsaved changes" : "clean"}
          </Body>
          <View f={1} />
          {pg.customBlocks.length > 0 && (
            <Body fontSize="$1" color="$textMuted">{pg.customBlocks.length} saved block{pg.customBlocks.length !== 1 ? "s" : ""}</Body>
          )}
          <Body fontSize="$1" color="$textMuted">{pg.componentUsage.length} component types</Body>
        </XStack>
      </YStack>

      {pg.showPaywall ? <UiPaywallOverlay onClose={() => pg.setShowPaywall(false)} /> : null}
    </SafeAreaView>
  );
}
