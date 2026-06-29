import React from "react";
import { Body, Button, Heading, Input, TextArea, useUI, XStack, YStack } from "../../../../platform/ui/index";
import type { TextDocumentModel } from "../../domain/model";

interface TextEditorViewProps {
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

export function TextEditorView(props: TextEditorViewProps) {
  const { contracts } = useUI();
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
          <Input contract={contracts.input!["default"]} value={props.title} onChangeText={props.onTitleChange} placeholder="Document title" autoCapitalize="sentences" />
        </YStack>

        <XStack gap="$3">
          <YStack f={1} gap="$2">
            <Body fontSize="$2" color="$textMuted">Tag</Body>
            <Input contract={contracts.input!["default"]} value={props.tag} onChangeText={props.onTagChange} placeholder="notes" autoCapitalize="none" />
          </YStack>
          <YStack f={1} gap="$2">
            <Body fontSize="$2" color="$textMuted">Version</Body>
            <Input contract={contracts.input!["default"]} value={props.version} onChangeText={props.onVersionChange} placeholder="v1" autoCapitalize="none" />
          </YStack>
        </XStack>

        <YStack gap="$2">
          <XStack ai="center" jc="space-between" gap="$3">
            <Body fontSize="$2" color="$textMuted">Content</Body>
            <Body fontSize="$2" color="$textMuted">{`${props.contentLength}/${props.maxContentLength}`}</Body>
          </XStack>
          <TextArea contract={contracts.textArea!["default"]} value={props.content} onChangeText={props.onContentChange} placeholder="Write up to 20,000 characters..." />
        </YStack>

        {statusText ? <Body fontSize="$2" color={props.error ? "$error" : "$textMuted"}>{statusText}</Body> : null}

        <XStack gap="$3">
          <Button contract={contracts.button!["primary"]} onPress={props.onSave} loading={props.saving}>Save</Button>
          <Button contract={contracts.button!["secondary"]} onPress={props.onCreateNew}>New</Button>
        </XStack>

        <YStack gap="$3">
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
        </YStack>
      </YStack>
    </YStack>
  );
}
