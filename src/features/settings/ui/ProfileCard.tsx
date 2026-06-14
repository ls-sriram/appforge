/**
 * ProfileCard — displays the user's identity.
 *
 * Supports two APIs:
 *  1. Individual props: <ProfileCard name="..." email="..." uid="..." />
 *  2. Identity object: <ProfileCard identity={{ uid, email, name }} />
 *
 * Optional onPress for tappable cards.
 */

import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import { Block, Avatar, Icon, Text } from "../../../ui/primitives"
import { Panel } from "../../../ui/panels";

export interface ProfileCardProps {
  name?: string;
  email?: string;
  uid?: string;
  identity?: {
    uid: string;
    email: string;
    name?: string;
  };
  onPress?: () => void;
  size?: "sm" | "md" | "lg";
}

export function ProfileCard({
  name: nameProp,
  email: emailProp,
  uid: uidProp,
  identity,
  onPress,
  size = "lg",
}: ProfileCardProps) {
  const t = useTheme();
  const c = t.colors;

  const name = identity?.name ?? nameProp;
  const email = identity?.email ?? emailProp ?? "";
  const uid = identity?.uid ?? uidProp ?? "";
  const content = (
    <Panel variant="strong" overflow="hidden">
      <Block direction="horizontal" align="center" justify="space-between" space="md">
        <Block direction="horizontal" align="center" space="md" frame="fluid">
          <Avatar name={name || email} email={email} size={size} />
          <Block space="xxs" frame="fluid">
            <Text variant="h3" numberOfLines={1}>
              {name || "Anonymous"}
            </Text>
            <Text variant="bodySm" tone="secondary" numberOfLines={1}>
              {email || "No email available"}
            </Text>
            {uid ? (
              <Text variant="caption" tone="muted" numberOfLines={1}>
                ID: {uid.slice(0, 12)}…
              </Text>
            ) : null}
          </Block>
        </Block>
        {onPress ? <Icon name="chevron-right" size="xl" tone="quaternary" /> : null}
      </Block>
    </Panel>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  identity: {
    flex: 1,
    minWidth: 0,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
});
