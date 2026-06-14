# Governance UI (Standalone)

Small local tool for reviewing one change at a time from filesystem artifacts.

## What it does

- Queue view for `governance/changes/CHG-*`
- Focus mode side-by-side diff per file
- Shows simple review context from diff only
- Inline comments saved to filesystem
- Decision actions: `approved` or `needs-rerun`
- Saves consolidated review state to one file: `review.json`

## Run

```bash
node tools/governance-ui/server.mjs
```

Open: `http://localhost:4311`

Optional port:

```bash
GOV_UI_PORT=4500 node tools/governance-ui/server.mjs
```

## Where agents should write change input

For each generated change, write:

- `governance/changes/<CHANGE_ID>/patch.diff`
- `governance/changes/<CHANGE_ID>/changes.json`

Example:

- `governance/changes/CHG-2026-05-27-001/patch.diff`

`<CHANGE_ID>` can be any stable unique folder id (for example: `CHG-YYYY-MM-DD-###`).

## Generate compact diff from git

Do not token-generate diffs manually. Generate `patch.diff` directly from git:

```bash
node tools/governance-ui/scripts/generate-change-input.mjs --id=CHG-2026-05-27-001
```

This writes:

- `governance/changes/CHG-2026-05-27-001/patch.diff` from `git diff --no-color --minimal -U1`
- `governance/changes/CHG-2026-05-27-001/changes.json` template (if missing)

## Contract (minimal)

Input:

- `patch.diff` (agent-generated diff)
- `changes.json` (agent-generated summary/issues/context)

Output:

- `review.json` (UI-generated, single consolidated review output)

## Notes

- This tool is intentionally generic and does not trigger any agent loop.
- It only reads/writes local JSON/diff files.
- `governance/changes/**` is git-ignored and should not be pushed.
