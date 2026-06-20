import { Alert } from "react-native";

export type DialogButton = { text: string; onPress?: () => void; style?: "default" | "cancel" | "destructive" };

export const dialog = {
  alert(title: string, message?: string, buttons?: DialogButton[]): void {
    Alert.alert(title, message, buttons);
  },
};
