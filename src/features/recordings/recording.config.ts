export const recordingConfig = {
  maxSeconds: 60,
  timerTickMs: 100,
  audioBitsPerSecond: 128000,
  preferredMimeTypes: [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ] as const,
  mediaStreamConstraints: {
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1,
      sampleRate: 48000,
    },
  } satisfies MediaStreamConstraints,
} as const;
