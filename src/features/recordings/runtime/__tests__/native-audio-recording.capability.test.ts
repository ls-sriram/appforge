import { NativeAudioRecordingCapability } from "../../native-audio-recording.capability";

const mockRequestPermissionsAsync = jest.fn();
const mockSetAudioModeAsync = jest.fn();
const mockPrepareToRecordAsync = jest.fn();
const mockStartAsync = jest.fn();
const mockStopAndUnloadAsync = jest.fn();
const mockGetStatusAsync = jest.fn();
const mockGetURI = jest.fn();

jest.mock("expo-av", () => ({
  Audio: {
    requestPermissionsAsync: (...args: unknown[]) => mockRequestPermissionsAsync(...args),
    setAudioModeAsync: (...args: unknown[]) => mockSetAudioModeAsync(...args),
    Recording: function RecordingMock() {
      return {
        prepareToRecordAsync: mockPrepareToRecordAsync,
        startAsync: mockStartAsync,
        stopAndUnloadAsync: mockStopAndUnloadAsync,
        getStatusAsync: mockGetStatusAsync,
        getURI: mockGetURI,
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

describe("NativeAudioRecordingCapability", () => {
  const originalFileReader = global.FileReader;

  afterAll(() => {
    global.FileReader = originalFileReader;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestPermissionsAsync.mockResolvedValue({ granted: true });
    mockSetAudioModeAsync.mockResolvedValue(undefined);
    mockPrepareToRecordAsync.mockResolvedValue(undefined);
    mockStartAsync.mockResolvedValue(undefined);
    mockStopAndUnloadAsync.mockResolvedValue(undefined);
    mockGetStatusAsync.mockResolvedValue({ canRecord: false, durationMillis: 2100, isRecording: false });
    mockGetURI.mockReturnValue("file://recording.m4a");

    global.fetch = jest.fn().mockResolvedValue({
      blob: async () => new Blob(["a"], { type: "audio/mp4" }),
    } as never) as typeof fetch;

    class MockFileReader {
      result: string | ArrayBuffer | null = null;
      onloadend: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;
      onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;

      readAsDataURL() {
        this.result = "data:audio/mp4;base64,YQ==";
        this.onloadend?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
      }
    }

    global.FileReader = MockFileReader as unknown as typeof FileReader;
  });

  it("prepare fails when permission denied", async () => {
    mockRequestPermissionsAsync.mockResolvedValueOnce({ granted: false });
    const capability = new NativeAudioRecordingCapability();
    await expect(capability.prepare()).rejects.toThrow("Microphone permission denied.");
  });

  it("start and stop returns base64 payload", async () => {
    const capability = new NativeAudioRecordingCapability();
    await capability.start();
    const result = await capability.stop();
    expect(result.audioBase64).toBe("YQ==");
    expect(result.contentType).toBe("audio/mp4");
    expect(result.durationSeconds).toBe(2);
  });

  it("stop throws when uri missing", async () => {
    mockGetURI.mockReturnValueOnce(null);
    const capability = new NativeAudioRecordingCapability();
    await capability.start();
    await expect(capability.stop()).rejects.toThrow("Recording URI unavailable after stop.");
  });
});
