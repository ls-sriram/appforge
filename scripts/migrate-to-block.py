#!/usr/bin/env python3
"""
Migrate all Stack / Inline / Frame / Center / Inset / Surface usages to Block.

Run from repo root:
  python3 scripts/migrate-to-block.py [--dry-run]
"""

import re
import sys
from pathlib import Path

DRY_RUN = "--dry-run" in sys.argv
SRC = Path("src")
EXTENSIONS = {".tsx", ".ts"}

# ── Surface variant → Block paint ────────────────────────────────

SURFACE_PAINT_MAP = {
    # panel cards
    "panel":                  'paint="panel"',
    "panelMuted":             'paint="panel-muted"',
    "panelStrong":            'paint="panel-strong"',
    "panelSubtle":            'paint="panel-subtle"',
    "panelInverse":           'paint="panel-inverse"',
    "selected":               'paint="selected"',
    "neutral":                'paint="neutral"',
    "danger":                 'paint="danger"',
    # frame / bg
    "fill":                   'frame="fill" paint="page"',
    "page":                   'paint="page"',
    "transparent":            '',
    "auto":                   'paint="page"',
    "center":                 'frame="center"',
    # chips
    "chipSuccess":            'paint="chip-success"',
    "chipWarning":            'paint="chip-warning"',
    "chipDanger":             'paint="chip-danger"',
    "chipInfo":               'paint="chip-info"',
    # table
    "table":                  'paint="table"',
    "tableRow":               'paint="table-row"',
    "tableRowSelected":       'paint="table-row-selected"',
    # NOTE: former domain variants (icon-box, applied-row, stat-panel, cost-card,
    # application-card, application-card-applied, toolbar-control) have been removed
    # from PaintVariant. Each domain block component now owns its own surface
    # via a View + local StyleSheet. Do not re-add these to Block.
    "badge":                  'paint="chip-danger"',  # badge = error pill
}

DEPRECATED_IMPORTS = {"Stack", "Inline", "Frame", "Center", "Inset", "Surface", "SurfaceVariant"}

# ── Per-line replacements ─────────────────────────────────────────

