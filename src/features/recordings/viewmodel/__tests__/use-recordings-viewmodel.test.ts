import { act, renderHook } from "@testing-library/react-native";
import { useRecordingsViewModel } from "../../recordings.viewmodel";
import { deleteRecording, finalizeRecording, listRecordings, loadRecordingContent } from "../../recording-actions.usecase";

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

jest.mock("../../recording-actions.usecase", () => ({
  finalizeRecording: jest.fn().mockResolvedValue({
    ok: true,
    data: {
      outcome: "saved",
      recording: {
        id: "r1",
        createdAt: "2026-05-22T00:00:00.000Z",
        durationSeconds: 3,
        contentType: "audio/webm",
        sizeBytes: 3,
      },
    },
  }),
  listRecordings: jest.fn().mockResolvedValue({ ok: true, data: [] }),
  deleteRecording: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
  loadRecordingContent: jest.fn().mockResolvedValue({ ok: true, data: { playbackUrl: "https://example.com/audio" } }),
}));

const mockFinalizeRecording = finalizeRecording as jest.MockedFunction<typeof finalizeRecording>;
const mockListRecordings = listRecordings as jest.MockedFunction<typeof listRecordings>;
const mockDeleteRecording = deleteRecording as jest.MockedFunction<typeof deleteRecording>;
const mockLoadRecordingContent = loadRecordingContent as jest.MockedFunction<typeof loadRecordingContent>;

describe("recordings/viewmodel/useRecordingsViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFinalizeRecording.mockResolvedValue({
      ok: true,
      data: {
        outcome: "saved",
        recording: {
          id: "r1",
          createdAt: "2026-05-22T00:00:00.000Z",
          durationSeconds: 3,
          contentType: "audio/webm",
          sizeBytes: 3,
        },
      },
    });
    mockListRecordings.mockResolvedValue({ ok: true, data: [] });
    mockDeleteRecording.mockResolvedValue({ ok: true, data: undefined });
    mockLoadRecordingContent.mockResolvedValue({ ok: true, data: { playbackUrl: "https://example.com/audio" } });
  });

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
    expect(mockFinalizeRecording).toHaveBeenCalledWith(
      expect.objectContaining({
        audioBase64: "YQ==",
        contentType: "audio/webm",
        durationSeconds: 1,
      }),
      { persistenceMode: "save" },
    );
  });

  it("discards a recording without refreshing the saved recordings list", async () => {
    mockFinalizeRecording.mockResolvedValueOnce({
      ok: true,
      data: { outcome: "discarded" },
    });
    const adapter = {
      start: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
      stop: jest.fn().mockResolvedValue({
        ok: true,
        data: { audioBase64: "YQ==", contentType: "audio/webm", durationSeconds: 1 },
      }),
    };

    const { result } = renderHook(() => useRecordingsViewModel(adapter as any));
    expect(mockListRecordings).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.actions.start();
    });

    await act(async () => {
      await result.current.actions.discard();
    });

    expect(result.current.state.status).toBe("ready");
    expect(result.current.state.recordings).toEqual([]);
    expect(mockFinalizeRecording).toHaveBeenCalledWith(
      expect.objectContaining({
        audioBase64: "YQ==",
        contentType: "audio/webm",
        durationSeconds: 1,
      }),
      { persistenceMode: "discard" },
    );
    expect(mockListRecordings).toHaveBeenCalledTimes(1);
  });

  it("removes a deleted recording and clears cached playback state", async () => {
    mockListRecordings.mockResolvedValueOnce({
      ok: true,
      data: [
        {
          id: "r1",
          createdAt: "2026-05-22T00:00:00.000Z",
          durationSeconds: 3,
          contentType: "audio/webm",
          sizeBytes: 3,
        },
      ],
    });

    const { result } = renderHook(() => useRecordingsViewModel({
      start: jest.fn(),
      stop: jest.fn(),
    } as any));

    await act(async () => {
      await result.current.actions.play("r1");
    });

    expect(result.current.state.playingId).toBe("r1");

    await act(async () => {
      await result.current.actions.deleteRecording("r1");
    });

    expect(mockDeleteRecording).toHaveBeenCalledWith("r1");
    expect(result.current.state.recordings).toEqual([]);
    expect(result.current.state.playingId).toBeUndefined();
    expect(result.current.state.playbackUrlById).toEqual({});
  });
});
