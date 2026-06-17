import React from "react";
import { Link } from "expo-router";
import { Block, Col, Row, Card, Display, Heading, Body, Label, Button, Icon, Tag } from "../../../../ui/primitives";
import { ScrollArea } from "../../../../ui/primitives";
import { StatPill } from "../../../../ui/blocks";
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

function StudioHeader({ generatedAt }: { generatedAt: string }) {
  return (
    <Row spread centered>
      <Row centered between="xs">
        <Icon name="flask" size="md" tone="accent" />
        <Heading bold>AppForge Studio</Heading>
      </Row>
      <Row centered between="md">
        <Label dim>Scanned {new Date(generatedAt).toLocaleString()}</Label>
        <Link href="/">
          <Body size="sm" dim>← Back</Body>
        </Link>
      </Row>
    </Row>
  );
}

function LensToggle({ lens, onSelect }: { lens: LayerLens; onSelect: (l: LayerLens) => void }) {
  return (
    <Row between="xs">
      <Button label="UI composition" size="sm" variant={lens === "ui" ? "primary" : "secondary"} onPress={() => onSelect("ui")} fullWidth={false} />
      <Button label="MVVM data flow" size="sm" variant={lens === "mvvm" ? "primary" : "secondary"} onPress={() => onSelect("mvvm")} fullWidth={false} />
    </Row>
  );
}

function LayerBox({ layer }: { layer: LayerStat }) {
  return (
    <Card pad="md">
      <Col between="xs">
        <Row spread centered>
          <Body>{layer.label}</Body>
          {typeof layer.count === "number" ? <Tag label={`${layer.count}`} tone="info" /> : null}
        </Row>
        <Label primary>{layer.path}</Label>
        <Body size="sm" dim>{layer.rule}</Body>
      </Col>
    </Card>
  );
}

function LayerStack({ layers }: { layers: LayerStat[] }) {
  return (
    <Col between="xs" expand>
      {layers.map((layer, i) => (
        <Col key={layer.id} between="xs">
          <LayerBox layer={layer} />
          {i < layers.length - 1 ? (
            <Label dim center>↓ may depend on</Label>
          ) : null}
        </Col>
      ))}
    </Col>
  );
}

function ProhibitedEdges({ edges }: { edges: ProhibitedEdge[] }) {
  return (
    <Col between="sm" expand>
      <Label upper tracking="sm" error>PROHIBITED SKIPS — NEVER ALLOWED</Label>
      {edges.map((e) => (
        <Row key={`${e.from}-${e.to}`} centered between="sm" flexWrap="wrap">
          <Tag label={`${e.from} ⇥ ${e.to}`} tone="danger" />
          <Body size="sm" dim>{e.reason}</Body>
        </Row>
      ))}
    </Col>
  );
}

function FeatureRow({ feature }: { feature: FeatureLayerPresence }) {
  const present = MVVM_ORDER.filter((id) => feature.layers[id]);
  return (
    <Row spread centered flexWrap="wrap" between="sm">
      <Body size="sm" dim>{feature.name}</Body>
      <Row between="xs" flexWrap="wrap">
        {present.length === 0 ? (
          <Label dim>—</Label>
        ) : (
          present.map((id) => <Tag key={id} label={MVVM_LABEL[id]} tone="info" />)
        )}
      </Row>
    </Row>
  );
}

function Violations({ violations }: { violations: BoundaryViolation[] }) {
  if (violations.length === 0) {
    return (
      <Row centered between="sm">
        <Icon name="circle-check" size="sm" tone="success" />
        <Body size="sm" dim>No boundary violations — matches a clean lint:arch run.</Body>
      </Row>
    );
  }
  return (
    <Col between="sm">
      {violations.map((v) => (
        <Col key={v.file} between="xxs">
          <Body size="sm" error>{v.edge}</Body>
          <Label dim>{v.file}</Label>
          <Body size="sm" dim>{v.message}</Body>
        </Col>
      ))}
    </Col>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Col between="md" expand>
      <Col between="xxs">
        <Heading>{title}</Heading>
        {subtitle ? <Body size="sm" dim>{subtitle}</Body> : null}
      </Col>
      {children}
    </Col>
  );
}

function CategoryToggle({ category, onSelect }: { category: StudioCategory; onSelect: (c: StudioCategory) => void }) {
  return (
    <Row between="xs">
      <Button label="Architecture" size="sm" variant={category === "architecture" ? "primary" : "secondary"} onPress={() => onSelect("architecture")} fullWidth={false} />
      <Button label="UI Playground" size="sm" variant={category === "uiPlayground" ? "primary" : "secondary"} onPress={() => onSelect("uiPlayground")} fullWidth={false} />
    </Row>
  );
}

export function AppforgeSiteStudioScreen() {
  const { overview, lens, setLens } = useArchitectureView();
  const { architecture, totals } = overview;
  const layers = lens === "ui" ? architecture.uiCompositionLayers : architecture.mvvmLayers;
  const [category, setCategory] = React.useState<StudioCategory>("architecture");

  return (
    <Block frame="fill" paint="page" safeArea="all">
      <ScrollArea>
        <Col pad="lg">
          <SiteContainer>
            <StudioHeader generatedAt={overview.generatedAt} />
          </SiteContainer>
        </Col>

        <Col pad="lg">
          <SiteContainer>
            <CategoryToggle category={category} onSelect={setCategory} />
          </SiteContainer>
        </Col>

        {category === "architecture" ? (
          <SiteContainer>
            <Col pad="xl" between="xl">
              <Col between="xs">
                <Label upper tracking="md" primary>ARCHITECTURE</Label>
                <Display>Your app, by the layers.</Display>
                <Body dim>A live read of how this repo is structured — generated from the source, not hand-drawn.</Body>
              </Col>

              <Row between="xl" flexWrap="wrap">
                <StatPill label="UI layers" value={`${totals.uiLayers}`} tone="accent" />
                <StatPill label="MVVM layers" value={`${totals.mvvmLayers}`} />
                <StatPill label="Features" value={`${totals.features}`} />
                <StatPill label="Violations" value={`${totals.violations}`} tone={totals.violations === 0 ? "success" : "danger"} />
              </Row>

              <Section
                title="Layer stack"
                subtitle="Lower layers may depend on higher ones — never the reverse."
              >
                <LensToggle lens={lens} onSelect={setLens} />
                <LayerStack layers={layers} />
                {lens === "mvvm" ? <ProhibitedEdges edges={architecture.prohibitedEdges} /> : null}
              </Section>

              <Section
                title="Per-feature layers"
                subtitle="Which MVVM layers each feature slice actually has. Missing layers are expected for simple features."
              >
                <Col between="sm" expand>
                  {architecture.featureLayerMatrix.map((f) => (
                    <FeatureRow key={f.name} feature={f} />
                  ))}
                </Col>
              </Section>

              <Section
                title="Boundary violations"
                subtitle="Re-derived from the same rules as npm run lint:arch."
              >
                <Violations violations={architecture.violations} />
              </Section>
            </Col>
          </SiteContainer>
        ) : (
          <SiteContainer>
            <Col pad="xl" between="xl">
              <Col between="xs">
                <Label upper tracking="md" primary>UI PLAYGROUND</Label>
                <Display>Compose blocks, not files.</Display>
              </Col>
              <UiPlaygroundSection />
            </Col>
          </SiteContainer>
        )}
      </ScrollArea>
    </Block>
  );
}
