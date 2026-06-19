import React from "react";
import { SafeAreaView, XStack, YStack } from "@ui";
import { useUiPlayground } from "./viewmodel/use-ui-playground";
import { useDesktopRepoSource } from "./use-desktop-repo-source";
import { UiPanelHandleView } from "./ui/ui-panel-handle.view";
import {
  UiVisualizerLeftPanelView,
  type UiVisualizerLeftMode,
} from "./ui/ui-visualizer-left-panel.view";
import { UiVisualizerRightPanelView } from "./ui/ui-visualizer-right-panel.view";
import { UiVisualizerStatusbarView } from "./ui/ui-visualizer-statusbar.view";
import { UiVisualizerTopbarView } from "./ui/ui-visualizer-topbar.view";
import { UiVisualizerWorkspaceView } from "./ui/ui-visualizer-workspace.view";

export function AppforgeSiteUiVisualizerScreen() {
  const pg = useUiPlayground();
  const desktopRepo = useDesktopRepoSource();
  const [leftMode, setLeftMode] = React.useState<UiVisualizerLeftMode>("components");
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);

  const LEFT_W = 220;
  const RIGHT_W = 300;
  const stageDisabled = !pg.unsaved ||
    (desktopRepo.isDesktop && desktopRepo.loaded && !desktopRepo.repoValid);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack bg="$bg" f={1}>
        <UiVisualizerTopbarView
          apps={pg.availableApps}
          selectedAppId={pg.selectedAppId}
          selectedDocumentName={pg.selectedDocument.name}
          onSelectApp={pg.setSelectedAppId}
          desktopRepo={desktopRepo}
          onSelectRepoSource={desktopRepo.selectRepoSource}
          tab={pg.tab}
          onSelectTab={pg.setTab}
          pendingCount={pg.pendingChanges.length}
          stageDisabled={stageDisabled}
          onStage={pg.stageChange}
          onRefresh={pg.refresh}
        />

        <XStack f={1} minHeight={0} overflow="hidden">
          <UiVisualizerLeftPanelView
            width={LEFT_W}
            collapsed={leftCollapsed}
            mode={leftMode}
            onSelectMode={setLeftMode}
            onAddComponent={pg.addComponent}
            fileBlocks={pg.fileBlocks}
            customBlocks={pg.customBlocks}
            onAddCustomBlock={pg.addCustomBlock}
            onDeleteCustomBlock={pg.deleteCustomBlock}
            documents={pg.documents}
            selectedDocumentId={pg.selectedDocumentId}
            onSelectDocument={pg.setSelectedDocumentId}
          />

          <UiPanelHandleView
            side="left"
            collapsed={leftCollapsed}
            onToggle={() => setLeftCollapsed((v) => !v)}
          />

          <UiVisualizerWorkspaceView
            documents={pg.documents}
            selectedDocument={pg.selectedDocument}
            selectedDocumentId={pg.selectedDocumentId}
            selectedNodeId={pg.selectedNodeId}
            livePropOverrides={pg.livePropOverrides}
            onSelectDocument={pg.setSelectedDocumentId}
            onSelectNode={pg.setSelectedNodeId}
            hasStructureChanges={pg.hasStructureChanges}
            hasOnlyInsertedChanges={pg.hasOnlyInsertedChanges}
            insertedRootIds={pg.insertedRootIds}
            tab={pg.tab}
            previewState={pg.previewState}
            serialized={pg.serialized}
            themeOverrides={pg.themeOverrides}
            desktopRepo={desktopRepo}
            onSelectRepoSource={desktopRepo.selectRepoSource}
          />

          <UiPanelHandleView
            side="right"
            collapsed={rightCollapsed}
            onToggle={() => setRightCollapsed((v) => !v)}
          />

          <UiVisualizerRightPanelView
            width={RIGHT_W}
            collapsed={rightCollapsed}
            tab={pg.tab}
            themeOverrides={pg.themeOverrides}
            onSetOverride={pg.setThemeOverride}
            onClearOverride={pg.clearThemeOverride}
            onClearAll={pg.clearAllThemeOverrides}
            onApplyPreset={pg.applyThemePreset}
            node={pg.selectedNode}
            document={pg.selectedDocument}
            selectedNodeId={pg.selectedNodeId}
            onSelectNode={pg.setSelectedNodeId}
            onUpdateProp={pg.updateSelectedNodeProp}
            onRemove={pg.removeSelectedNode}
            onAddChild={pg.addComponent}
            onSaveBlock={pg.saveSelectionAsBlock}
          />
        </XStack>

        <UiVisualizerStatusbarView
          selectedAppId={pg.selectedAppId}
          unsaved={pg.unsaved}
          docsLoading={pg.docsLoading}
          blockCount={pg.fileBlocks.length + pg.customBlocks.length}
          componentTypeCount={pg.componentUsage.length}
          pendingCount={pg.pendingChanges.length}
          onCopyContext={pg.copyChangesContext}
        />
      </YStack>
    </SafeAreaView>
  );
}
