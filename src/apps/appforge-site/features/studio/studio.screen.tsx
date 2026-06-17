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
  Tag,
  View,
  XStack,
  YStack,
} from "../../../../ui";
import { SiteContainer } from "../../ui/SiteContainer";
import { useArchitectureView, type LayerLens } from "./viewmodel/use-architecture-view";
import { UiPlaygroundSection } from "./ui-playground.view";
import type {
  LayerStat,
  ProhibitedEdge,
  FeatureLayerPresence,
  BoundaryViolation,
  MvvmLayerId,
} from "./domain/repo-structure.types";

type StudioCategory = "architecture" | "uiPlayground";

const MVVM_ORDER: MvvmLayerId[] = ["view", "viewmodel", "usecase", "repository", "datasource", "runtime"];
const MVVM_LABEL: Record<MvvmLayerId, string> = {
  view: "View",
  viewmodel: "ViewModel",
  usecase: "UseCase",
  repository: "Repository",
  datasource: "DataSource",
  runtime: "Runtime",
};

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$5" px="$4" py="$3">
      <YStack gap="$1">
        <Body color="$textMuted" textTransform="uppercase" letterSpacing={1}>{label}</Body>
        <Heading fontFamily="$bold">{value}</Heading>
      </YStack>
    </View>
  );
}

function StudioHeader({ generatedAt }: { generatedAt: string }) {
  return (
    <XStack jc="space-between" ai="center" gap="$4" flexWrap="wrap">
      <XStack ai="center" gap="$2">
        <Icon name="flask" size="md" tone="accent" />
        <Heading fontFamily="$bold">AppForge Studio</Heading>
      </XStack>
      <XStack ai="center" gap="$4">
        <Body color="$textMuted">Scanned {new Date(generatedAt).toLocaleString()}</Body>
        <Link href="/">
          <Body color="$textMuted">← Back</Body>
        </Link>
      </XStack>
    </XStack>
  );
}

function LensToggle({ lens, onSelect }: { lens: LayerLens; onSelect: (l: LayerLens) => void }) {
  return (
    <XStack gap="$2">
      <Button bg={lens === "ui" ? "$primary" : "$surfaceAlt"} borderWidth={1} borderColor={lens === "ui" ? "$primary" : "$border"} onPress={() => onSelect("ui")}>
        <Body color={lens === "ui" ? "$textInverse" : "$textPrimary"}>UI composition</Body>
      </Button>
      <Button bg={lens === "mvvm" ? "$primary" : "$surfaceAlt"} borderWidth={1} borderColor={lens === "mvvm" ? "$primary" : "$border"} onPress={() => onSelect("mvvm")}>
        <Body color={lens === "mvvm" ? "$textInverse" : "$textPrimary"}>MVVM data flow</Body>
      </Button>
    </XStack>
  );
}

function LayerBox({ layer }: { layer: LayerStat }) {
  return (
    <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$4">
      <YStack gap="$2">
        <XStack jc="space-between" ai="center">
          <Body>{layer.label}</Body>
          {typeof layer.count === "number" ? <Tag label={`${layer.count}`} tone="info" /> : null}
        </XStack>
        <Body color="$primary">{layer.path}</Body>
        <Body fontSize="$2" color="$textMuted">{layer.rule}</Body>
      </YStack>
    </View>
  );
}

function LayerStack({ layers }: { layers: LayerStat[] }) {
  return (
    <YStack gap="$2" w="100%">
      {layers.map((layer, i) => (
        <YStack key={layer.id} gap="$2">
          <LayerBox layer={layer} />
          {i < layers.length - 1 ? <Body color="$textMuted" textAlign="center">↓ may depend on</Body> : null}
        </YStack>
      ))}
    </YStack>
  );
}

function ProhibitedEdges({ edges }: { edges: ProhibitedEdge[] }) {
  return (
    <YStack gap="$3">
      <Body color="$error" textTransform="uppercase" letterSpacing={1}>Prohibited skips — never allowed</Body>
      {edges.map((e) => (
        <XStack key={`${e.from}-${e.to}`} ai="center" gap="$3" flexWrap="wrap">
          <Tag label={`${e.from} ⇥ ${e.to}`} tone="danger" />
          <Body fontSize="$2" color="$textMuted">{e.reason}</Body>
        </XStack>
      ))}
    </YStack>
  );
}

function FeatureRow({ feature }: { feature: FeatureLayerPresence }) {
  const present = MVVM_ORDER.filter((id) => feature.layers[id]);
  return (
    <XStack jc="space-between" ai="center" gap="$3" flexWrap="wrap">
      <Body fontSize="$2" color="$textMuted">{feature.name}</Body>
      <XStack gap="$2" flexWrap="wrap">
        {present.length === 0 ? <Body color="$textMuted">—</Body> : present.map((id) => <Tag key={id} label={MVVM_LABEL[id]} tone="info" />)}
      </XStack>
    </XStack>
  );
}

