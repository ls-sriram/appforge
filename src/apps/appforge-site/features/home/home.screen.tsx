import React from "react";
import { Link } from "expo-router";
import {
  Body,
  Button,
  Display,
  Heading,
  Icon,
  SafeAreaView,
  ScrollView,
  View,
  XStack,
  YStack,
  type IconName,
} from "@ui";
import { SiteContainer } from "../../ui/SiteContainer";
import { SplitHero } from "../../ui/SplitHero";

const NAV_LINKS = ["Features", "Playground", "Architecture", "Pricing", "Docs"];

type Saver = { icon: IconName; label: string; hours: number };

const SAVERS: Saver[] = [
  { icon: "key", label: "Auth, sessions & onboarding", hours: 48 },
  { icon: "zap", label: "Design system & live tokens", hours: 60 },
  { icon: "shield", label: "MVVM architecture & layer enforcement", hours: 40 },
  { icon: "table", label: "Backend, database & migrations", hours: 72 },
  { icon: "dollar", label: "Payments & entitlements", hours: 36 },
  { icon: "share", label: "Web · iOS · Android · desktop setup", hours: 24 },
];

const TOTAL_HOURS = SAVERS.reduce((sum, s) => sum + s.hours, 0);

const INCLUDED = [
  "Full source — yours to keep",
  "Co-located Kotlin backend",
  "The visual code studio",
  "Lifetime updates",
];

function SiteNav() {
  return (
    <XStack jc="space-between" ai="center" gap="$4" flexWrap="wrap">
      <XStack ai="center" gap="$2">
        <Icon name="flask" size="md" tone="accent" />
        <Heading fontFamily="$bold">AppForge</Heading>
      </XStack>
      <XStack ai="center" gap="$5" flexWrap="wrap">
        {NAV_LINKS.map((link) =>
          link === "Playground" ? (
            <Link key={link} href="/studio">
              <Body fontSize="$2" color="$textMuted">{link}</Body>
            </Link>
          ) : (
            <Body key={link} fontSize="$2" color="$textMuted">{link}</Body>
          ),
        )}
      </XStack>
      <Button bg="$surfaceAlt" borderWidth={1} borderColor="$border">
        <Body>Get AppForge</Body>
      </Button>
    </XStack>
  );
}

function SaverRow({ saver }: { saver: Saver }) {
  return (
    <XStack jc="space-between" ai="center">
      <XStack ai="center" gap="$3" f={1} minWidth={0}>
        <Icon name={saver.icon} size="sm" tone="accent" />
        <Body color="$textMuted">{saver.label}</Body>
      </XStack>
      <Body>{saver.hours}h</Body>
    </XStack>
  );
}

function HoursValueProp() {
  return (
    <YStack gap="$5">
      <Body color="$primary" textTransform="uppercase" letterSpacing={1}>Production-ready app scaffolding</Body>
      <Display>Skip {TOTAL_HOURS} hours of boilerplate.</Display>
      <Body color="$textMuted">
        AppForge ships the plumbing every app needs — pre-wired, strictly layered, and
        ready to visualize and edit. Here is what you do not have to build:
      </Body>
      <YStack gap="$4" w="100%">
        {SAVERS.map((s) => (
          <SaverRow key={s.label} saver={s} />
        ))}
      </YStack>
      <XStack jc="space-between" ai="center">
        <Heading>Total saved</Heading>
        <Heading fontFamily="$bold">≈ {TOTAL_HOURS} hours</Heading>
      </XStack>
    </YStack>
  );
}

function PurchaseCard() {
  return (
    <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$6">
      <YStack gap="$5">
        <YStack gap="$1">
          <Body fontSize="$2" color="$textMuted">One-time, no subscription</Body>
          <XStack ai="center" gap="$2">
            <Display>$199</Display>
            <Body fontSize="$2" color="$textMuted">/ lifetime</Body>
          </XStack>
        </YStack>
        <YStack gap="$3">
          {INCLUDED.map((item) => (
            <XStack key={item} ai="center" gap="$3">
              <Icon name="check" size="sm" tone="accent" />
              <Body fontSize="$2" color="$textMuted">{item}</Body>
            </XStack>
          ))}
        </YStack>
        <Button bg="$primary">
          <Body color="$textInverse" fontFamily="$bold">Get AppForge</Body>
        </Button>
        <Body color="$textMuted" textAlign="center">Clone, run, and ship the same day.</Body>
      </YStack>
    </View>
  );
}

export function AppforgeSiteHomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }}>
        <YStack bg="$bg">
          <YStack p="$5">
            <SiteContainer>
              <SiteNav />
            </SiteContainer>
          </YStack>

          <SiteContainer>
            <YStack p="$6" gap="$6">
              <YStack p="$6">
                <SplitHero left={<HoursValueProp />} right={<PurchaseCard />} />
              </YStack>

              <YStack gap="$4" ai="center" p="$6">
                <Heading fontSize="$6" textAlign="center">Every line is real code in the box.</Heading>
                <Body color="$textMuted" textAlign="center">
                  Visualize it, edit it, ship it — across web, mobile, desktop and backend.
                </Body>
                <Link href="/studio">
                  <Button bg="$surfaceAlt" borderWidth={1} borderColor="$border">
                    <Body>Open the Studio →</Body>
                  </Button>
                </Link>
              </YStack>

              <Body color="$textMuted" textAlign="center">© 2026 AppForge — built with AppForge.</Body>
            </YStack>
          </SiteContainer>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
