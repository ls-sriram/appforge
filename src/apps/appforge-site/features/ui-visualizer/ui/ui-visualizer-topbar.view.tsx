import React from "react";
import { Pressable } from "react-native";
import { Body, Icon, View, XStack } from "@ui";
import type { UiEditorTab } from "../domain/ui-document.types";
import type { DesktopRepoState } from "../use-desktop-repo-source";
import { UiProjectSelectorView } from "./ui-project-selector.view";

export function UiVisualizerTopbarView({
  apps,
  selectedAppId,
  selectedDocumentName,
  onSelectApp,
  desktopRepo,
  onSelectRepoSource,
  tab,
  onSelectTab,
  saveStatus,
  saveDisabled,
  onSave,
}: {
  apps: { id: string; displayName: string }[];
  selectedAppId: string;
  selectedDocumentName: string;
  onSelectApp: (id: string) => void;
  desktopRepo: DesktopRepoState;
  onSelectRepoSource: () => void;
  tab: UiEditorTab;
  onSelectTab: (tab: UiEditorTab) => void;
  pendingCount: number;
  stageDisabled: boolean;
  onStage: () => void;
  onRefresh: () => void;
}) {
  return (
    <XStack ai="center" gap="$3" px="$3" h={40} bg="$surfaceAlt" borderBottomColor="$borderSubtle" borderBottomWidth={1} flexShrink={0}>
      <XStack ai="center" gap="$2" flexShrink={0}>
        <Icon name="flask" size="sm" tone="accent" />
        <Body fontSize="$2" color="$textPrimary" fontFamily="$bold">AppForge</Body>
      </XStack>

      <Body color="$borderSubtle" fontSize="$2">/</Body>

      <UiProjectSelectorView
        apps={apps}
        selectedAppId={selectedAppId}
        onSelect={onSelectApp}
      />

      <Body color="$textMuted" fontSize="$1">/</Body>
      <Body color="$textMuted" fontSize="$1" numberOfLines={1}>{selectedDocumentName}</Body>

      {desktopRepo.isDesktop && (
        <>
          <Body color="$borderSubtle" fontSize="$2">/</Body>
          <XStack ai="center" gap="$2">
            <Body fontSize="$1" color={desktopRepo.repoValid ? "$success" : "$warning"}>
              {desktopRepo.repoValid ? "source" : "source required"}
            </Body>
            <Body fontSize="$1" color="$textMuted" numberOfLines={1}>
              {desktopRepo.repoName ?? "No repo selected"}
            </Body>
            <Pressable
              onPress={onSelectRepoSource}
              disabled={desktopRepo.selecting || !desktopRepo.loaded}
            >
              {({ pressed }: { pressed: boolean }) => (
                <View
                  px="$2"
                  h={24}
                  jc="center"
                  bg={pressed ? "$surfaceStrong" : "transparent"}
                  borderColor="$borderSubtle"
                  borderWidth={1}
                >
                  <Body fontSize="$1" color="$textSecondary">
                    {desktopRepo.selecting ? "Selecting…" : "Change"}
                  </Body>
                </View>
              )}
            </Pressable>
          </XStack>
        </>
      )}

      <View f={1} />

      <XStack ai="center" borderColor="$borderSubtle" borderWidth={1}>
        {(["design", "code", "tokens"] as UiEditorTab[]).map((currentTab, i, arr) => (
          <Pressable key={currentTab} onPress={() => onSelectTab(currentTab)}>
            {({ pressed }: { pressed: boolean }) => (
              <View
                px="$3" h={28} jc="center"
                bg={pressed ? "$errorMuted" : tab === currentTab ? "$surfaceStrong" : "transparent"}
                borderRightColor="$borderSubtle"
                borderRightWidth={i < arr.length - 1 ? 1 : 0}
              >
                <Body
                  fontSize="$1"
                  color={tab === currentTab ? "$textPrimary" : "$textSecondary"}
                  fontFamily={tab === currentTab ? "$bold" : "$reg"}
                >
                  {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
                </Body>
              </View>
            )}
          </Pressable>
        ))}
      </XStack>

      <XStack ai="center" gap="$2">
        <Pressable onPress={onRefresh}>
          {({ pressed }: { pressed: boolean }) => (
            <View
              px="$3" h={28} jc="center"
              bg={pressed ? "$surfaceStrong" : "transparent"}
              borderColor="$borderSubtle"
              borderWidth={1}
            >
              <Body fontSize="$1" color="$textSecondary">Refresh</Body>
            </View>
          )}
        </Pressable>

        <Pressable onPress={onStage} disabled={stageDisabled}>
          {({ pressed }: { pressed: boolean }) => (
            <View
              px="$3" h={28} jc="center"
              bg={pressed ? "$primaryMuted" : "$primary"}
              // @ts-ignore
              style={{ opacity: stageDisabled ? 0.6 : 1 }}
            >
              <Body fontSize="$1" color="$textInverse" fontFamily="$bold">
                {pendingCount > 0 ? `Stage · ${pendingCount}` : "Stage"}
              </Body>
            </View>
          )}
        </Pressable>
      </XStack>
    </XStack>
  );
}
