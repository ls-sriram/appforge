let DATA = null;
let ACTIVE = "architecture";
let FILTER = "";

const CATEGORIES = [
  { id: "architecture", icon: "◫", label: "Architecture" },
  // More categories (Screens, Design Tokens, UI Components, Service Calls,
  // Backend Routes, Features, Hooks, Providers, Core) land in a follow-up pass.
];

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function matches(str) {
  if (!FILTER) return true;
  return String(str).toLowerCase().includes(FILTER.toLowerCase());
}

async function fetchScan() {
  const res = await fetch("/api/scan");
  return res.json();
}

// ─── Sidebar ───────────────────────────────────────────────────────────

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = "";
  for (const cat of CATEGORIES) {
    const count = countFor(cat.id);
    const row = el("div", { class: "sidebar-group" + (cat.id === ACTIVE ? " active" : "") }, [
      el("span", { class: "label" }, [el("span", { class: "icon" }, cat.icon), cat.label]),
      count == null ? null : el("span", { class: "count" }, String(count)),
    ]);
    row.addEventListener("click", () => {
      ACTIVE = cat.id;
      render();
    });
    sidebar.appendChild(row);
  }
}

function countFor(catId) {
  if (!DATA) return null;
  if (catId === "architecture") {
    const v = DATA.architecture.violations.length;
    return v === 0 ? "clean" : `${v} issue${v === 1 ? "" : "s"}`;
  }
  return null;
}

// ─── Architecture rendering ─────────────────────────────────────────────

function layerBox(layer, opts = {}) {
  return el("div", { class: "layer-box" }, [
    el("div", { class: "layer-box-top" }, [
      el("span", { class: "layer-box-label" }, layer.label),
      layer.count != null ? el("span", { class: "layer-box-count" }, String(layer.count)) : null,
    ]),
    el("div", { class: "layer-box-path" }, layer.path),
    el("div", { class: "layer-box-rule" }, layer.rule),
  ]);
}

function renderLayerStack(title, subtitle, layers) {
  const wrap = el("div", { class: "stack-wrap" }, [
    el("h3", { class: "stack-title" }, title),
    el("p", { class: "stack-subtitle" }, subtitle),
  ]);
  const stack = el("div", { class: "layer-stack" });
  layers.forEach((layer, i) => {
    stack.appendChild(layerBox(layer));
    if (i < layers.length - 1) {
      stack.appendChild(el("div", { class: "layer-arrow" }, "↓ allowed"));
    }
  });
  wrap.appendChild(stack);
  return wrap;
}

function renderProhibitedEdges(edges) {
  const wrap = el("div", { class: "prohibited-wrap" }, [el("h4", { class: "prohibited-title" }, "Prohibited skips (never allowed)")]);
  for (const e of edges) {
    wrap.appendChild(
      el("div", { class: "prohibited-row" }, [
        el("span", { class: "prohibited-edge" }, `${e.from} ⇥ ${e.to}`),
        el("span", { class: "prohibited-reason" }, e.reason),
      ]),
    );
  }
  return wrap;
}

function renderFeatureMatrix(matrix) {
  const layerIds = ["view", "viewmodel", "usecase", "repository", "datasource", "runtime"];
  const layerLabels = {
    view: "View",
    viewmodel: "ViewModel",
    usecase: "UseCase",
    repository: "Repository",
    datasource: "DataSource",
    runtime: "Runtime",
  };

  const rows = matrix.filter((f) => matches(f.name));

  const table = el("table", { class: "matrix-table" });
  table.appendChild(
    el(
      "tr",
      {},
      [el("th", {}, "Feature")].concat(layerIds.map((id) => el("th", { class: "matrix-col-head" }, layerLabels[id]))),
    ),
  );
  for (const f of rows) {
    table.appendChild(
      el(
        "tr",
        {},
        [el("td", { class: "mono" }, f.name)].concat(
          layerIds.map((id) =>
            el("td", { class: "matrix-cell" }, f.layers[id] ? el("span", { class: "matrix-dot present" }, "●") : el("span", { class: "matrix-dot" }, "○")),
          ),
        ),
      ),
    );
  }
  return el("div", { class: "table-scroll" }, [table]);
}

