import React from "react";
import { Body } from "../../platform/ui/index";
import { runtime } from "../../platform/core/runtime";
import { SharedEntityViewData } from "./shared-entity.model";
import { useAudioPlayer } from "./audio-player.viewmodel";
import { AudioPlayBlock } from "./audio-play.block";

interface Props {
  data: SharedEntityViewData;
}

export function AudioSharedEntityRenderer({ data }: Props) {
  const { playing, error, play } = useAudioPlayer(data.contentUrl);

  if (!data.contentUrl) {
    return <Body fontSize="$2" color="$textMuted">Audio content unavailable.</Body>;
  }

  if (runtime.isWeb) {
    return React.createElement("audio" as any, { controls: true, src: data.contentUrl });
  }

  return <AudioPlayBlock playing={playing} error={error} onPlay={play} />;
}
