import React from "react";
import { Animated } from "react-native";

type TimerCallbacks = {
  onComplete: () => void;
  onHalfway?: () => void;
};

export function useSitTimer({ onComplete, onHalfway }: TimerCallbacks) {
  const [secondsLeft, setSecondsLeft] = React.useState(0);
  const totalSecondsRef = React.useRef(0);
  const remainingSecondsRef = React.useRef(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const progress = React.useRef(new Animated.Value(0)).current;
  const onCompleteRef = React.useRef(onComplete);
  const onHalfwayRef = React.useRef(onHalfway);

  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  React.useEffect(() => {
    onHalfwayRef.current = onHalfway;
  }, [onHalfway]);

  const stop = React.useCallback(() => {
    if (!timerRef.current) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const tick = React.useCallback(() => {
    remainingSecondsRef.current -= 1;
    setSecondsLeft(remainingSecondsRef.current);
    const total = totalSecondsRef.current;
    const elapsed = total - remainingSecondsRef.current;
    Animated.timing(progress, {
      toValue: total > 0 ? elapsed / total : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();

    if (remainingSecondsRef.current === Math.floor(total / 2)) {
      onHalfwayRef.current?.();
    }

    if (remainingSecondsRef.current <= 0) {
      stop();
      onCompleteRef.current();
    }
  }, [progress, stop]);

  const start = React.useCallback(
    (durationSeconds: number) => {
      stop();
      totalSecondsRef.current = durationSeconds;
      remainingSecondsRef.current = durationSeconds;
      setSecondsLeft(durationSeconds);
      progress.setValue(0);
      timerRef.current = setInterval(tick, 1000);
    },
    [progress, stop, tick],
  );

  React.useEffect(() => stop, [stop]);

  return {
    secondsLeft,
    progress,
    start,
    stop,
  };
}
