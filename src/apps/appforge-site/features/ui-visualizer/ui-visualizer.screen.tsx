import React from "react";
import { Pressable, ScrollView } from "react-native";
import {
  Body,
  Icon,
  SafeAreaView,
  View,
  XStack,
  YStack,
} from "../../../../ui";
import { DARK_THEME_RESOLVED } from "./domain/ui-theme-palette";
import { useUiPlayground } from "./state/use-ui-playground";
import { ScreenLibrary } from "./views/ui-context-tree.view";
import { UiCanvasView } from "./views/ui-canvas.view";
import { UiInspectorView } from "./views/ui-inspector.view";
import { UiCodeView } from "./views/ui-code.view";
import { UiTokenPaletteView } from "./views/ui-token-palette.view";
import { UiPrimitivePalette, UiCustomBlocksPanel } from "./views/ui-component-palette.view";
import type { UiEditorTab } from "./domain/ui-document.types";

// ── Atoms ─────────────────────────────────────────────────────────────────────

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
        <XStack ai="center" gap="$1">
          <Body fontSize="$2" color={open ? "$textPrimary" : "$textSecondary"} fontFamily="$bold">
            {current?.displayName ?? selectedAppId}
          </Body>
          <Body fontSize={9} color="$textMuted">▾</Body>
        </XStack>
      </Pressable>
      {open && (
        <View
          style={{ position: "absolute", top: 28, left: 0, zIndex: 300, minWidth: 160 }}
          bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} overflow="hidden"
        >
          {apps.map((app) => {
            const active = app.id === selectedAppId;
            return (
              <Pressable key={app.id} onPress={() => { onSelect(app.id); setOpen(false); }}>
                {({ pressed }: { pressed: boolean }) => (
                  <XStack
                    ai="center" gap="$2" px="$3" py="$2"
                    borderBottomColor="$borderSubtle" borderBottomWidth={1}
                    bg={pressed ? "$errorMuted" : active ? "$surfaceAlt" : "transparent"}
                  >
                    <Body fontSize="$1" color={active ? "$textPrimary" : "$textSecondary"}>{app.displayName}</Body>
                  </XStack>
                )}
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

type LeftMode = "components" | "blocks" | "screens";

export function AppforgeSiteUiVisualizerScreen() {
  const pg = useUiPlayground();
  const [leftMode, setLeftMode] = React.useState<LeftMode>("components");
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);

  const LEFT_W = 220;
  const RIGHT_W = 300;

  // Apply token overrides ONLY to the canvas element so they don't leak into panels.
  // Inline style.setProperty() scopes CSS custom properties to that DOM subtree.
  const canvasRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    // Clear any previously injected vars
    const toClear = Array.from({ length: el.style.length }, (_, i) => el.style[i]).filter((p) => p.startsWith("--"));
    toClear.forEach((p) => el.style.removeProperty(p));
    // Apply current overrides scoped to canvas
    Object.entries(pg.themeOverrides).forEach(([k, v]) => el.style.setProperty(`--${k}`, v));
  }, [pg.themeOverrides]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack bg="$bg" f={1}>

        {/* ── Top bar ── */}
        <XStack ai="center" gap="$3" px="$3" h={40} bg="$surfaceAlt" borderBottomColor="$borderSubtle" borderBottomWidth={1} flexShrink={0}>
          {/* Brand */}
          <XStack ai="center" gap="$2" flexShrink={0}>
            <Icon name="flask" size="sm" tone="accent" />
            <Body fontSize="$2" color="$textPrimary" fontFamily="$bold">AppForge</Body>
          </XStack>

          <Body color="$borderSubtle" fontSize="$2">/</Body>

          <ProjectSelector
            apps={pg.availableApps}
            selectedAppId={pg.selectedAppId}
            onSelect={pg.setSelectedAppId}
          />

          <Body color="$textMuted" fontSize="$1">/</Body>

          <Body color="$textMuted" fontSize="$1" numberOfLines={1}>{pg.selectedDocument.name}</Body>

          <View f={1} />

          {/* Flat tab switcher */}
          <XStack ai="center" borderColor="$borderSubtle" borderWidth={1}>
            {(["design", "code", "tokens"] as UiEditorTab[]).map((t, i, arr) => (
              <Pressable key={t} onPress={() => pg.setTab(t)}>
                {({ pressed }: { pressed: boolean }) => (
                  <View
                    px="$3" h={28} jc="center"
                    bg={pressed ? "$errorMuted" : pg.tab === t ? "$surfaceStrong" : "transparent"}
                    borderRightColor="$borderSubtle"
                    borderRightWidth={i < arr.length - 1 ? 1 : 0}
                  >
                    <Body
                      fontSize="$1"
                      color={pg.tab === t ? "$textPrimary" : "$textSecondary"}
                      fontFamily={pg.tab === t ? "$bold" : "$reg"}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Body>
                  </View>
                )}
              </Pressable>
            ))}
          </XStack>

          {/* Save */}
          <Pressable onPress={pg.save} disabled={pg.saveStatus === "saving"}>
            {({ pressed }: { pressed: boolean }) => (
              <View
                px="$3" h={28} jc="center"
                bg={
                  pg.saveStatus === "saved" ? "$success" :
                  pg.saveStatus === "error" ? "$error" :
                  pressed ? "$primaryMuted" : "$primary"
                }
                // @ts-ignore
                style={{ opacity: pg.saveStatus === "saving" ? 0.6 : 1 }}
              >
                <Body fontSize="$1" color="$textInverse" fontFamily="$bold">
                  {pg.saveStatus === "saving" ? "Saving…" :
                   pg.saveStatus === "saved"  ? "Saved ✓" :
                   pg.saveStatus === "error"  ? "Error" : "Save"}
                </Body>
              </View>
            )}
          </Pressable>
        </XStack>

        {/* ── Workspace ── */}
        <XStack f={1} minHeight={0} overflow="hidden">

          {/* Left panel */}
          <View bg="$surfaceAlt" flexShrink={0} overflow="hidden"
            // @ts-ignore
            style={{ width: leftCollapsed ? 0 : LEFT_W, transition: "width 220ms ease", minWidth: 0 }}>
            <XStack px="$2" py="$2" gap="$1" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
              {([
                { key: "components", label: "Components" },
                { key: "blocks",     label: "My Blocks" },
                { key: "screens",    label: "Screens" },
              ] as { key: LeftMode; label: string }[]).map(({ key, label }) => (
                <Pressable key={key} onPress={() => setLeftMode(key)}>
                  <View px="$2" py="$1" bg={leftMode === key ? "$surfaceStrong" : "transparent"}>
                    <Body fontSize="$1" color={leftMode === key ? "$textPrimary" : "$textMuted"}>
                      {label}
                    </Body>
                  </View>
                </Pressable>
              ))}
            </XStack>
            <ScrollView>
              {leftMode === "components" && (
                <UiPrimitivePalette onAdd={pg.addComponent} />
              )}
              {leftMode === "blocks" && (
                <UiCustomBlocksPanel
                  fileBlocks={pg.fileBlocks}
                  customBlocks={pg.customBlocks}
                  onAdd={pg.addCustomBlock}
                  onDelete={pg.deleteCustomBlock}
                />
              )}
              {leftMode === "screens" && (
                <ScreenLibrary
                  documents={pg.documents}
                  selectedDocumentId={pg.selectedDocumentId}
                  onSelectDocument={pg.setSelectedDocumentId}
                />
              )}
            </ScrollView>
          </View>

          <PanelHandle side="left" collapsed={leftCollapsed} onToggle={() => setLeftCollapsed(v => !v)} />

          {/* Center — Canvas or Code (ref'd so token overrides are scoped here only) */}
          {/* @ts-ignore */}
          <div ref={canvasRef} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative" }}>
          <YStack f={1} minWidth={0} position="relative">
            <View
              position="absolute" top={0} left={0} right={0} bottom={0}
              pointerEvents="none"
              // @ts-ignore
              style={{
                backgroundImage: `radial-gradient(circle, ${DARK_THEME_RESOLVED.borderSubtle} 1px, transparent 1px)`,
                backgroundSize: "22px 22px",
                backgroundColor: DARK_THEME_RESOLVED.bg,
              }}
            />
            {pg.tab === "code" ? (
              <UiCodeView
                documentName={pg.selectedDocument.name}
                previewState={pg.previewState}
                serialized={pg.serialized}
              />
            ) : (
              <ScrollView horizontal contentContainerStyle={{ alignItems: "flex-start", paddingVertical: 48, paddingHorizontal: 48, gap: 48 }}>
                {pg.documents.map((doc) => {
                  const isSelected = doc.id === pg.selectedDocumentId;
                  return (
                    <UiCanvasView
                      key={doc.id}
                      document={isSelected ? pg.selectedDocument : doc}
                      selectedNodeId={isSelected ? pg.selectedNodeId : undefined}
                      propOverrides={isSelected ? pg.livePropOverrides : {}}
                      onSelectNode={(nodeId) => {
                        if (!isSelected) pg.setSelectedDocumentId(doc.id);
                        pg.setSelectedNodeId(nodeId);
                      }}
                      useDocumentRenderer={isSelected && pg.hasStructureChanges && !pg.hasOnlyInsertedChanges}
                      insertedRootIds={isSelected ? pg.insertedRootIds : []}
                      isActive={isSelected}
                    />
                  );
                })}
              </ScrollView>
            )}
          </YStack>
          </div>

          <PanelHandle side="right" collapsed={rightCollapsed} onToggle={() => setRightCollapsed(v => !v)} />

          {/* Right panel — Editor or Tokens */}
          <View bg="$surfaceAlt" flexShrink={0} overflow="hidden"
            // @ts-ignore
            style={{ width: rightCollapsed ? 0 : RIGHT_W, transition: "width 220ms ease", minWidth: 0 }}>
            {pg.tab === "tokens" && (
              <XStack px="$3" h={36} ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
                <Body fontSize="$2" color="$textPrimary" fontFamily="$bold">Tokens</Body>
              </XStack>
            )}
            {pg.tab === "tokens" ? (
              <ScrollView style={{ flex: 1 }}>
                <UiTokenPaletteView
                themeOverrides={pg.themeOverrides}
                onSetOverride={pg.setThemeOverride}
                onClearOverride={pg.clearThemeOverride}
                onClearAll={pg.clearAllThemeOverrides}
                onApplyPreset={pg.applyThemePreset}
              />
              </ScrollView>
            ) : (
              <UiInspectorView
                node={pg.selectedNode}
                document={pg.selectedDocument}
                selectedNodeId={pg.selectedNodeId}
                onSelectNode={pg.setSelectedNodeId}
                onUpdateProp={pg.updateSelectedNodeProp}
                onRemove={pg.removeSelectedNode}
                onAddChild={pg.addComponent}
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
          {(pg.fileBlocks.length + pg.customBlocks.length) > 0 && (
            <Body fontSize="$1" color="$textMuted">{pg.fileBlocks.length + pg.customBlocks.length} block{(pg.fileBlocks.length + pg.customBlocks.length) !== 1 ? "s" : ""}</Body>
          )}
          <Body fontSize="$1" color="$textMuted">{pg.componentUsage.length} component types</Body>
        </XStack>
      </YStack>

    </SafeAreaView>
  );
}
