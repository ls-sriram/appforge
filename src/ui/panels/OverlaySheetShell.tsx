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
import { Card, Col, Row, Body } from "../primitives";

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
            <Card variant="strong" pad="none">
              <Col padV="xs" centered>
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
              </Col>

              <View
                style={[
                  styles.header,
                  {
                    borderBottomColor: t.colors.border,
                    paddingHorizontal: t.colors.space.md,
                    paddingVertical: t.colors.space.md,
                  },
                ]}
              >
                <Body size="sm" bold>{title}</Body>
                <Pressable onPress={onClose} style={{ padding: t.colors.space.xxs }}>
                  <Body soft>✕</Body>
                </Pressable>
              </View>

              <ScrollView
                style={styles.body}
                contentContainerStyle={{ paddingHorizontal: t.colors.space.md, paddingBottom: t.colors.space.xl }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Col between="md">
                  {children}
                </Col>
              </ScrollView>

              {footer ? (
                <Col pad="md">
                  {footer}
                </Col>
              ) : null}
            </Card>
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
    borderBottomColor: "#E5E5E5",
  },
  body: {
    flexShrink: 1,
  },
});
