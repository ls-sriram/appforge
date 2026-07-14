import { Easing, withSpring, withTiming } from "react-native-reanimated";
import type { Theme } from "../theme/definitions/tokens";

export {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
export type { SharedValue } from "react-native-reanimated";

type DurationKey = keyof Theme["motion"]["duration"];
type EasingKey = keyof Theme["motion"]["easing"];

function easingCurve(theme: Theme, key: EasingKey) {
  const [x1, y1, x2, y2] = theme.motion.easing[key];
  return Easing.bezier(x1, y1, x2, y2);
}

export const motion = {
  timing(theme: Theme, toValue: number, duration: DurationKey = "medium", easing: EasingKey = "standard") {
    return withTiming(toValue, {
      duration: theme.motion.duration[duration],
      easing: easingCurve(theme, easing),
    });
  },
  spring(theme: Theme, toValue: number, feel: DurationKey = "medium") {
    const config = {
      fast: { damping: 20, mass: 1.2, stiffness: 250 },
      medium: { damping: 10, mass: 0.9, stiffness: 100 },
      slow: { damping: 20, mass: 1.2, stiffness: 50 },
    }[feel];
    return withSpring(toValue, config);
  },
  withTiming,
  withSpring,
};
