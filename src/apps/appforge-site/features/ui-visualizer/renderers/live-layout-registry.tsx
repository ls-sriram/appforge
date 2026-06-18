import React from "react";
import { ScrollView } from "react-native";
import { Theme } from "../../../../../ui";
import { ForgotPasswordLayout } from "../../../../../apps/example-app/features/auth/forgot-password.layout";
import { LoginLayout } from "../../../../../apps/example-app/features/auth/login.layout";
import { RegisterLayout } from "../../../../../apps/example-app/features/auth/register.layout";
import { HomeLayout } from "../../../../../apps/example-app/features/home/home.layout";
import { OnboardingLayout } from "../../../../../apps/example-app/features/onboarding/onboarding.layout";
import { ProfileLayout } from "../../../../../apps/example-app/features/profile/profile.layout";
import { SitActionLayout } from "../../../../../apps/sit-app/features/home/sit-action.layout";
import { SitCompletionLayout } from "../../../../../apps/sit-app/features/home/sit-completion.layout";
import { SitLandingLayout } from "../../../../../apps/sit-app/features/home/sit-landing.layout";
import { SitMeditateLayout } from "../../../../../apps/sit-app/features/home/sit-meditate.layout";
import { SitOnboardingLayout } from "../../../../../apps/sit-app/features/home/sit-onboarding.layout";
import { SitPhilosophyLayout } from "../../../../../apps/sit-app/features/home/sit-philosophy.layout";
import { SitTimerLayout } from "../../../../../apps/sit-app/features/home/sit-timer.layout";
import { SitVipassanaLayout } from "../../../../../apps/sit-app/features/home/sit-vipassana.layout";
import { PHILOSOPHY_TOPICS } from "../../../../../apps/sit-app/features/session/domain/content";
import { UiTokenPaletteView } from "../views/ui-token-palette.view";
import { UiPrimitivePalette } from "../views/ui-component-palette.view";
import { UiInspectorView } from "../views/ui-inspector.view";
import { UI_PLAYGROUND_DOCUMENTS } from "../domain/ui-document.fixtures";

const MOCK_DOCUMENT = UI_PLAYGROUND_DOCUMENTS[0];

// Every screen renders its actual layout component so the visualizer canvas
// is pixel-identical to the native app. renderUiNode is not used for these screens.

// ── AppForge site live panels ─────────────────────────────────────────────────

function TokenPanelLive() {
  const [overrides, setOverrides] = React.useState<Record<string, string>>({});
  return (
    <ScrollView>
      <UiTokenPaletteView
        themeOverrides={overrides}
        onSetOverride={(k, v) => setOverrides((p) => ({ ...p, [k]: v }))}
        onClearOverride={(k) => setOverrides((p) => { const n = { ...p }; delete n[k]; return n; })}
        onClearAll={() => setOverrides({})}
        onApplyPreset={setOverrides}
      />
    </ScrollView>
  );
}

function PalettePanelLive() {
  return (
    <ScrollView>
      <UiPrimitivePalette onAdd={() => {}} />
    </ScrollView>
  );
}

function DesignPanelLive() {
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | undefined>(
    MOCK_DOCUMENT.rootId,
  );
  return (
    <UiInspectorView
      node={selectedNodeId ? MOCK_DOCUMENT.nodes[selectedNodeId] : undefined}
      document={MOCK_DOCUMENT}
      selectedNodeId={selectedNodeId}
      onSelectNode={setSelectedNodeId}
      onUpdateProp={() => {}}
      onRemove={() => {}}
    />
  );
}

function SitLandingLive() {
  return (
    <Theme name="dark">
      <SitLandingLayout
        onMeditate={() => {}}
        onAction={() => {}}
        onVipassana={() => {}}
        onInfo={() => {}}
      />
    </Theme>
  );
}

function SitMeditateLive() {
  return (
    <Theme name="dark">
      <SitMeditateLayout
        sessionType="anapana"
        sessionMinutes={10}
        onBack={() => {}}
        onInfo={() => {}}
        onBegin={() => {}}
        onSelectSessionType={() => {}}
        onSelectSessionMinutes={() => {}}
      />
    </Theme>
  );
}

function SitActionLive() {
  return (
    <Theme name="dark">
      <SitActionLayout
        intentionText="reply to the hard email"
        sessionMinutes={20}
        onBack={() => {}}
        onInfo={() => {}}
        onBegin={() => {}}
        onChangeIntentionText={() => {}}
        onSelectSessionMinutes={() => {}}
      />
    </Theme>
  );
}

function SitOnboardingLive() {
  return (
    <Theme name="dark">
      <SitOnboardingLayout
        slide={{
          kind: "content",
          theme: "clarity",
          headline: "You already know the answer.\nYou just need to hear it.",
          quote: "Mind precedes thoughts, mind is their chief.",
          attribution: "Dhammapada 1",
        }}
        index={0}
        total={5}
        onNext={() => {}}
        onComplete={() => {}}
      />
    </Theme>
  );
}

function SitTimerLive() {
  return <Theme name="dark"><SitTimerLayout eyebrow="anapana" timer="09:42" caption="breathe in" onBack={() => {}} /></Theme>;
}

function SitCompletionLive() {
  return <Theme name="dark"><SitCompletionLayout onContinue={() => {}} /></Theme>;
}

function SitPhilosophyLive() {
  return <Theme name="dark"><SitPhilosophyLayout topics={PHILOSOPHY_TOPICS} openTopicId={PHILOSOPHY_TOPICS[0]?.id ?? null} onBack={() => {}} onToggleTopic={() => {}} /></Theme>;
}

function SitVipassanaLive() {
  return (
    <Theme name="dark">
      <SitVipassanaLayout
        activeSession={{
          id: "s1",
          startHour: 4,
          startMin: 0,
          label: "awaken",
          duration: 30,
          description: "anapana · settle the mind",
          kind: "sit",
          status: "active",
        }}
        schedule={[
          { id: "s1", startHour: 4, startMin: 0, label: "awaken", duration: 30, description: "anapana · settle the mind", kind: "sit", status: "active" },
          { id: "s2", startHour: 6, startMin: 30, label: "breakfast & walking", duration: 90, description: "slow, mindful movement", kind: "rest", status: "upcoming" },
        ]}
        scheduleExpanded
        onBack={() => {}}
        onInfo={() => {}}
        onBegin={() => {}}
        onToggleSchedule={() => {}}
      />
    </Theme>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LIVE_LAYOUTS: Record<string, React.ComponentType<any>> = {
  // Example app screens
  forgotpassword: ForgotPasswordLayout,
  login:          LoginLayout,
  register:       RegisterLayout,
  home:           HomeLayout,
  onboarding:     OnboardingLayout,
  profile:        ProfileLayout,
  sitaction:      SitActionLive,
  sitcompletion:  SitCompletionLive,
  sitlanding:     SitLandingLive,
  sitmeditate:    SitMeditateLive,
  sitonboarding:  SitOnboardingLive,
  sitphilosophy:  SitPhilosophyLive,
  sittimer:       SitTimerLive,
  sitvipassana:   SitVipassanaLive,

  // AppForge site panels
  tokenpanel:     TokenPanelLive,
  palettepanel:   PalettePanelLive,
  designpanel:    DesignPanelLive,
};
