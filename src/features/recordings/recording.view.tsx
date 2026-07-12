import React from "react";
import { runtime } from "../../platform/core/runtime";
import { Body, Button, Heading, Icon, useUI, XStack, YStack } from "../../platform/ui/index";
import type { RecordingModel, RecordingUiStatus } from "./recordings.model";
import { RecordingStatusBlock } from "./recording-status.block";
import { defaultRecordingStatusStyle } from "./recording-status.styles";
import type { RecordingShareModel as RecordingShare } from "./share.model";

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
  deletingId?: string;
  onStart: () => void;
  onStop: () => void;
  onDiscard: () => void;
  onRefresh: () => void;
  onPlay: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateShare: (id: string) => void;
  onRevokeShare: (id: string, shareUrl: string) => void;
  onLoadShares: (id: string) => void;
  renderTranscriptControl?: (recording: RecordingModel) => React.ReactNode;
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
  deletingId,
  onStart,
  onStop,
  onDiscard,
  onRefresh,
  onPlay,
  onDelete,
  onCreateShare,
  onRevokeShare,
  onLoadShares,
  renderTranscriptControl,
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

  const { contracts, theme } = useUI();
  const isRecording = status === "recording";
  const isUploading = status === "uploading";
  const canInlineAudio = runtime.isWeb;
  const micDisabled = isUploading || loading;
  const micLabel = isRecording ? "Stop recording" : "Start recording";
  const micPress = isRecording ? onStop : onStart;
  const recordingStatusStyle = defaultRecordingStatusStyle(theme);
  const displayState = status === "idle"
    ? "microphone"
    : status === "recording"
      ? "recording"
      : status === "uploading"
        ? "uploading"
        : status === "ready"
          ? "ready"
          : "error";

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
                const deleting = deletingId === recording.id;
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
                          disabled={deleting}
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
                          disabled={shareLoading || deleting}
                        >
                          {activeShare ? "Revoke Share" : "Share"}
                        </Button>
                        <Button
                          contract={contracts.button!["ghost"]}
                          onPress={() => onLoadShares(recording.id)}
                          disabled={shareLoading || deleting}
                        >
                          {shareLoading ? "Loading..." : "Shares"}
                        </Button>
                        <Button
                          contract={contracts.button!["ghost"]}
                          onPress={() => onDelete(recording.id)}
                          disabled={deleting}
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </Button>
                      </XStack>
                      {renderTranscriptControl?.(recording)}
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
                  <RecordingStatusBlock
                    state={displayState}
                    size="md"
                    elapsedSeconds={secondsElapsed}
                    maxSeconds={maxSeconds}
                    style={recordingStatusStyle}
                  />
                  <Button
                    contract={contracts.button!["ghost"]}
                    onPress={onRefresh}
                    disabled={loading || isUploading}
                  >
                    {loading ? "Refreshing..." : "Refresh"}
                  </Button>
                  {isRecording ? (
                    <Button
                      contract={contracts.button!["ghost"]}
                      onPress={onDiscard}
                    >
                      Discard
                    </Button>
                  ) : null}
                </XStack>
                {error ? <Body fontSize="$2" color="$error">{error}</Body> : null}
              </YStack>
            </YStack>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
