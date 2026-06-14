import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '../..');
const GOVERNANCE_ROOT = path.join(ROOT, 'governance');
const CHANGES_ROOT = path.join(GOVERNANCE_ROOT, 'changes');
const PUBLIC_ROOT = path.join(__dirname, 'public');
const PORT = Number(process.env.GOV_UI_PORT || 4311);

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

function sendText(res, status, text, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(text);
}

function safeJoin(root, candidate) {
  const normalized = path.normalize(candidate).replace(/^\/+/, '');
  const fullPath = path.resolve(root, normalized);
  if (!fullPath.startsWith(root)) {
    throw new Error('Invalid path');
  }
  return fullPath;
}

function parseDiffByFile(diffText) {
  const lines = diffText.split('\n');
  const files = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith('diff --git ')) {
      if (current) files.push(current);
      current = { file: '', lines: [] };
      continue;
    }

    if (!current) continue;

    if (line.startsWith('+++ b/')) {
      current.file = line.slice(6).trim();
      continue;
    }

    if (line.startsWith('--- a/')) {
      continue;
    }

    if (line.startsWith('index ') || line.startsWith('@@')) {
      continue;
    }

    current.lines.push(line);
  }

  if (current) files.push(current);
  return files.filter((f) => f.file);
}

async function ensureChangeDefaults(changeId) {
  const changeDir = safeJoin(CHANGES_ROOT, changeId);
  const defaults = [
    ['comments.json', { comments: [] }],
    ['decision.json', { status: 'pending', updatedAt: new Date().toISOString() }],
  ];

  await Promise.all(
    defaults.map(async ([file, content]) => {
      const filePath = path.join(changeDir, file);
      try {
        await fs.access(filePath);
      } catch {
        await fs.writeFile(filePath, JSON.stringify(content, null, 2));
      }
    }),
  );
}

