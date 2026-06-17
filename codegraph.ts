import { Project } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const root = process.cwd();

function normalize(file: string) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function classifyLayer(file: string): string {
  const p = file.toLowerCase();

  if (p.includes("/app/api/")) return "api";
  if (p.includes("/pages/api/")) return "api";

  if (p.includes("/server/")) return "server";
  if (p.includes("/services/")) return "service";
  if (p.includes("/repositories/")) return "repository";

  if (p.includes("/hooks/")) return "hook";

  if (p.includes("/screens/")) return "screen";
  if (p.includes("/pages/")) return "screen";

  if (p.includes("/components/")) return "component";

  if (p.includes("/firebase/")) return "firebase";

  if (p.includes("/lib/")) return "lib";

  return "unknown";
}

function classifyCapabilities(
  imports: string[],
  text: string
): string[] {
  const caps = new Set<string>();

  const lower = text.toLowerCase();

  const firestoreImport =
    imports.some(
      i =>
        i.includes("firebase/firestore") ||
        i.includes("@firebase/firestore") ||
        i.includes("firestore")
    );

  const firestoreApi =
    lower.includes("getfirestore(") ||
    lower.includes("collection(") ||
    lower.includes("doc(") ||
    lower.includes("query(") ||
    lower.includes("where(") ||
    lower.includes("onSnapshot(".toLowerCase());

  if (firestoreImport || firestoreApi) {
    caps.add("firestore");
  }

  if (
    lower.includes("fetch(") ||
    lower.includes("axios.") ||
    lower.includes("axios(")
  ) {
    caps.add("http");
  }

  if (
    imports.some(i => i.includes("stripe")) ||
    lower.includes("stripe.")
  ) {
    caps.add("stripe");
  }

  if (
    lower.includes("process.env") ||
    lower.includes("firebaseadmin") ||
    lower.includes("admin.firestore")
  ) {
    caps.add("backend");
  }

  return [...caps];
}

const nodes = new Map<
  string,
  {
    id: string;
    layer: string;
    capabilities: string[];
  }
>();

const edges: {
  source: string;
  target: string;
  type: string;
}[] = [];

for (const file of project.getSourceFiles()) {
  const filePath = normalize(file.getFilePath());

  if (filePath.includes("node_modules")) continue;
  if (filePath.endsWith(".d.ts")) continue;

  const imports = file.getImportDeclarations();

  const importNames = imports.map(i =>
    i.getModuleSpecifierValue()
  );

  const text = file.getFullText();

  nodes.set(filePath, {
    id: filePath,
    layer: classifyLayer(filePath),
    capabilities: classifyCapabilities(importNames, text),
  });

  for (const imp of imports) {
    const target = imp.getModuleSpecifierSourceFile();

    if (target) {
      edges.push({
        source: filePath,
        target: normalize(target.getFilePath()),
        type: "internal",
      });
    } else {
      edges.push({
        source: filePath,
        target: imp.getModuleSpecifierValue(),
        type: "external",
      });
    }
  }
}

const violations: any[] = [];

for (const edge of edges) {
  if (edge.type !== "internal") continue;

  const from = nodes.get(edge.source);
  const to = nodes.get(edge.target);

  if (!from || !to) continue;

  if (
    from.layer === "component" &&
    to.capabilities.includes("firestore")
  ) {
    violations.push({
      type: "component-direct-firestore",
      source: edge.source,
      target: edge.target,
    });
  }

  if (
    from.layer === "component" &&
    to.capabilities.includes("http")
  ) {
    violations.push({
      type: "component-direct-http",
      source: edge.source,
      target: edge.target,
    });
  }

  if (
    from.layer === "screen" &&
    to.capabilities.includes("firestore")
  ) {
    violations.push({
      type: "screen-direct-firestore",
      source: edge.source,
      target: edge.target,
    });
  }
}

const graph = {
  nodes: [...nodes.values()],
  edges,
};

fs.writeFileSync(
  "graph.json",
  JSON.stringify(graph, null, 2)
);

fs.writeFileSync(
  "violations.json",
  JSON.stringify(violations, null, 2)
);

const layerColors: Record<string, string> = {
  api: "lightblue",
  server: "lightblue",
  service: "lightgreen",
  repository: "gold",
  firebase: "orange",
  hook: "pink",
  screen: "gray",
  component: "white",
  lib: "lightyellow",
  unknown: "white",
};

const dot = `
digraph G {
rankdir=LR;
overlap=false;

node [
  shape=box
  style=filled
];

${[...nodes.values()]
  .map(
    n => `
"${n.id}" [
label="${path.basename(n.id)}\\n${n.layer}${
      n.capabilities.length
        ? "\\n" + n.capabilities.join(",")
        : ""
    }"
fillcolor="${layerColors[n.layer] || "white"}"
];
`
  )
  .join("\n")}

${edges
  .filter(e => e.type === "internal")
  .map(
    e => `
"${e.source}" -> "${e.target}";
`
  )
  .join("\n")}
}
`;

fs.writeFileSync("graph.dot", dot);

console.log(
  JSON.stringify(
    {
      files: nodes.size,
      internalEdges: edges.filter(
        e => e.type === "internal"
      ).length,
      violations: violations.length,
      outputs: [
        "graph.json",
        "graph.dot",
        "violations.json",
      ],
    },
    null,
    2
  )
);
