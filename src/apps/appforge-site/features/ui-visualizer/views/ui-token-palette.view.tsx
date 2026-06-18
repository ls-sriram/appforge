import React from "react";
import { Pressable } from "react-native";
import { Body, Input, Label, View, XStack, YStack } from "../../../../../ui";
import {
  COLOR_TOKEN_GROUPS,
  DARK_THEME_RESOLVED,
  LIGHT_THEME_RESOLVED,
} from "../domain/ui-theme-palette";

function TokenSwatch({
  token,
  resolved,
  override,
  onEdit,
}: {
  token: string;
  resolved: string;
  override?: string;
  onEdit: (key: string, value: string) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const displayed = override ?? resolved;

  return (
    <YStack gap="$1">
      <Pressable
        onPress={() => {
          setDraft(displayed);
          setEditing((v) => !v);
        }}
      >
        <XStack ai="center" gap="$2">
          <View
            w={28}
            h={28}
            br="$2"
            bg={displayed}
            borderColor={override ? "$primary" : "$borderSubtle"}
            borderWidth={override ? 2 : 1}
            flexShrink={0}
          />
          <YStack gap={2} f={1} minWidth={0}>
            <Body fontSize="$1" color="$textPrimary">
              {token}
            </Body>
            <Body fontSize={10} color="$textMuted" numberOfLines={1}>
              {displayed}
            </Body>
          </YStack>
          {override && (
            <View
              px="$1"
              py={2}
              br="$2"
              bg="$primaryMuted"
              borderColor="$primary"
              borderWidth={1}
            >
              <Body fontSize={9} color="$primary">
                edited
              </Body>
            </View>
          )}
        </XStack>
      </Pressable>
      {editing && (
        <XStack ai="center" gap="$2">
          <View f={1}>
            <Input
              value={draft}
              onChangeText={setDraft}
              placeholder={resolved}
              autoFocus
            />
          </View>
          <Pressable
            onPress={() => {
              onEdit(token, draft);
              setEditing(false);
            }}
          >
            <View px="$2" py="$1" br="$2" bg="$primary">
              <Body fontSize="$1" color="$textInverse">
                Set
              </Body>
            </View>
          </Pressable>
          <Pressable onPress={() => setEditing(false)}>
            <Body fontSize="$1" color="$textMuted">
              Cancel
            </Body>
          </Pressable>
        </XStack>
      )}
    </YStack>
  );
}

export function UiTokenPaletteView({
  themeOverrides,
  onSetOverride,
}: {
  themeOverrides: Record<string, string>;
  onSetOverride: (key: string, value: string) => void;
}) {
  const [baseTheme, setBaseTheme] = React.useState<"dark" | "light">("dark");
  const base = baseTheme === "dark" ? DARK_THEME_RESOLVED : LIGHT_THEME_RESOLVED;

  return (
    <YStack>
      {/* Theme selector */}
      <XStack
        px="$3"
        py="$2"
        ai="center"
        jc="space-between"
        borderBottomColor="$borderSubtle"
        borderBottomWidth={1}
      >
        <Label color="$textMuted" textTransform="uppercase">
          Base Theme
        </Label>
        <XStack gap="$1">
          {(["dark", "light"] as const).map((t) => (
            <Pressable key={t} onPress={() => setBaseTheme(t)}>
              <View
                px="$2"
                py="$1"
                br={999}
                bg={baseTheme === t ? "$primary" : "$surfaceAlt"}
                borderColor={baseTheme === t ? "$primary" : "$borderSubtle"}
                borderWidth={1}
              >
                <Body
                  fontSize="$1"
                  color={baseTheme === t ? "$textInverse" : "$textMuted"}
                >
                  {t}
                </Body>
              </View>
            </Pressable>
          ))}
        </XStack>
      </XStack>

      <Body px="$3" pt="$2" fontSize="$1" color="$textMuted">
        Click a swatch to override. Changes preview on canvas in the next build.
      </Body>

      {COLOR_TOKEN_GROUPS.map((group) => (
        <YStack
          key={group.label}
          px="$3"
          py="$2"
          gap="$2"
          borderBottomColor="$borderSubtle"
          borderBottomWidth={1}
        >
          <Body
            fontSize="$1"
            color="$textMuted"
            textTransform="uppercase"
            letterSpacing={1}
          >
            {group.label}
          </Body>
          {group.tokens.map((token) => (
            <TokenSwatch
              key={token}
              token={token}
              resolved={base[token] ?? "#000"}
              override={themeOverrides[token]}
              onEdit={onSetOverride}
            />
          ))}
        </YStack>
      ))}
    </YStack>
  );
}
