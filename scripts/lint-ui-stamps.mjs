import path from "node:path";
import { Project, SyntaxKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: path.resolve("tsconfig.json"),
  skipAddingFilesFromTsConfig: true,
});

const UI_MODULE_RE = /(?:^@ui$|platform\/ui\/index$)/;
const errors = [];

const sourceFiles = project.addSourceFilesAtPaths("src/**/*.{ts,tsx}")
  .filter((sourceFile) => {
    return sourceFile.getImportDeclarations().some((decl) => {
      const specifier = decl.getModuleSpecifierValue();
      if (!UI_MODULE_RE.test(specifier)) return false;
      return decl.getNamedImports().some((namedImport) => {
        const name = namedImport.getName();
        const alias = namedImport.getAliasNode()?.getText();
        return name === "UiStamp" || name === "noopUi" || name === "createUi"
          || alias === "UiStamp" || alias === "noopUi" || alias === "createUi";
      });
    });
  });

for (const sourceFile of sourceFiles) {
  const uiPrimitives = new Set();

  for (const decl of sourceFile.getImportDeclarations()) {
    const specifier = decl.getModuleSpecifierValue();
    if (!UI_MODULE_RE.test(specifier)) continue;
    for (const namedImport of decl.getNamedImports()) {
      if (namedImport.isTypeOnly()) continue;
      uiPrimitives.add(namedImport.getAliasNode()?.getText() ?? namedImport.getName());
    }
  }

  sourceFile.forEachDescendant((node) => {
    if (node.getKind() === SyntaxKind.CallExpression) {
      const call = node.asKindOrThrow(SyntaxKind.CallExpression);
      if (call.getExpression().getText() !== "ui") return;
      const args = call.getArguments();
      if (
        args.length === 2 &&
        (args[1].getKind() === SyntaxKind.JsxElement || args[1].getKind() === SyntaxKind.JsxSelfClosingElement)
      ) {
        errors.push(
          `${sourceFile.getFilePath()}:${call.getStartLineNumber()} old ui(id, <Element />) wrapper form is not allowed; use {...ui("id")} on the JSX element instead.`,
        );
      }
      return;
    }

    if (node.getKind() !== SyntaxKind.JsxSelfClosingElement && node.getKind() !== SyntaxKind.JsxOpeningElement) {
      return;
    }

    const opening = node;
    const tagName = opening.getTagNameNode().getText();
    if (!uiPrimitives.has(tagName)) return;

    const hasUiStamp = opening.getAttributes().some((attr) => {
      if (attr.getKind() !== SyntaxKind.JsxSpreadAttribute) return false;
      const expr = attr.getExpression();
      if (!expr || expr.getKind() !== SyntaxKind.CallExpression) return false;
      const call = expr.asKindOrThrow(SyntaxKind.CallExpression);
      if (call.getExpression().getText() !== "ui") return false;
      return call.getArguments().length === 1;
    });

    if (!hasUiStamp) {
      errors.push(
        `${sourceFile.getFilePath()}:${opening.getStartLineNumber()} <${tagName}> is missing an explicit {...ui("id")} stamp.`,
      );
    }
  });
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`UI stamp lint passed for ${sourceFiles.length} files.`);
