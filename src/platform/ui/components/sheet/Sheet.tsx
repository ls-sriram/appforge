import React, { useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeProvider";
import { defaultSheetStyles } from "./sheet.styles";
import {
  motion,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
} from "../../primitives/motion";
import { haptics } from "../../primitives/haptics";
import type { SheetProps } from "./sheet.contract";
export { SheetSchema, SheetOptionsSchema } from "./sheet.contract";
export type { SheetProps, SheetOptions } from "./sheet.contract";

const OFFSCREEN = 1000;
const DISMISS_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 800;

export function Sheet({ open, onClose, dismissOnScrimPress = true, content }: SheetProps) {
  const theme = useTheme();
  const styles = defaultSheetStyles(theme);
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(OFFSCREEN);
  const crossedThreshold = useSharedValue(false);
  // Modal stays mounted through the close animation; unmounts once the
  // exit spring has had time to settle (open=false alone would cut it off).
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      crossedThreshold.value = false;
      translateY.value = motion.spring(theme, 0, "fast");
    } else {
      translateY.value = motion.spring(theme, OFFSCREEN, "fast");
      const timer = setTimeout(() => setMounted(false), theme.motion.duration.slow);
      return () => clearTimeout(timer);
    }
  }, [open, theme]);

  useAnimatedReaction(
    () => translateY.value > DISMISS_THRESHOLD,
    (past, previous) => {
      if (past && !previous && !crossedThreshold.value) {
        crossedThreshold.value = true;
        runOnJS(haptics.selection)();
      }
    },
  );

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      const shouldDismiss = e.translationY > DISMISS_THRESHOLD || e.velocityY > VELOCITY_THRESHOLD;
      if (shouldDismiss) {
        translateY.value = motion.spring(theme, OFFSCREEN, "fast");
        runOnJS(onClose)();
      } else {
        translateY.value = motion.spring(theme, 0, "fast");
      }
    });

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(translateY.value / OFFSCREEN, 1),
  }));

  if (!mounted) return null;

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View style={[{ position: "absolute", inset: 0, backgroundColor: styles.scrim.backgroundColor }, scrimStyle]}>
          <Pressable style={{ flex: 1 }} onPress={dismissOnScrimPress ? onClose : undefined} />
        </Animated.View>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              {
                backgroundColor: styles.panel.backgroundColor,
                borderTopLeftRadius: styles.panel.borderTopLeftRadius,
                borderTopRightRadius: styles.panel.borderTopRightRadius,
                paddingHorizontal: styles.panel.paddingHorizontal,
                paddingTop: styles.panel.paddingTop,
                paddingBottom: insets.bottom + theme.spacing.md,
              },
              panelStyle,
            ]}
          >
            <View
              style={{
                alignSelf: "center",
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: styles.handle.backgroundColor,
                marginBottom: theme.spacing.sm,
              }}
            />
            {content}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}
