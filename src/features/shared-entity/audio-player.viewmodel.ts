import React from "react";
import { Audio } from "expo-av";

export interface AudioPlayerState {
  playing: boolean;
  error: string | undefined;
  play: () => Promise<void>;
}

export function useAudioPlayer(contentUrl: string | undefined): AudioPlayerState {
  const [playing, setPlaying] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const soundRef = React.useRef<Audio.Sound | null>(null);

  React.useEffect(() => {
    return () => {
      const sound = soundRef.current;
      soundRef.current = null;
      if (sound) void sound.unloadAsync();
    };
  }, []);

  const play = React.useCallback(async () => {
    if (!contentUrl) return;
    try {
      setError(undefined);
      setPlaying(true);
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync({ uri: contentUrl }, { shouldPlay: true });
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if ("didJustFinish" in status && status.didJustFinish) setPlaying(false);
      });
    } catch (e) {
      setPlaying(false);
      setError(e instanceof Error ? e.message : "Failed to play audio.");
    }
  }, [contentUrl]);

  return { playing, error, play };
}
