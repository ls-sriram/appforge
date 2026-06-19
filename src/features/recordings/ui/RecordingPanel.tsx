import React from "react";
import { Pressable, View } from "react-native";
import { runtime } from "../../../platform/core/runtime";
import { Body, Button, Heading, Icon, XStack, YStack } from "../../../platform/ui/index";
import type { RecordingModel, RecordingShareModel, RecordingUiStatus } from "..";

interface RecordingPanelProps {
  status: RecordingUiStatus;
  error?: string;
  loading: boolean;
  recordings: RecordingModel[];
  playingId?: string;
  secondsElapsed: number;
  maxSeconds: number;
  playbackUrlById: Record<string, string>;
  sharesByRecordingId: Record<string, RecordingShareModel[]>;
  shareLoadingByRecordingId: Record<string, boolean>;
  onStart: () => void;
  onStop: () => void;
  onRefresh: () => void;
  onPlay: (id: string) => void;
  onCreateShare: (id: string) => void;
  onRevokeShare: (id: string, shareUrl: string) => void;
  onLoadShares: (id: string) => void;
}

export function RecordingPanel({
  status,
  error,
  loading,
  recordings,
  playingId,
  secondsElapsed,
  maxSeconds,
  playbackUrlById,
  sharesByRecordingId,
  shareLoadingByRecordingId,
  onStart,
  onStop,
  onRefresh,
  onPlay,
  onCreateShare,
  onRevokeShare,
  onLoadShares,
}: RecordingPanelProps) {
  const dateTimeFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  const isRecording = status === "recording";
  const isUploading = status === "uploading";
  const canInlineAudio = runtime.isWeb;
  const micDisabled = isUploading || loading;
  const micLabel = isRecording ? "Stop recording" : "Start recording";
  const micStatus = isUploading ? "Uploading audio..." : isRecording ? "Recording..." : "Ready to record";
  const micPress = isRecording ? onStop : onStart;
  const timerLabel = `${String(Math.floor(secondsElapsed / 60)).padStart(2, "0")}:${String(secondsElapsed % 60).padStart(2, "0")} / ${maxSeconds}s`;

  return (
    <YStack gap="$4">
      <YStack gap="$4">
        <View>
          <Heading>Saved recordings</Heading>
          {recordings.length === 0 ? (
            <Body fontSize="$2" color="$textMuted">No recordings yet. Tap the mic below to capture one.</Body>
          ) : (
            <View>
              {recordings.map((recording) => {
                const playbackUrl = playbackUrlById[recording.id];
                const parsedTime = Date.parse(recording.createdAt);
                const createdLabel = Number.isNaN(parsedTime)
                  ? recording.createdAt
                  : dateTimeFormatter.format(new Date(parsedTime));
                const shares = sharesByRecordingId[recording.id] ?? [];
                const activeShare = shares.find((item) => !item.revokedAt);
                const shareLoading = shareLoadingByRecordingId[recording.id] === true;
                return (
                  <YStack key={recording.id} gap="$3">
                      <XStack ai="center" jc="space-between" gap="$3">
                        <Body fontSize="$2">{createdLabel}</Body>
                        <Button
                          bg="$surfaceAlt"
                          borderWidth={1}
                          borderColor="$border"
                          minHeight={42}
                          px="$4"
                          py="$3"
                          onPress={() => onPlay(recording.id)}
                        >
                          <Body>{playingId === recording.id ? "Loaded" : "Play"}</Body>
                        </Button>
                      </XStack>
                      <Body fontSize="$2" color="$textMuted">{`${recording.durationSeconds ?? 0}s • ${recording.contentType} • ${recording.sizeBytes} bytes`}</Body>
                      <XStack gap="$3" flexWrap="wrap">
                        <Button
                          bg={activeShare ? "$surfaceAlt" : "$primary"}
                          borderWidth={1}
                          borderColor={activeShare ? "$border" : "$primary"}
                          minHeight={42}
                          px="$4"
                          py="$3"
                          onPress={() => {
                            if (activeShare) {
                              onRevokeShare(recording.id, activeShare.shareUrl);
                            } else {
                              onCreateShare(recording.id);
                            }
                          }}
                          disabled={shareLoading}
                        >
                          <Body color={activeShare ? "$textPrimary" : "$textInverse"}>
                            {activeShare ? "Revoke Share" : "Share"}
                          </Body>
                        </Button>
                        <Button
                          bg="transparent"
                          minHeight={42}
                          px="$4"
                          py="$3"
                          onPress={() => onLoadShares(recording.id)}
                          disabled={shareLoading}
                        >
                          <Body>{shareLoading ? "Loading..." : "Shares"}</Body>
                        </Button>
                      </XStack>
                      {activeShare ? (
                        <XStack>
                          <Body fontSize="$2" color="$textMuted" numberOfLines={1}>
                            {activeShare.shareUrl}
                          </Body>
                        </XStack>
                      ) : null}
                      {canInlineAudio && playbackUrl
                        ? React.createElement("audio" as any, {
                            controls: true,
                            src: playbackUrl,
                          })
                        : null}
                      {!canInlineAudio && playbackUrl ? (
                        <Body fontSize="$2" color="$textMuted">Playback loaded. Native inline playback is pending.</Body>
                      ) : null}
                  </YStack>
                );
              })}
            </View>
          )}
        </View>

        <YStack>
          <XStack gap="$4" ai="center">
            <Pressable
              onPress={micPress}
              disabled={micDisabled}
              accessibilityRole="button"
              accessibilityLabel={micLabel}
            >
              <View>
                <View
                >
                  {isRecording ? (
                    <View />
                  ) : (
                    <Icon name="mic" size="2xl" tone="inverse" />
                  )}
                </View>
              </View>
            </Pressable>

            <View>
              <YStack gap="$1">
                <XStack ai="center" gap="$3">
                  <Body fontSize="$2">{micStatus}</Body>
                  <Button
                    bg="transparent"
                    minHeight={42}
                    px="$4"
                    py="$3"
                    onPress={onRefresh}
                    disabled={loading || isUploading}
                  >
                    <Body>{loading ? "Refreshing..." : "Refresh"}</Body>
                  </Button>
                </XStack>
                {(isRecording || status === "ready") ? (
                  <View>
                    <Body fontSize="$2">{timerLabel}</Body>
                  </View>
                ) : (
                  <Body fontSize="$2" color="$textMuted">Max {maxSeconds}s per recording</Body>
                )}
                {error ? <Body fontSize="$2" color="$error">{error}</Body> : null}
              </YStack>
            </View>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