def process_line(line: str) -> tuple[str, list[str]]:
    warnings = []
    original = line

    # ── Surface variant="..." ───────────────────────────────────
    # Match: variant="panel" or variant="panelMuted" etc.
    def replace_surface_variant(m):
        variant = m.group(1)
        props = SURFACE_PAINT_MAP.get(variant)
        if props is None:
            warnings.append(f"unknown Surface variant: {variant}")
            props = f'/* TODO variant={variant} */'
        return props

    # Replace variant="..." prop inside a Surface tag
    # We'll handle by finding Surface tags and replacing them
    if "<Surface" in line:
        if re.search(r'<Surface\s+variant=\{', line):
            # Dynamic variant — rename tag + prop key, leave value expression as-is
            warnings.append("dynamic Surface variant — verify paint values are valid PaintVariant")
            line = re.sub(r'\bvariant=(\{)', r'paint=\1', line)
            line = line.replace("<Surface", "<Block")
        else:
            # Static variant — full replacement
            line = re.sub(r'\bvariant="([^"]+)"', replace_surface_variant, line)
            line = re.sub(r'\s*style=\{\{\s*padding:\s*0\s*\}\}', '', line)
            line = line.replace("<Surface", "<Block")
    if "</Surface>" in line:
        line = line.replace("</Surface>", "</Block>")

    # ── Stack ────────────────────────────────────────────────────
    if "<Stack" in line or "</Stack>" in line:
        # direction="vertical" is the default for Block — remove it
        line = re.sub(r'\s*direction="vertical"', '', line)
        # direction="horizontal" stays
        line = line.replace("<Stack", "<Block")
        line = line.replace("</Stack>", "</Block>")

    # ── Inline → Block direction="horizontal" ───────────────────
    if "<Inline" in line or "</Inline>" in line:
        # Add direction="horizontal" after <Inline
        line = re.sub(r'<Inline(\s)', r'<Block direction="horizontal"\1', line)
        line = re.sub(r'<Inline(/?>)', r'<Block direction="horizontal"\1', line)
        line = line.replace("</Inline>", "</Block>")

    # ── Frame ────────────────────────────────────────────────────
    if "<Frame" in line or "</Frame>" in line:
        # fill prop → frame="fill"
        def replace_frame_tag(m):
            attrs = m.group(1)
            has_fill = bool(re.search(r'\bfill\b', attrs))
            attrs = re.sub(r'\s*\bfill(?:=\{true\})?\b', '', attrs)
            frame_prop = ' frame="fill"' if has_fill else ''
            return f"<Block{frame_prop}{attrs}"
        line = re.sub(r'<Frame([^>]*)', replace_frame_tag, line)
        line = line.replace("</Frame>", "</Block>")

    # ── Center ───────────────────────────────────────────────────
    if "<Center" in line or "</Center>" in line:
        def replace_center_tag(m):
            attrs = m.group(1)
            has_fill = bool(re.search(r'\bfill\b', attrs))
            attrs = re.sub(r'\s*\bfill(?:=\{true\})?\b', '', attrs)
            frame_prop = ' frame="fill"' if has_fill else ' frame="center"'
            return f"<Block{frame_prop}{attrs}"
        line = re.sub(r'<Center([^>]*)', replace_center_tag, line)
        line = line.replace("</Center>", "</Block>")

    # ── Inset ────────────────────────────────────────────────────
    if "<Inset" in line or "</Inset>" in line:
        def replace_inset_tag(m):
            attrs = m.group(1)
            all_m = re.search(r'\ball="([^"]+)"', attrs)
            h_m   = re.search(r'\bhorizontal="([^"]+)"', attrs)
            v_m   = re.search(r'\bvertical="([^"]+)"', attrs)
            # Remove inset-specific props
            remaining = re.sub(r'\s*\b(?:all|horizontal|vertical)="[^"]*"', '', attrs).rstrip()
            pads = []
            if all_m: pads.append(f'pad="{all_m.group(1)}"')
            if h_m:   pads.append(f'padH="{h_m.group(1)}"')
            if v_m:   pads.append(f'padV="{v_m.group(1)}"')
            pad_str = (' ' + ' '.join(pads)) if pads else ''
            return f"<Block{pad_str}{remaining}"
        line = re.sub(r'<Inset([^>]*)', replace_inset_tag, line)
        line = line.replace("</Inset>", "</Block>")

    # ── Imports ──────────────────────────────────────────────────
    prim_import = re.search(
        r'^import \{\s*([^}]+?)\s*\}\s*from\s*"([^"]*primitives[^"]*)"',
        line
    )
    if prim_import:
        import_path = prim_import.group(2)
        names = [n.strip() for n in prim_import.group(1).split(",")]
        removed = [n for n in names if n in DEPRECATED_IMPORTS]
        kept    = [n for n in names if n not in DEPRECATED_IMPORTS and n]
        if removed:
            layout_paint = {"Stack", "Inline", "Frame", "Center", "Inset", "Surface"}
            if any(r in layout_paint for r in removed) and "Block" not in kept:
                kept = ["Block"] + kept
            if kept:
                line = f'import {{ {", ".join(kept)} }} from "{import_path}"\n'
            else:
                line = ""

    return line, warnings


def migrate_file(path: Path) -> tuple[bool, list[str]]:
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    new_lines = []
    all_warnings = []

    for lineno, line in enumerate(lines, 1):
        new_line, warnings = process_line(line)
        new_lines.append(new_line)
        for w in warnings:
            all_warnings.append(f"  L{lineno}: {w}")

    new_text = "".join(new_lines)
    original = "".join(lines)

    if new_text == original:
        return False, []

    if not DRY_RUN:
        path.write_text(new_text, encoding="utf-8")

    return True, all_warnings


def main():
    changed = []
    errors  = []
    all_warnings = []

    for path in sorted(SRC.rglob("*")):
        if path.suffix not in EXTENSIONS:
            continue
        if path.name == "Block.tsx" or "migrate-to-block" in str(path):
            continue
        try:
            modified, warnings = migrate_file(path)
            if modified:
                changed.append(path)
                marker = " ⚠️" if warnings else ""
                print(f"  ✓ {path}{marker}")
                for w in warnings:
                    print(f"     {w}")
                    all_warnings.append(f"{path}{w}")
        except Exception as e:
            errors.append((path, e))
            print(f"  ✗ {path}: {e}")

    print(f"\n{'[DRY RUN] ' if DRY_RUN else ''}Changed {len(changed)} files, "
          f"{len(all_warnings)} warnings, {len(errors)} errors.")


if __name__ == "__main__":
    main()