function renderViolations(violations) {
  if (!violations.length) {
    return el("div", { class: "violations-clean" }, [
      el("span", { class: "violations-clean-icon" }, "✓"),
      el("span", {}, "No boundary violations detected — matches a clean `npm run lint:arch` for MVVM layering rules."),
    ]);
  }
  const wrap = el("div", { class: "violations-list" });
  for (const v of violations.filter((v) => matches(v.file) || matches(v.edge) || matches(v.message))) {
    wrap.appendChild(
      el("div", { class: "violation-row" }, [
        el("div", { class: "violation-edge" }, v.edge),
        el("div", { class: "violation-file mono" }, v.file),
        el("div", { class: "violation-message" }, v.message),
      ]),
    );
  }
  return wrap;
}

function renderArchitecture(container) {
  const a = DATA.architecture;

  container.appendChild(
    el("section", { class: "category-section" }, [
      el("div", { class: "category-header static" }, [
        el("div", { class: "title-wrap" }, [
          el("span", { class: "icon" }, "◫"),
          el("div", {}, [
            el("h2", {}, "UI Composition Layers"),
            el("p", { class: "subtitle" }, "docs/ui-layer-boundary.md — lower layers must not import from higher layers"),
          ]),
        ]),
      ]),
      el("div", { class: "category-body always-open" }, [renderLayerStack("", "", a.uiCompositionLayers)]),
    ]),
  );

  container.appendChild(
    el("section", { class: "category-section" }, [
      el("div", { class: "category-header static" }, [
        el("div", { class: "title-wrap" }, [
          el("span", { class: "icon" }, "◫"),
          el("div", {}, [
            el("h2", {}, "MVVM Data-Flow Layers"),
            el("p", { class: "subtitle" }, "docs/mvvm-architecture-contract.md — View → ViewModel → UseCase → Repository → DataSource → Backend"),
          ]),
        ]),
      ]),
      el("div", { class: "category-body always-open" }, [
        renderLayerStack("", "", a.mvvmLayers),
        renderProhibitedEdges(a.prohibitedEdges),
      ]),
    ]),
  );

  container.appendChild(
    el("section", { class: "category-section" }, [
      el("div", { class: "category-header static" }, [
        el("div", { class: "title-wrap" }, [
          el("span", { class: "icon" }, "▦"),
          el("div", {}, [
            el("h2", {}, "Per-feature layer presence"),
            el("p", { class: "subtitle" }, "Which MVVM layers each src/features/* slice actually has. \"Minimum viable layering\" means missing layers are expected for simple features."),
          ]),
        ]),
      ]),
      el("div", { class: "category-body always-open" }, [renderFeatureMatrix(a.featureLayerMatrix)]),
    ]),
  );

  container.appendChild(
    el("section", { class: "category-section" }, [
      el("div", { class: "category-header static" }, [
        el("div", { class: "title-wrap" }, [
          el("span", { class: "icon" }, a.violations.length ? "⚠" : "✓"),
          el("div", {}, [
            el("h2", {}, "Boundary violations"),
            el("p", { class: "subtitle" }, "Re-derived from scripts/check-layer-boundaries.js — read-only, same rules as `npm run lint:arch`."),
          ]),
        ]),
      ]),
      el("div", { class: "category-body always-open" }, [renderViolations(a.violations)]),
    ]),
  );
}

// ─── Render dispatch ─────────────────────────────────────────────────

function render() {
  renderSidebar();
  const content = document.getElementById("content");
  content.innerHTML = "";

  if (!DATA) {
    content.appendChild(el("div", { class: "empty-state" }, "Scanning…"));
    return;
  }

  document.getElementById("generatedAt").textContent = "Scanned " + new Date(DATA.generatedAt).toLocaleTimeString();

  if (ACTIVE === "architecture") renderArchitecture(content);
}

async function init() {
  render();
  DATA = await fetchScan();
  render();

  document.getElementById("rescan").addEventListener("click", async () => {
    DATA = null;
    render();
    DATA = await fetchScan();
    render();
  });

  const search = document.getElementById("search");
  search.addEventListener("input", (e) => {
    FILTER = e.target.value;
    render();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== search) {
      e.preventDefault();
      search.focus();
    }
  });
}

init();
