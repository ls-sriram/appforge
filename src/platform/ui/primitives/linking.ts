import { Linking } from "react-native";

export const linking = {
  canOpenURL(url: string): Promise<boolean> {
    return Linking.canOpenURL(url);
  },
  openURL(url: string): Promise<void> {
    return Linking.openURL(url);
  },
};
