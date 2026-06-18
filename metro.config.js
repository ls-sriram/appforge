const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Swap the UI barrel for visualizer-aware wrappers when bundling appforge-site.
// Layout files keep static `import { YStack } from 'src/ui'` and the resolver
// redirects those imports to src/ui/visualizer/index.ts, which wraps each
// primitive with VisualizerContext support (click-to-select + prop overrides).
//
// The wrapped components check ctx.active and fall back to real rendering
// when no VisualizerProvider is mounted — so the swap is safe for the whole
// bundle; only components inside <VisualizerProvider active> are intercepted.
const IS_VISUALIZER = process.env.APP_ID === "appforge-site" ||
                      process.env.VISUALIZER_BUILD === "1";

if (IS_VISUALIZER) {
  const uiReal   = path.resolve(__dirname, "src/ui/index.ts");
  const uiViz    = path.resolve(__dirname, "src/ui/visualizer/index.ts");
  const uiVizDir = path.resolve(__dirname, "src/ui/visualizer");

  config.resolver = config.resolver ?? {};
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    const resolved = context.resolveRequest(context, moduleName, platform);
    // Don't alias imports that originate from within the visualizer barrel
    // itself — that would create a circular dependency.
    const fromVizDir = context.originModulePath.startsWith(uiVizDir + path.sep) ||
                       context.originModulePath === uiViz;
    if (!fromVizDir && resolved?.type === "sourceFile" && resolved.filePath === uiReal) {
      return { type: "sourceFile", filePath: uiViz };
    }
    return resolved;
  };
}

module.exports = config;
