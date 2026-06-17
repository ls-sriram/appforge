import React from "react";
import { Audio } from "expo-av";
import { runtime } from "../../../core/runtime";
import { Body, Button, YStack } from "../../../ui";
import { SharedEntityViewData } from "../domain/model";

interface Props {
  data: SharedEntityViewData;
}

export function AudioSharedEntityRenderer({ data }: Props) {
  const [playing, setPlaying] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const soundRef = React.useRef<Audio.Sound | null>(null);

  React.useEffect(() => {
    return () => {
      const sound = soundRef.current;
      soundRef.current = null;
      if (sound) {
        void sound.unloadAsync();
      }
    };
  }, []);

  if (!data.contentUrl) {
    return <Body fontSize="$2" color="$textMuted">Audio content unavailable.</Body>;
  }
  const contentUrl = data.contentUrl;

  if (runtime.isWeb) {
    return React.createElement("audio" as any, {
      controls: true,
      src: contentUrl,
    });
  }

  return (
    <YStack gap="$3">
      <Button
        bg="$primary"
        onPress={async () => {
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
              if ("didJustFinish" in status && status.didJustFinish) {
                setPlaying(false);
              }
            });
          } catch (e) {
            setPlaying(false);
            setError(e instanceof Error ? e.message : "Failed to play audio.");
          }
        }}
      >
        <Body color="$textInverse" fontFamily="$bold">{playing ? "Playing..." : "Play recording"}</Body>
      </Button>
      {error ? <Body fontSize="$2" color="$error">{error}</Body> : null}
    </YStack>
  );
}
