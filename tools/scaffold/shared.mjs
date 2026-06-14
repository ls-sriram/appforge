import fs from "node:fs";
import path from "node:path";

export const ROOT = process.cwd();

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeIfMissing(file, content, dryRun = false) {
  if (fs.existsSync(file)) return { created: false, skipped: true };
  if (dryRun) return { created: true, skipped: false };
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
  return { created: true, skipped: false };
}

export function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, "/");
}

export function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function pascal(value) {
  return value
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

export function camel(value) {
  const words = value
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase());
  if (words.length === 0) return "";
  return words[0] + words.slice(1).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
}

export function title(value) {
  return value
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function readTemplate(templateRoot, name) {
  return fs.readFileSync(path.join(templateRoot, name), "utf8");
}

export function renderTemplate(templateRoot, name, values) {
  const raw = readTemplate(templateRoot, name);
  return raw.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => values[key] ?? "");
}
