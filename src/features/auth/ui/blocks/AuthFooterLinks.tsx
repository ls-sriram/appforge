import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../../../../ui/primitives";

interface AuthFooterLinksProps {
  prompt: string;
  linkLabel: string;
  onPress: () => void;
}

export function AuthFooterLinks({ prompt, linkLabel, onPress }: AuthFooterLinksProps) {
  return (
    <View>
      <Text variant="body">{prompt}</Text>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text variant="link">{linkLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
