import React from "react";
import { View } from "../../../../platform/ui/index";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <View bg="$surface" borderWidth={1} borderColor="$borderSubtle" br="$4" p="$5">
      {children}
    </View>
  );
}
