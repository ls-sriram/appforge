import React from "react";
import { AppforgeSiteHomeScreen } from "../src/apps/appforge-site/features/home/home.screen";

// Route file stays thin — renders the marketing landing screen directly.
export default function AppforgeSiteIndexRoute() {
  return <AppforgeSiteHomeScreen />;
}