function Violations({ violations }: { violations: BoundaryViolation[] }) {
  if (violations.length === 0) {
    return (
      <XStack ai="center" gap="$3">
        <Icon name="circle-check" size="sm" tone="success" />
        <Body fontSize="$2" color="$textMuted">No boundary violations — matches a clean lint:arch run.</Body>
      </XStack>
    );
  }
  return (
    <YStack gap="$3">
      {violations.map((v) => (
        <YStack key={v.file} gap="$1">
          <Body fontSize="$2" color="$error">{v.edge}</Body>
          <Body color="$textMuted">{v.file}</Body>
          <Body fontSize="$2" color="$textMuted">{v.message}</Body>
        </YStack>
      ))}
    </YStack>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <YStack gap="$4" w="100%">
      <YStack gap="$1">
        <Heading>{title}</Heading>
        {subtitle ? <Body fontSize="$2" color="$textMuted">{subtitle}</Body> : null}
      </YStack>
      {children}
    </YStack>
  );
}

function CategoryToggle({ category, onSelect }: { category: StudioCategory; onSelect: (c: StudioCategory) => void }) {
  return (
    <XStack gap="$2">
      <Button bg={category === "architecture" ? "$primary" : "$surfaceAlt"} borderWidth={1} borderColor={category === "architecture" ? "$primary" : "$border"} onPress={() => onSelect("architecture")}>
        <Body color={category === "architecture" ? "$textInverse" : "$textPrimary"}>Architecture</Body>
      </Button>
      <Button bg={category === "uiPlayground" ? "$primary" : "$surfaceAlt"} borderWidth={1} borderColor={category === "uiPlayground" ? "$primary" : "$border"} onPress={() => onSelect("uiPlayground")}>
        <Body color={category === "uiPlayground" ? "$textInverse" : "$textPrimary"}>UI Playground</Body>
      </Button>
    </XStack>
  );
}

export function AppforgeSiteStudioScreen() {
  const { overview, lens, setLens } = useArchitectureView();
  const { architecture, totals } = overview;
  const layers = lens === "ui" ? architecture.uiCompositionLayers : architecture.mvvmLayers;
  const [category, setCategory] = React.useState<StudioCategory>("architecture");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <YStack bg="$bg">
          <YStack p="$5">
            <SiteContainer>
              <StudioHeader generatedAt={overview.generatedAt} />
            </SiteContainer>
          </YStack>

          <YStack p="$5">
            <SiteContainer>
              <CategoryToggle category={category} onSelect={setCategory} />
            </SiteContainer>
          </YStack>

          {category === "architecture" ? (
            <SiteContainer>
              <YStack p="$6" gap="$6">
                <YStack gap="$2">
                  <Body color="$primary" textTransform="uppercase" letterSpacing={1}>Architecture</Body>
                  <Display>Your app, by the layers.</Display>
                  <Body color="$textMuted">A live read of how this repo is structured — generated from the source, not hand-drawn.</Body>
                </YStack>

                <XStack gap="$3" flexWrap="wrap">
                  <StatPill label="UI layers" value={`${totals.uiLayers}`} />
                  <StatPill label="MVVM layers" value={`${totals.mvvmLayers}`} />
                  <StatPill label="Features" value={`${totals.features}`} />
                  <StatPill label="Violations" value={`${totals.violations}`} />
                </XStack>

                <Section title="Layer stack" subtitle="Lower layers may depend on higher ones — never the reverse.">
                  <LensToggle lens={lens} onSelect={setLens} />
                  <LayerStack layers={layers} />
                  {lens === "mvvm" ? <ProhibitedEdges edges={architecture.prohibitedEdges} /> : null}
                </Section>

                <Section title="Per-feature layers" subtitle="Which MVVM layers each feature slice actually has. Missing layers are expected for simple features.">
                  <YStack gap="$3">
                    {architecture.featureLayerMatrix.map((f) => (
                      <FeatureRow key={f.name} feature={f} />
                    ))}
                  </YStack>
                </Section>

                <Section title="Boundary violations" subtitle="Re-derived from the same rules as npm run lint:arch.">
                  <Violations violations={architecture.violations} />
                </Section>
              </YStack>
            </SiteContainer>
          ) : (
            <SiteContainer>
              <YStack p="$6" gap="$6">
                <YStack gap="$2">
                  <Body color="$primary" textTransform="uppercase" letterSpacing={1}>UI Playground</Body>
                  <Display>Compose Tamagui directly.</Display>
                </YStack>
                <UiPlaygroundSection />
              </YStack>
            </SiteContainer>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
