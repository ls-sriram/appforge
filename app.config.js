const appJson = require("./app.json");
const appManifest = require("./config/app-manifest.json");

const expoConfig = appJson.expo || {};
const selectedAppId = process.env.APP_ID || appManifest.defaultAppId;
const selectedApp = appManifest.apps[selectedAppId] || appManifest.apps[appManifest.defaultAppId];
const routerRoot = process.env.EXPO_ROUTER_APP_ROOT || selectedApp.routerRoot;

module.exports = () => ({
  ...expoConfig,
  name: selectedApp.displayName,
  plugins: [
    ["expo-router", { root: routerRoot }],
  ],
});
