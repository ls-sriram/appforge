#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('../..', import.meta.url).pathname, '..');
const changesRoot = path.join(ROOT, 'governance', 'changes');

const argId = process.argv.find((a) => a.startsWith('--id='));
const changeId = argId ? argId.slice('--id='.length) : `CHG-${new Date().toISOString().slice(0, 10)}-${Date.now().toString().slice(-4)}`;

const changeDir = path.join(changesRoot, changeId);
fs.mkdirSync(changeDir, { recursive: true });

const patchPath = path.join(changeDir, 'patch.diff');
const changesJsonPath = path.join(changeDir, 'changes.json');

const diff = execSync('git diff --no-color --minimal -U1', { cwd: ROOT, encoding: 'utf8' });
fs.writeFileSync(patchPath, diff, 'utf8');

if (!fs.existsSync(changesJsonPath)) {
  const template = {
    summary: '',
    semantic: {
      affected_files: [],
      potentially_affected: [],
    },
    issues: [],
    file_issues: {},
    file_impact: {},
  };
  fs.writeFileSync(changesJsonPath, JSON.stringify(template, null, 2));
}

console.log(`Wrote: ${patchPath}`);
console.log(`Wrote: ${changesJsonPath}`);
