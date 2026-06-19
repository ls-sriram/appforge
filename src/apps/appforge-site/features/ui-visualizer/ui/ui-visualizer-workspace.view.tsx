import React from "react";
import { Pressable, ScrollView } from "react-native";
import { Body, View, XStack, YStack } from "@ui";
import { DARK_THEME_RESOLVED } from "../domain/ui-theme-palette";
import type { DesktopRepoState } from "../use-desktop-repo-source";
import { UiCanvasView } from "./ui-canvas.view";
import { UiCodeView } from "./ui-code.view";
import type { UiDocument, UiEditorTab, UiNodeProps, UiPreviewState } from "../domain/ui-document.types";

export function UiVisualizerWorkspaceView({
  documents,
  selectedDocument,
  selectedDocumentId,
  selectedNodeId,
  livePropOverrides,
  onSelectDocument,
  onSelectNode,
  hasStructureChanges,
  hasOnlyInsertedChanges,
  insertedRootIds,
  tab,
  previewState,
  serialized,
  themeOverrides,
  desktopRepo,
  onSelectRepoSource,
}: {
  documents: UiDocument[];
  selectedDocument: UiDocument;
  selectedDocumentId: string;
  selectedNodeId?: string;
  livePropOverrides: Record<string, Partial<UiNodeProps>>;
  onSelectDocument: (id: string) => void;
  onSelectNode: (id: string) => void;
  hasStructureChanges: boolean;
  hasOnlyInsertedChanges: boolean;
  insertedRootIds: string[];
  tab: UiEditorTab;
  previewState: UiPreviewState;
  serialized: string;
  themeOverrides: Record<string, string>;
  desktopRepo: DesktopRepoState;
  onSelectRepoSource: () => void;
}) {
  const canvasRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const toClear = Array.from({ length: el.style.length }, (_, i) => el.style[i]).filter((p) => p.startsWith("--"));
    toClear.forEach((p) => el.style.removeProperty(p));
    Object.entries(themeOverrides).forEach(([k, v]) => el.style.setProperty(`--${k}`, v));
  }, [themeOverrides]);

  return (
    // @ts-ignore
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
        {desktopRepo.isDesktop && desktopRepo.loaded && !desktopRepo.repoValid && (
          <View
            position="absolute"
            top={24}
            left={24}
            right={24}
            zIndex={40}
            bg="$surfaceStrong"
            borderColor="$warning"
            borderWidth={1}
            p="$4"
          >
            <YStack gap="$3">
              <Body fontSize="$2" color="$textPrimary" fontFamily="$bold">
                Select an AppForge repository to start editing
              </Body>
              <Body fontSize="$2" color="$textMuted">
                This desktop bundle writes layout changes back into the repo you choose.
              </Body>
              <XStack>
                <Pressable onPress={onSelectRepoSource} disabled={desktopRepo.selecting}>
                  {({ pressed }: { pressed: boolean }) => (
                    <View
                      px="$3"
                      h={30}
                      jc="center"
                      bg={pressed ? "$primaryMuted" : "$primary"}
                    >
                      <Body fontSize="$1" color="$textInverse" fontFamily="$bold">
                        {desktopRepo.selecting ? "Selecting…" : "Choose Repo"}
                      </Body>
                    </View>
                  )}
                </Pressable>
              </XStack>
            </YStack>
          </View>
        )}
        {tab === "code" ? (
          <UiCodeView
            documentName={selectedDocument.name}
            previewState={previewState}
            serialized={serialized}
          />
        ) : (
          <ScrollView horizontal contentContainerStyle={{ alignItems: "flex-start", paddingVertical: 48, paddingHorizontal: 48, gap: 48 }}>
            {documents.map((doc) => {
              const isSelected = doc.id === selectedDocumentId;
              return (
                <UiCanvasView
                  key={doc.id}
                  document={isSelected ? selectedDocument : doc}
                  selectedNodeId={isSelected ? selectedNodeId : undefined}
                  propOverrides={isSelected ? livePropOverrides : {}}
                  onSelectNode={(nodeId) => {
                    if (!isSelected) onSelectDocument(doc.id);
                    onSelectNode(nodeId);
                  }}
                  useDocumentRenderer={isSelected && hasStructureChanges && !hasOnlyInsertedChanges}
                  insertedRootIds={isSelected ? insertedRootIds : []}
                  isActive={isSelected}
                />
              );
            })}
          </ScrollView>
        )}
      </YStack>
    </div>
  );
}
