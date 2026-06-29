import React from "react";
import { runtime } from "../../../../platform/core/runtime";
import { Body, Button, Heading, Icon, useUI, XStack, YStack } from "../../../../platform/ui/index";
import type { RecordingModel, RecordingUiStatus } from "../../domain/model";
import type { RecordingShareModel as RecordingShare } from "../../domain/share-model";

interface RecordingViewProps {
  status: RecordingUiStatus;
  error?: string;
  loading: boolean;
  recordings: RecordingModel[];
  playingId?: string;
  secondsElapsed: number;
  maxSeconds: number;
  playbackUrlById: Record<string, string>;
  sharesByRecordingId: Record<string, RecordingShare[]>;
  shareLoadingByRecordingId: Record<string, boolean>;
  onStart: () => void;
  onStop: () => void;
  onRefresh: () => void;
  onPlay: (id: string) => void;
  onCreateShare: (id: string) => void;
  onRevokeShare: (id: string, shareUrl: string) => void;
  onLoadShares: (id: string) => void;
}

export function RecordingView({
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
}: RecordingViewProps) {
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

  const { contracts } = useUI();
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
        <YStack gap="$3">
          <Heading>Saved recordings</Heading>
          {recordings.length === 0 ? (
            <Body fontSize="$2" color="$textMuted">No recordings yet. Tap the mic below to capture one.</Body>
          ) : (
            <YStack gap="$3">
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
                          contract={contracts.button!["secondary"]}
                          onPress={() => onPlay(recording.id)}
                        >
                          {playingId === recording.id ? "Loaded" : "Play"}
                        </Button>
                      </XStack>
                      <Body fontSize="$2" color="$textMuted">{`${recording.durationSeconds ?? 0}s • ${recording.contentType} • ${recording.sizeBytes} bytes`}</Body>
                      <XStack gap="$3" flexWrap="wrap">
                        <Button
                          contract={activeShare ? contracts.button!["secondary"] : contracts.button!["primary"]}
                          onPress={() => {
                            if (activeShare) {
                              onRevokeShare(recording.id, activeShare.shareUrl);
                            } else {
                              onCreateShare(recording.id);
                            }
                          }}
                          disabled={shareLoading}
                        >
                          {activeShare ? "Revoke Share" : "Share"}
                        </Button>
                        <Button
                          contract={contracts.button!["ghost"]}
                          onPress={() => onLoadShares(recording.id)}
                          disabled={shareLoading}
                        >
                          {shareLoading ? "Loading..." : "Shares"}
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
            </YStack>
          )}
        </YStack>

        <YStack>
          <XStack gap="$4" ai="center">
            <YStack
              onPress={micDisabled ? undefined : micPress}
              pressStyle={micDisabled ? {} : { opacity: 0.7 }}
              accessibilityRole="button"
              accessibilityLabel={micLabel}
              cursor={micDisabled ? "default" : "pointer"}
            >
              {isRecording ? null : <Icon color="#0A0A0A" name="mic" size={22} />}
            </YStack>

            <YStack f={1}>
              <YStack gap="$1">
                <XStack ai="center" gap="$3">
                  <Body fontSize="$2">{micStatus}</Body>
                  <Button
                    contract={contracts.button!["ghost"]}
                    onPress={onRefresh}
                    disabled={loading || isUploading}
                  >
                    {loading ? "Refreshing..." : "Refresh"}
                  </Button>
                </XStack>
                {(isRecording || status === "ready") ? (
                  <Body fontSize="$2">{timerLabel}</Body>
                ) : (
                  <Body fontSize="$2" color="$textMuted">Max {maxSeconds}s per recording</Body>
                )}
                {error ? <Body fontSize="$2" color="$error">{error}</Body> : null}
              </YStack>
            </YStack>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
