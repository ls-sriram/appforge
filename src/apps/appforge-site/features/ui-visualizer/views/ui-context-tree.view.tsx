import React from "react";
import { Pressable } from "react-native";
import { Body, Label, View, XStack, YStack } from "../../../../../ui";
import type { UiDocument } from "../domain/ui-document.types";

const AUTH_KEYWORDS = ["login", "register", "signup", "forgot", "password", "auth", "signin"];
const ONBOARDING_KEYWORDS = ["onboarding", "welcome", "setup"];

function groupDocuments(documents: UiDocument[]) {
  const auth: UiDocument[] = [];
  const onboarding: UiDocument[] = [];
  const main: UiDocument[] = [];
  for (const doc of documents) {
    const id = doc.id.toLowerCase();
    if (AUTH_KEYWORDS.some((k) => id.includes(k))) auth.push(doc);
    else if (ONBOARDING_KEYWORDS.some((k) => id.includes(k))) onboarding.push(doc);
    else main.push(doc);
  }
  return [
    { label: "Auth", docs: auth },
    { label: "Main", docs: main },
    { label: "Onboarding", docs: onboarding },
  ].filter((g) => g.docs.length > 0);
}

export function ScreenLibrary({
  documents,
  selectedDocumentId,
  onSelectDocument,
}: {
  documents: UiDocument[];
  selectedDocumentId: string;
  onSelectDocument: (id: string) => void;
}) {
  return (
    <YStack f={1}>
      <XStack
        px="$3"
        py="$2"
        ai="center"
        jc="space-between"
        borderBottomColor="$borderSubtle"
        borderBottomWidth={1}
      >
        <Label color="$textMuted" textTransform="uppercase">
          Screens
        </Label>
        <View
          px="$2"
          py="$1"
          br="$2"
          bg="$surfaceAlt"
          borderColor="$borderSubtle"
          borderWidth={1}
        >
          <Body fontSize="$1" color="$textMuted">
            +
          </Body>
        </View>
      </XStack>

      <YStack py="$1" f={1}>
        {groupDocuments(documents).map((group) => {
          return (
            <YStack key={group.label} pb="$2">
              <Body
                px="$3"
                pt="$2"
                pb="$1"
                fontSize="$1"
                color="$textMuted"
                textTransform="uppercase"
                letterSpacing={1}
                opacity={0.55}
              >
                {group.label}
              </Body>

              {group.docs.map((doc) => {
                const active = selectedDocumentId === doc.id;
                return (
                  <Pressable key={doc.id} onPress={() => onSelectDocument(doc.id)}>
                    <XStack
                      ai="center"
                      gap="$2"
                      px="$3"
                      py="$2"
                      bg={active ? "$surfaceAlt" : "transparent"}
                      borderLeftColor={active ? "$primary" : "transparent"}
                      borderLeftWidth={2}
                    >
                      <View
                        w={5}
                        h={5}
                        br={999}
                        bg={active ? "$primary" : "$border"}
                      />
                      <Body
                        fontSize="$2"
                        color={active ? "$textPrimary" : "$textMuted"}
                        f={1}
                      >
                        {doc.name}
                      </Body>
                      {active && (
                        <View
                          px="$2"
                          py="$1"
                          br={999}
                          bg="$primaryMuted"
                          borderColor="$primary"
                          borderWidth={1}
                        >
                          <Body fontSize="$1" color="$primary">
                            live
                          </Body>
                        </View>
                      )}
                    </XStack>
                  </Pressable>
                );
              })}
            </YStack>
          );
        })}
      </YStack>

      <View mx="$2" mb="$2" p="$2" br="$3" borderColor="$borderSubtle" borderWidth={1} opacity={0.5}>
        <Body fontSize="$1" color="$textMuted" textAlign="center">
          + New screen
        </Body>
      </View>
    </YStack>
  );
}
