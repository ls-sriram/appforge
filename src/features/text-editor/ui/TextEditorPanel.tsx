import React from "react";
import { View } from "react-native";
import { Block, Button, Input, Text, TextArea } from "../../../ui/primitives"
import type { TextDocumentModel } from "..";
import { useTheme } from "../../../theme/ThemeProvider";

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
  const theme = useTheme();
  const c = theme.colors;

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
    <Block>
      <Block space="md">
        <Block>
          <Text variant="caption">Title</Text>
          <Input value={props.title} onChangeText={props.onTitleChange} placeholder="Document title" autoCapitalize="sentences" />
        </Block>

        <Block direction="horizontal" space="sm">
          <Block>
            <Text variant="caption">Tag</Text>
            <Input value={props.tag} onChangeText={props.onTagChange} placeholder="notes" autoCapitalize="none" />
          </Block>
          <Block>
            <Text variant="caption">Version</Text>
            <Input value={props.version} onChangeText={props.onVersionChange} placeholder="v1" autoCapitalize="none" />
          </Block>
        </Block>

        <Block>
          <Block direction="horizontal">
            <Text variant="caption">Content</Text>
            <Text variant="caption">{`${props.contentLength}/${props.maxContentLength}`}</Text>
          </Block>
          <TextArea value={props.content} onChangeText={props.onContentChange} placeholder="Write up to 20,000 characters..." size="3xl" />
        </Block>

        {statusText ? <Text variant="caption" tone={props.error ? "danger" : "muted"}>{statusText}</Text> : null}

        <Block direction="horizontal" space="sm">
          <Button label="Save" onPress={props.onSave} loading={props.saving} />
          <Button label="New" variant="secondary" onPress={props.onCreateNew} fullWidth={false} />
        </Block>

        <View>
          <Text variant="h3">Recent Documents</Text>
          <Block space="sm">
            {props.loadingDocuments ? <Text variant="caption">Loading...</Text> : null}
            {!props.loadingDocuments && props.documents.length === 0 ? (
              <Text variant="caption">No documents yet.</Text>
            ) : null}
            {props.documents.map((doc) => (
              <Block key={doc.id}>
                <Block>
                  <Text variant="bodySm">{doc.title}</Text>
                  <Text variant="caption">{`${doc.tag} · ${doc.version} · ${doc.contentLength} chars`}</Text>
                </Block>
              </Block>
            ))}
          </Block>
        </View>
      </Block>
    </Block>
  );
}
