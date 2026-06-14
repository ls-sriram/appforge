import { act, renderHook } from "@testing-library/react-native";
import { useRecordingsViewModel } from "../use-recordings-viewmodel";

jest.mock("expo-av", () => ({
  Audio: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
    setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
    Recording: function RecordingMock() {
      return {
        prepareToRecordAsync: jest.fn().mockResolvedValue(undefined),
        startAsync: jest.fn().mockResolvedValue(undefined),
        stopAndUnloadAsync: jest.fn().mockResolvedValue(undefined),
        getStatusAsync: jest.fn().mockResolvedValue({ canRecord: false, durationMillis: 1000, isRecording: false }),
        getURI: jest.fn().mockReturnValue("file://mock.m4a"),
      };
    },
    AndroidOutputFormat: { MPEG_4: 2 },
    AndroidAudioEncoder: { AAC: 3 },
    IOSOutputFormat: { MPEG4AAC: 4 },
    IOSAudioQuality: { MAX: 5 },
  },
  InterruptionModeIOS: { DoNotMix: 1 },
  InterruptionModeAndroid: { DoNotMix: 1 },
}));

jest.mock("../../usecases/recording-actions", () => ({
  listRecordings: jest.fn().mockResolvedValue({ ok: true, data: [] }),
  createRecording: jest.fn().mockResolvedValue({
    ok: true,
    data: {
      id: "r1",
      createdAt: "2026-05-22T00:00:00.000Z",
      durationSeconds: 3,
      contentType: "audio/webm",
      sizeBytes: 3,
    },
  }),
  loadRecordingContent: jest.fn().mockResolvedValue({ ok: true, data: { playbackUrl: "https://example.com/audio" } }),
}));

describe("recordings/viewmodel/useRecordingsViewModel", () => {
  it("starts recording when adapter start succeeds", async () => {
    const adapter = {
      start: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
      stop: jest.fn().mockResolvedValue({
        ok: true,
        data: { audioBase64: "YQ==", contentType: "audio/webm", durationSeconds: 1 },
      }),
    };

    const { result } = renderHook(() => useRecordingsViewModel(adapter as any));

    await act(async () => {
      await result.current.actions.start();
    });

    expect(result.current.state.status).toBe("recording");

    await act(async () => {
      await result.current.actions.stop();
    });

    expect(result.current.state.status).toBe("ready");
  });
});
