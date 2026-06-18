import React from "react";
import { ScrollView } from "react-native";
import { ForgotPasswordLayout } from "../../../../../apps/example-app/features/auth/forgot-password.layout";
import { LoginLayout } from "../../../../../apps/example-app/features/auth/login.layout";
import { RegisterLayout } from "../../../../../apps/example-app/features/auth/register.layout";
import { HomeLayout } from "../../../../../apps/example-app/features/home/home.layout";
import { OnboardingLayout } from "../../../../../apps/example-app/features/onboarding/onboarding.layout";
import { ProfileLayout } from "../../../../../apps/example-app/features/profile/profile.layout";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LIVE_LAYOUTS: Record<string, React.ComponentType<any>> = {
  // Example app screens
  forgotpassword: ForgotPasswordLayout,
  login:          LoginLayout,
  register:       RegisterLayout,
  home:           HomeLayout,
  onboarding:     OnboardingLayout,
  profile:        ProfileLayout,

  // AppForge site panels
  tokenpanel:     TokenPanelLive,
  palettepanel:   PalettePanelLive,
  designpanel:    DesignPanelLive,
};
