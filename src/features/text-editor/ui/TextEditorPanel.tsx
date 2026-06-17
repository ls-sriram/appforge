import React from "react";
import { View } from "react-native";
import { Body, Button, Heading, Input, TextArea, XStack, YStack } from "../../../ui";
import type { TextDocumentModel } from "..";

interface TextEditorPanelProps {
  title: string;
  tag: string;
  version: string;
  content: string;
  contentLength: number;
  maxContentLength: number;
  saving: boolean;
  draftStatus: "idle" | "saved" | "error";
  saveStatus: "idle" | "success" | "error";
  error?: string;
  documents: TextDocumentModel[];
  loadingDocuments: boolean;
  onTitleChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onVersionChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
  onCreateNew: () => void;
}

export function TextEditorPanel(props: TextEditorPanelProps) {
  const statusText = props.error
    ? props.error
    : props.saveStatus === "success"
      ? "Saved to backend"
      : props.draftStatus === "saved"
        ? "Draft saved locally"
        : props.draftStatus === "error"
          ? "Draft save failed"
          : "";

  return (
    <YStack gap="$4">
      <YStack gap="$4">
        <YStack gap="$2">
          <Body fontSize="$2" color="$textMuted">Title</Body>
          <Input value={props.title} onChangeText={props.onTitleChange} placeholder="Document title" autoCapitalize="sentences" />
        </YStack>

        <XStack gap="$3">
          <YStack f={1} gap="$2">
            <Body fontSize="$2" color="$textMuted">Tag</Body>
            <Input value={props.tag} onChangeText={props.onTagChange} placeholder="notes" autoCapitalize="none" />
          </YStack>
          <YStack f={1} gap="$2">
            <Body fontSize="$2" color="$textMuted">Version</Body>
            <Input value={props.version} onChangeText={props.onVersionChange} placeholder="v1" autoCapitalize="none" />
          </YStack>
        </XStack>

        <YStack gap="$2">
          <XStack ai="center" jc="space-between" gap="$3">
            <Body fontSize="$2" color="$textMuted">Content</Body>
            <Body fontSize="$2" color="$textMuted">{`${props.contentLength}/${props.maxContentLength}`}</Body>
          </XStack>
          <TextArea value={props.content} onChangeText={props.onContentChange} placeholder="Write up to 20,000 characters..." size="3xl" />
        </YStack>

        {statusText ? <Body fontSize="$2" color={props.error ? "$error" : "$textMuted"}>{statusText}</Body> : null}

        <XStack gap="$3">
          <Button onPress={props.onSave} loading={props.saving} bg="$primary">
            <Body color="$textInverse" fontFamily="$bold">Save</Body>
          </Button>
          <Button onPress={props.onCreateNew} bg="$surfaceAlt" borderWidth={1} borderColor="$border">
            <Body>New</Body>
          </Button>
        </XStack>

        <View>
          <Heading>Recent Documents</Heading>
          <YStack gap="$3">
            {props.loadingDocuments ? <Body fontSize="$2" color="$textMuted">Loading...</Body> : null}
            {!props.loadingDocuments && props.documents.length === 0 ? (
              <Body fontSize="$2" color="$textMuted">No documents yet.</Body>
            ) : null}
            {props.documents.map((doc) => (
              <YStack key={doc.id} gap="$1">
                <Body fontSize="$2">{doc.title}</Body>
                <Body fontSize="$2" color="$textMuted">{`${doc.tag} · ${doc.version} · ${doc.contentLength} chars`}</Body>
              </YStack>
            ))}
          </YStack>
        </View>
      </YStack>
    </YStack>
  );
}
