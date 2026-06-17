import React from "react";
import { Link } from "expo-router";
import { Block, Col, Row, Card, Display, Heading, Body, Label, Button, Icon, type IconName } from "../../../../ui/primitives";
import { ScrollArea } from "../../../../ui/primitives";
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
    <Row spread centered>
      <Row centered between="xs">
        <Icon name="flask" size="md" tone="accent" />
        <Heading bold>AppForge</Heading>
      </Row>
      <Row centered between="lg" flexWrap="wrap">
        {NAV_LINKS.map((link) =>
          link === "Playground" ? (
            <Link key={link} href="/studio">
              <Body size="sm" dim>{link}</Body>
            </Link>
          ) : (
            <Body key={link} size="sm" dim>{link}</Body>
          ),
        )}
      </Row>
      <Button label="Get AppForge" size="sm" variant="secondary" onPress={() => {}} fullWidth={false} />
    </Row>
  );
}

function SaverRow({ saver }: { saver: Saver }) {
  return (
    <Row spread centered>
      <Row centered between="sm" fluid>
        <Icon name={saver.icon} size="sm" tone="accent" />
        <Body dim>{saver.label}</Body>
      </Row>
      <Body>{saver.hours}h</Body>
    </Row>
  );
}

function HoursValueProp() {
  return (
    <Col between="lg">
      <Label upper tracking="md" primary>PRODUCTION-READY APP SCAFFOLDING</Label>
      <Display>Skip {TOTAL_HOURS} hours of boilerplate.</Display>
      <Body dim>
        AppForge ships the plumbing every app needs — pre-wired, strictly layered, and
        ready to visualize and edit. Here is what you do not have to build:
      </Body>
      <Col between="md" expand>
        {SAVERS.map((s) => (
          <SaverRow key={s.label} saver={s} />
        ))}
      </Col>
      <Row spread centered>
        <Heading>Total saved</Heading>
        <Heading bold>≈ {TOTAL_HOURS} hours</Heading>
      </Row>
    </Col>
  );
}

function PurchaseCard() {
  return (
    <Card pad="xl">
      <Col between="lg">
        <Col between="xxs">
          <Body size="sm" dim>One-time, no subscription</Body>
          <Row centered between="xs">
            <Display>$199</Display>
            <Body size="sm" dim>/ lifetime</Body>
          </Row>
        </Col>
        <Col between="sm">
          {INCLUDED.map((item) => (
            <Row key={item} centered between="sm">
              <Icon name="check" size="sm" tone="accent" />
              <Body size="sm" dim>{item}</Body>
            </Row>
          ))}
        </Col>
        <Button label="Get AppForge" onPress={() => {}} fullWidth />
        <Label dim center>Clone, run, and ship the same day.</Label>
      </Col>
    </Card>
  );
}

export function AppforgeSiteHomeScreen() {
  return (
    <Block frame="fill" paint="page" safeArea="all">
      <ScrollArea>
        <Col pad="lg">
          <SiteContainer>
            <SiteNav />
          </SiteContainer>
        </Col>

        <SiteContainer>
          <Col pad="xl" between="xl">
            <Col pad="xl">
              <SplitHero left={<HoursValueProp />} right={<PurchaseCard />} />
            </Col>

            <Col between="md" centered pad="xl">
              <Heading size="lg" center>Every line is real code in the box.</Heading>
              <Body dim center>
                Visualize it, edit it, ship it — across web, mobile, desktop and backend.
              </Body>
              <Link href="/studio">
                <Button label="Open the Studio →" variant="secondary" onPress={() => {}} fullWidth={false} />
              </Link>
            </Col>

            <Label dim center>© 2026 AppForge — built with AppForge.</Label>
          </Col>
        </SiteContainer>
      </ScrollArea>
    </Block>
  );
}
