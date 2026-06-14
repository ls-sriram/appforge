import path from "node:path";
import { ROOT, camel, pascal, rel, renderTemplate, writeIfMissing } from "./shared.mjs";

const TEMPLATE_ROOT = path.join(ROOT, "tools", "scaffold", "templates", "building-blocks");

export function scaffoldFeature({
  app,
  feature,
  route = "",
  param = "id",
  dryRun = false,
}) {
  if (!app || !feature) {
    throw new Error("feature scaffolding requires --app and --feature.");
  }

  const appRoot = path.join(ROOT, "src", "apps", app);
  const featureRoot = path.join(appRoot, "features", feature);
  const routeName = route.trim().replace(/^\/+|\/+$/g, "");
  const routeParam = param.trim() || "id";
  const values = {
    APP: app,
    FEATURE: feature,
    PASCAL_FEATURE: pascal(feature),
    LABEL: pascal(feature),
    CAMEL_FEATURE: camel(feature),
  };

  const files = [
    [path.join(featureRoot, `${feature}.model.ts`), renderTemplate(TEMPLATE_ROOT, "feature-domain-model.ts.tmpl", values)],
    [path.join(featureRoot, `${feature}.hook.ts`), renderTemplate(TEMPLATE_ROOT, "feature-hook.ts.tmpl", values)],
    [path.join(featureRoot, `${feature}.viewmodel.ts`), renderTemplate(TEMPLATE_ROOT, "feature-viewmodel.ts.tmpl", values)],
    [path.join(featureRoot, `${feature}.workspace.tsx`), renderTemplate(TEMPLATE_ROOT, "feature-workspace.tsx.tmpl", values)],
    [path.join(featureRoot, `${feature}.view.tsx`), renderTemplate(TEMPLATE_ROOT, "feature-view.tsx.tmpl", values)],
    [path.join(featureRoot, `${feature}-content.layout.tsx`), renderTemplate(TEMPLATE_ROOT, "feature-content.layout.tsx.tmpl", values)],
  ];

  if (routeName) {
    const routeRoot = path.join(ROOT, "app", app, routeName);
    const routeValues = {
      ...values,
      ROUTE: routeName,
      PARAM: routeParam,
      FEATURE_SCREEN_IMPORT: `../../../src/apps/${app}/features/${feature}/${feature}.workspace`,
      DETAIL_SCREEN_IMPORT: `../../../src/apps/${app}/features/${feature}/${feature}.workspace`,
      PASCAL_SCREEN: pascal(feature),
    };
    files.push(
      [path.join(routeRoot, "index.tsx"), renderTemplate(TEMPLATE_ROOT, "app-route-index.tsx.tmpl", routeValues)],
      [path.join(routeRoot, `[${routeParam}].tsx`), renderTemplate(TEMPLATE_ROOT, "app-route-dynamic.tsx.tmpl", routeValues)],
    );
  }

  const created = [];
  const skipped = [];
  for (const [file, content] of files) {
    const result = writeIfMissing(file, content, dryRun);
    if (result.created && !result.skipped) created.push(rel(file));
    if (result.skipped) skipped.push(rel(file));
  }

  return {
    mode: dryRun ? "dry-run" : "write",
    app,
    feature,
    created,
    skipped,
  };
}