async function readJsonIfExists(filePath, fallback) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/changes') {
    await fs.mkdir(CHANGES_ROOT, { recursive: true });
    const entries = await fs.readdir(CHANGES_ROOT, { withFileTypes: true });

    const items = await Promise.all(
      entries
        .filter((e) => e.isDirectory())
        .map(async (entry) => {
          const changeId = entry.name;
          const decision = await readJsonIfExists(
            path.join(CHANGES_ROOT, changeId, 'decision.json'),
            { status: 'pending' },
          );
          return { change_id: changeId, status: decision.status || 'pending' };
        }),
    );

    items.sort((a, b) => b.change_id.localeCompare(a.change_id));
    return sendJson(res, 200, { changes: items });
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/changes/')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const changeId = parts[2];
    if (!changeId) return sendJson(res, 400, { error: 'Missing change id' });
    if (parts[3] === 'file') {
      const relativePath = url.searchParams.get('path') || '';
      const filePath = safeJoin(ROOT, relativePath);
      const content = await fs.readFile(filePath, 'utf8').catch(() => null);
      if (content == null) return sendJson(res, 404, { error: 'File not found' });
      return sendJson(res, 200, { path: relativePath, content });
    }

    const changeDir = safeJoin(CHANGES_ROOT, changeId);
    await ensureChangeDefaults(changeId);

    const patchPath = path.join(changeDir, 'patch.diff');
    const patchText = await fs.readFile(patchPath, 'utf8').catch(() => '');
    const parsedFiles = parseDiffByFile(patchText);
    const fileNames = parsedFiles.map((f) => f.file);

    const changesData = await readJsonIfExists(path.join(changeDir, 'changes.json'), {});
    const semantic = {
      affected_files: Array.isArray(changesData?.semantic?.affected_files)
        ? changesData.semantic.affected_files
        : fileNames,
      potentially_affected: Array.isArray(changesData?.semantic?.potentially_affected)
        ? changesData.semantic.potentially_affected
        : [],
    };
    const issues = {
      issues: Array.isArray(changesData?.issues) ? changesData.issues : [],
    };

    const comments = await readJsonIfExists(path.join(changeDir, 'comments.json'), { comments: [] });
    const decision = await readJsonIfExists(path.join(changeDir, 'decision.json'), {
      status: 'pending',
      updatedAt: new Date().toISOString(),
    });
    const rerun = await readJsonIfExists(path.join(changeDir, 'rerun.json'), null);
    const review = await readJsonIfExists(path.join(changeDir, 'review.json'), null);

    return sendJson(res, 200, {
      change_id: changeId,
      files: parsedFiles,
      semantic,
      issues,
      comments,
      decision,
      rerun,
      review,
      agent: {
        summary: changesData?.summary || null,
        file_issues: changesData?.file_issues || {},
        file_impact: changesData?.file_impact || {},
      },
    });
  }

  if (req.method === 'POST' && url.pathname.endsWith('/comments')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const changeId = parts[2];
    if (!changeId) return sendJson(res, 400, { error: 'Missing change id' });

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));

    const changeDir = safeJoin(CHANGES_ROOT, changeId);
    await ensureChangeDefaults(changeId);

    const commentsPath = path.join(changeDir, 'comments.json');
    const commentsData = await readJsonIfExists(commentsPath, { comments: [] });

    commentsData.comments.push({
      id: `c_${Date.now()}`,
      createdAt: new Date().toISOString(),
      file: body.file || null,
      line: Number.isInteger(body.line) ? body.line : null,
      concept: body.concept || null,
      text: body.text || '',
    });

    await fs.writeFile(commentsPath, JSON.stringify(commentsData, null, 2));
    return sendJson(res, 200, { ok: true, comments: commentsData.comments });
  }

  if (req.method === 'POST' && url.pathname.endsWith('/decision')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const changeId = parts[2];
    if (!changeId) return sendJson(res, 400, { error: 'Missing change id' });

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));

    const allowed = new Set(['pending', 'approved', 'needs-rerun', 'rejected']);
    if (!allowed.has(body.status)) {
      return sendJson(res, 400, { error: 'Invalid status' });
    }

    const flaggedFiles = Array.isArray(body.flagged_files) ? body.flagged_files : [];
    const instructions = Array.isArray(body.instructions) ? body.instructions : [];
    const constraints = Array.isArray(body.constraints) ? body.constraints : [];

    const decision = {
      status: body.status,
      note: body.note || null,
      flagged_files: flaggedFiles,
      updatedAt: new Date().toISOString(),
    };

    const changeDir = safeJoin(CHANGES_ROOT, changeId);
    await fs.writeFile(path.join(changeDir, 'decision.json'), JSON.stringify(decision, null, 2));

    if (body.status === 'needs-rerun') {
      const rerun = {
        change_id: changeId,
        requestedAt: new Date().toISOString(),
        reason: body.note || null,
        instructions,
        constraints,
        flagged_files: flaggedFiles,
        status: 'queued',
      };
      await fs.writeFile(path.join(changeDir, 'rerun.json'), JSON.stringify(rerun, null, 2));
    }

    return sendJson(res, 200, { ok: true, decision });
  }

  if (req.method === 'POST' && url.pathname.endsWith('/review')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const changeId = parts[2];
    if (!changeId) return sendJson(res, 400, { error: 'Missing change id' });

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const changeDir = safeJoin(CHANGES_ROOT, changeId);

    const review = {
      savedAt: body.savedAt || new Date().toISOString(),
      mode: body.mode || null,
      decision: body.decision || null,
      flagged: body.flagged || {},
    };
    await fs.writeFile(path.join(changeDir, 'review.json'), JSON.stringify(review, null, 2));
    return sendJson(res, 200, { ok: true, review });
  }

  if (req.method === 'POST' && url.pathname.endsWith('/rerun')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const changeId = parts[2];
    if (!changeId) return sendJson(res, 400, { error: 'Missing change id' });

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));

    const rerun = {
      change_id: changeId,
      requestedAt: new Date().toISOString(),
      reason: body.reason || null,
      instructions: Array.isArray(body.instructions) ? body.instructions : [],
      constraints: Array.isArray(body.constraints) ? body.constraints : [],
      status: 'queued',
    };

    const changeDir = safeJoin(CHANGES_ROOT, changeId);
    await fs.writeFile(path.join(changeDir, 'rerun.json'), JSON.stringify(rerun, null, 2));

    const decision = {
      status: 'needs-rerun',
      note: body.reason || null,
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(path.join(changeDir, 'decision.json'), JSON.stringify(decision, null, 2));

    return sendJson(res, 200, { ok: true, rerun, decision });
  }

  return false;
}

async function serveStatic(req, res, url) {
  const filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  const fullPath = safeJoin(PUBLIC_ROOT, filePath);

  let content;
  try {
    content = await fs.readFile(fullPath);
  } catch {
    sendText(res, 404, 'Not found');
    return;
  }

  const ext = path.extname(fullPath);
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
  };

  sendText(res, 200, content, contentTypes[ext] || 'application/octet-stream');
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  try {
    if (url.pathname.startsWith('/api/')) {
      const handled = await handleApi(req, res, url);
      if (!handled && !res.writableEnded) sendJson(res, 404, { error: 'Not found' });
      return;
    }

    await serveStatic(req, res, url);
  } catch (error) {
    if (!res.writableEnded) {
      sendJson(res, 500, { error: error.message || 'Server error' });
    }
  }
});

server.listen(PORT, () => {
  console.log(`Governance UI running at http://localhost:${PORT}`);
  console.log(`Reading changes from: ${CHANGES_ROOT}`);
});
