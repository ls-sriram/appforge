import React from "react";
import { AppforgeSiteUiVisualizerScreen } from "../src/apps/appforge-site/features/ui-visualizer/ui-visualizer.screen";

// Route file stays thin — renders the editor-first visualizer surface directly.
export default function AppforgeSiteIndexRoute() {
  return <AppforgeSiteUiVisualizerScreen />;
}
