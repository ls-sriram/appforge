import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { opacity } from "../../theme/tokens";
import { Block, Text } from "../primitives"
import { Panel } from ".";

interface OverlaySheetShellProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function SheetShell({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={[styles.sheet, {
      borderTopLeftRadius: t.colors.radii.xl,
      borderTopRightRadius: t.colors.radii.xl,
    }]}>
      {children}
    </View>
  );
}

export function OverlaySheetShell({
  visible,
  title,
  onClose,
  children,
  footer,
}: OverlaySheetShellProps) {
  const t = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen" onRequestClose={onClose}>
      <View style={styles.viewport}>
        <Pressable
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: t.colors.textPrimary, opacity: opacity.overlay },
          ]}
          onPress={onClose}
        />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboard}>
          <SheetShell>
            <Panel variant="strong">
              <Block padV="xs">
                <View
                  style={[
                    styles.handle,
                    {
                      backgroundColor: t.colors.border,
                      width: t.colors.space["2xl"],
                      height: t.colors.space.xxs,
                      borderRadius: t.colors.radii.pill,
                    },
                  ]}
                />
              </Block>

              <Block padH="md" padV="md">
                <View
                  style={[
                    styles.header,
                    {
                      borderBottomColor: t.colors.border,
                      paddingBottom: t.colors.space.md,
                    },
                  ]}
                >
                  <Text variant="bodySm" tone="primary" weight="bold">
                    {title}
                  </Text>
                  <Pressable onPress={onClose} style={{ padding: t.colors.space.xxs }}>
                    <Text tone="muted">✕</Text>
                  </Pressable>
                </View>
              </Block>

              <ScrollView
                style={styles.body}
                contentContainerStyle={{ paddingHorizontal: t.colors.space.md, paddingBottom: t.colors.space.xl }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Block space="md">
                  {children}
                </Block>
              </ScrollView>

              {footer ? (
                <Block padH="md" padV="md">
                  {footer}
                </Block>
              ) : null}
            </Panel>
          </SheetShell>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewport: { flex: 1, justifyContent: "flex-end" },
  keyboard: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    maxHeight: "90%",
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  body: {
    flexShrink: 1,
  },
});
