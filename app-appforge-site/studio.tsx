import React from "react";
import { AppforgeSiteUiVisualizerScreen } from "../src/apps/appforge-site/features/ui-visualizer/ui-visualizer.screen";

// Route file stays thin — keeps the legacy studio path pointed at the same visualizer.
export default function AppforgeSiteStudioRoute() {
  return <AppforgeSiteUiVisualizerScreen />;
}
