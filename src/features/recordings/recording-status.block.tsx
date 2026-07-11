import React from "react";
import { Animated, Easing } from "react-native";
import { Body, Icon, ZStack, XStack, YStack, noopUi } from "../../platform/ui/index";
import type { RecordingStatusBlockProps, RecordingStatusState } from "./recording-status.contract";
export type { RecordingStatusBlockProps, RecordingStatusPulse, RecordingStatusSize, RecordingStatusState } from "./recording-status.contract";
export { RecordingStatusBlockSchema } from "./recording-status.contract";

const DEFAULT_LABEL_BY_STATE: Record<RecordingStatusState, string> = {
  microphone: "Microphone ready",
  muted: "Muted",
  recording: "Recording...",
  uploading: "Uploading audio...",
  ready: "Ready to record",
  error: "Recording error",
};

function formatTimer(elapsedSeconds: number, maxSeconds?: number) {
  const elapsed = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(elapsedSeconds % 60).padStart(2, "0")}`;
  return maxSeconds === undefined ? elapsed : `${elapsed} / ${maxSeconds}s`;
}

export function RecordingStatusBlock({
  ui = noopUi,
  state,
  size = "md",
  label,
  elapsedSeconds,
  maxSeconds,
  pulse = "auto",
  style,
}: RecordingStatusBlockProps) {
  const metrics = style.sizes[size];
  const colors = style.colors[state];
  const shouldPulse = pulse === "always" || (pulse === "auto" && state === "recording");
  const pulseValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!shouldPulse) {
      pulseValue.stopAnimation();
      pulseValue.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => {
      animation.stop();
      pulseValue.stopAnimation();
    };
  }, [pulseValue, shouldPulse]);

  const resolvedLabel = label ?? DEFAULT_LABEL_BY_STATE[state];
  const timerLabel = state === "recording" && elapsedSeconds !== undefined
    ? formatTimer(elapsedSeconds, maxSeconds)
    : undefined;
  const pulseStyle = {
    opacity: pulseValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.35, 0.9],
    }),
    transform: [{
      scale: pulseValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.4],
      }),
    }],
  };

  return (
    <XStack {...ui("root", `Recording status ${state}`)} ai="center" gap={style.layout.iconGap}>
      <ZStack
        {...ui("icon-frame", `Recording status ${state} icon frame`)}
        ai="center"
        jc="center"
        w={metrics.frameSize}
        h={metrics.frameSize}
      >
        {shouldPulse ? (
          <Animated.View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={{
              position: "absolute",
              width: metrics.pulseSize,
              height: metrics.pulseSize,
              borderRadius: style.frame.borderRadius,
              backgroundColor: colors.accentMutedColor,
              ...pulseStyle,
            }}
          />
        ) : null}

        {state === "recording" ? (
          <YStack
            {...ui("dot", "Recording pulse dot")}
            w={metrics.dotSize}
            h={metrics.dotSize}
            br={style.frame.borderRadius}
            bg={colors.accentColor}
          />
        ) : (
          <ZStack ai="center" jc="center">
            <Icon
              {...ui("icon", `Recording status ${state} icon`)}
              color={colors.iconColor}
              name={state === "ready" ? "circle-check" : state === "uploading" ? "activity" : state === "error" ? "x" : "mic"}
              size={metrics.iconSize}
            />
            {state === "muted" ? (
              <YStack
                {...ui("muted-slash", "Muted microphone slash")}
                position="absolute"
                w={metrics.iconSize + 2}
                h={metrics.slashWidth}
                bg={colors.iconColor}
                rotate="45deg"
                br={style.frame.borderRadius}
              />
            ) : null}
          </ZStack>
        )}
      </ZStack>

      <YStack {...ui("content", `Recording status ${state} content`)} gap={style.layout.gap}>
        <Body
          {...ui("label", `Recording status ${state} label`)}
          color={colors.labelColor}
          fontSize={metrics.labelFontSize}
        >
          {resolvedLabel}
        </Body>
        {timerLabel ? (
          <Body
            {...ui("timer", `Recording status ${state} timer`)}
            color={colors.timerColor}
            fontSize={metrics.timerFontSize}
          >
            {timerLabel}
          </Body>
        ) : null}
      </YStack>
    </XStack>
  );
}
