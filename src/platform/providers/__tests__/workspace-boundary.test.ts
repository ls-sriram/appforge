import fs from "fs";
import path from "path";

describe("workspace UI boundary", () => {
  it("does not export workspace state from @ui", () => {
    const uiBarrel = fs.readFileSync(
      path.join(__dirname, "../../ui/index.ts"),
      "utf8",
    );

    expect(uiBarrel).not.toContain("WorkspaceProvider");
    expect(uiBarrel).not.toContain("WorkspaceTabbedPanel");
    expect(uiBarrel).not.toContain("useWorkspace");
    expect(uiBarrel).not.toContain("WorkspaceState");
  });
});
