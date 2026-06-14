import React from "react";
import { Pressable, View } from "react-native";
import { runtime } from "../../../core/runtime";
import { Block, Button, Icon, Text } from "../../../ui/primitives"
import { RecordingTimer } from "../../../ui/blocks"
import type { RecordingModel, RecordingShareModel, RecordingUiStatus } from "..";
import { useTheme } from "../../../theme/ThemeProvider";

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
  const theme = useTheme();
  const c = theme.colors;
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

  return (
    <Block>
      <Block space="md">
        <View>
          <Text variant="h3">Saved recordings</Text>
          {recordings.length === 0 ? (
            <Text variant="caption">No recordings yet. Tap the mic below to capture one.</Text>
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
                  <Block key={recording.id}>
                    <Block space="sm">
                      <Block direction="horizontal">
                        <Text variant="bodySm">{createdLabel}</Text>
                        <Button
                          label={playingId === recording.id ? "Loaded" : "Play"}
                          variant="secondary"
                          onPress={() => onPlay(recording.id)}
                          fullWidth={false}
                          size="sm"
                        />
                      </Block>
                      <Text variant="caption">{`${recording.durationSeconds ?? 0}s • ${recording.contentType} • ${recording.sizeBytes} bytes`}</Text>
                      <Block direction="horizontal" space="sm">
                        <Button
                          label={activeShare ? "Revoke Share" : "Share"}
                          variant={activeShare ? "secondary" : "primary"}
                          onPress={() => {
                            if (activeShare) {
                              onRevokeShare(recording.id, activeShare.shareUrl);
                            } else {
                              onCreateShare(recording.id);
                            }
                          }}
                          disabled={shareLoading}
                          fullWidth={false}
                          size="sm"
                        />
                        <Button
                          label={shareLoading ? "Loading..." : "Shares"}
                          variant="ghost"
                          onPress={() => onLoadShares(recording.id)}
                          disabled={shareLoading}
                          fullWidth={false}
                          size="sm"
                        />
                      </Block>
                      {activeShare ? (
                        <Block direction="horizontal">
                          <Text variant="caption" numberOfLines={1}>
                            {activeShare.shareUrl}
                          </Text>
                        </Block>
                      ) : null}
                      {canInlineAudio && playbackUrl
                        ? React.createElement("audio" as any, {
                            controls: true,
                            src: playbackUrl,
                          })
                        : null}
                      {!canInlineAudio && playbackUrl ? (
                        <Text variant="caption">Playback loaded. Native inline playback is pending.</Text>
                      ) : null}
                    </Block>
                  </Block>
                );
              })}
            </View>
          )}
        </View>

        <Block>
          <Block direction="horizontal">
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
              <Block space="xs">
                <Block direction="horizontal">
                  <Text variant="bodySm">{micStatus}</Text>
                  <Button
                    label={loading ? "Refreshing..." : "Refresh"}
                    variant="ghost"
                    onPress={onRefresh}
                    disabled={loading || isUploading}
                    fullWidth={false}
                    size="sm"
                  />
                </Block>
                {(isRecording || status === "ready") ? (
                  <View>
                    <RecordingTimer elapsedSeconds={secondsElapsed} maxSeconds={maxSeconds} />
                  </View>
                ) : (
                  <Text variant="caption">Max {maxSeconds}s per recording</Text>
                )}
                {error ? <Text variant="caption" tone="danger">{error}</Text> : null}
              </Block>
            </View>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
