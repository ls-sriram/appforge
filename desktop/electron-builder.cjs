const path = require("node:path");
const manifest = require("../config/app-manifest.json");

const appId = process.env.APP_ID || manifest.defaultAppId;
const selectedApp = manifest.apps[appId];

if (!selectedApp) {
  throw new Error(`Unsupported APP_ID '${appId}'.`);
}

const productName = selectedApp.displayName;
const bundleId = `com.appforge.${appId.replace(/[^a-z0-9]+/gi, "-")}`;
const rendererDir = `dist-desktop/${appId}/renderer`;
const outputDir = `dist-desktop/${appId}/artifacts`;

module.exports = {
  appId: bundleId,
  productName,
  artifactName: "${productName}-${version}-${arch}.${ext}",
  npmRebuild: false,
  nodeGypRebuild: false,
  buildDependenciesFromSource: false,
  directories: {
    output: outputDir,
  },
  files: [
    {
      from: rendererDir,
      to: "renderer",
      filter: ["**/*"],
    },
    {
      from: "desktop",
      to: "desktop",
      filter: ["main.cjs", "preload.cjs"],
    },
    "package.json",
  ],
  extraMetadata: {
    main: "desktop/main.cjs",
  },
  mac: {
    category: "public.app-category.education",
    target: ["dmg"],
    hardenedRuntime: false,
    gatekeeperAssess: false,
  },
  dmg: {
    sign: false,
  },
  asar: true,
};
