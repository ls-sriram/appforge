import * as ExpoHaptics from "expo-haptics";

const impactStyle: Record<"light" | "medium" | "heavy", ExpoHaptics.ImpactFeedbackStyle> = {
  light: ExpoHaptics.ImpactFeedbackStyle.Light,
  medium: ExpoHaptics.ImpactFeedbackStyle.Medium,
  heavy: ExpoHaptics.ImpactFeedbackStyle.Heavy,
};

const notificationType: Record<"success" | "warning" | "error", ExpoHaptics.NotificationFeedbackType> = {
  success: ExpoHaptics.NotificationFeedbackType.Success,
  warning: ExpoHaptics.NotificationFeedbackType.Warning,
  error: ExpoHaptics.NotificationFeedbackType.Error,
};

export const haptics = {
  impact(style: "light" | "medium" | "heavy" = "light"): Promise<void> {
    return ExpoHaptics.impactAsync(impactStyle[style]);
  },
  notification(type: "success" | "warning" | "error"): Promise<void> {
    return ExpoHaptics.notificationAsync(notificationType[type]);
  },
  selection(): Promise<void> {
    return ExpoHaptics.selectionAsync();
  },
};
