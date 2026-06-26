import {
  CLOSED_VALUE_PRIMITIVES,
  PLATFORM_SCAFFOLDS,
  SCAFFOLD_GAP_PRESETS,
  SCAFFOLD_KINDS,
  SCAFFOLD_PADDING_PRESETS,
  SCAFFOLD_SEPARATION_PRESETS,
  SCAFFOLD_SLOT_BEHAVIORS,
  SCAFFOLD_SLOT_PLACEMENTS,
} from "./contract";

describe("platform scaffold contract", () => {
  it("exports the expected scaffold enums", () => {
    expect(SCAFFOLD_KINDS).toEqual([
      "page",
      "header",
      "sidebar",
      "panel",
      "panelCollection",
    ]);
    expect(SCAFFOLD_SLOT_BEHAVIORS).toEqual(["flow", "sticky", "fixed"]);
    expect(SCAFFOLD_SLOT_PLACEMENTS).toEqual([
      "inline",
      "top",
      "bottom",
      "left",
      "right",
      "center",
      "leading",
      "trailing",
    ]);
    expect(SCAFFOLD_GAP_PRESETS).toEqual(["none", "tight", "default", "loose"]);
    expect(SCAFFOLD_PADDING_PRESETS).toEqual(["none", "sm", "md", "lg"]);
    expect(SCAFFOLD_SEPARATION_PRESETS).toEqual(["flush", "separated"]);
  });

  it("registers the expected scaffold presets", () => {
    expect(Object.keys(PLATFORM_SCAFFOLDS)).toEqual(SCAFFOLD_KINDS);
  });

  it("keeps preset placements and behaviors inside the finite contract", () => {
    const placementSet = new Set(SCAFFOLD_SLOT_PLACEMENTS);
    const behaviorSet = new Set(SCAFFOLD_SLOT_BEHAVIORS);

    for (const scaffold of Object.values(PLATFORM_SCAFFOLDS)) {
      for (const slot of scaffold.slots) {
        expect(placementSet.has(slot.placement)).toBe(true);
        expect(behaviorSet.has(slot.behavior)).toBe(true);
      }
    }
  });

  it("exposes preset action slots for header and panel scaffolds", () => {
    expect(PLATFORM_SCAFFOLDS.header.slots.map((slot) => slot.name)).toContain("actions");
    expect(PLATFORM_SCAFFOLDS.panel.slots.map((slot) => slot.name)).toContain("actions");
  });

  it("uses explicit left placement for page sidebars", () => {
    const sidebarSlot = PLATFORM_SCAFFOLDS.page.slots.find((slot) => slot.name === "sidebar");

    expect(sidebarSlot?.placement).toBe("left");
  });

  it("includes SizingToolbar in the closed primitive contract and export surface", () => {
    expect(CLOSED_VALUE_PRIMITIVES).toContain("SizingToolbar");
  });

  it("includes Tabs in the closed primitive contract", () => {
    expect(CLOSED_VALUE_PRIMITIVES).toContain("Tabs");
  });

  it("includes TabbedPanel in the closed primitive contract", () => {
    expect(CLOSED_VALUE_PRIMITIVES).toContain("TabbedPanel");
  });
});
