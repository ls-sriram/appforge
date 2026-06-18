/**
 * save-server.mjs
 *
 * Tiny local HTTP server for the AppForge visualizer's Save action.
 * Receives { sourcePath, content } and writes the file to disk.
 *
 * Usage: node scripts/save-server.mjs
 * Runs on port 8089 by default (set SAVE_PORT env var to override).
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.SAVE_PORT ?? 8089);

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function json(res, status, body) {
  cors(res);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  cors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    return json(res, 200, { ok: true });
  }

  if (req.method === "POST" && req.url === "/api/save") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      let parsed;
      try { parsed = JSON.parse(body); } catch {
        return json(res, 400, { error: "Invalid JSON" });
      }

      const { sourcePath, content } = parsed;
      if (!sourcePath || typeof content !== "string") {
        return json(res, 400, { error: "Missing sourcePath or content" });
      }

      // Safety: only allow writes inside the repo
      const absPath = path.resolve(ROOT, sourcePath);
      if (!absPath.startsWith(ROOT + path.sep) && absPath !== ROOT) {
        return json(res, 403, { error: "Path escapes repository" });
      }

      try {
        fs.mkdirSync(path.dirname(absPath), { recursive: true });
        fs.writeFileSync(absPath, content, "utf-8");
        console.log(`[save] wrote ${sourcePath}`);
        return json(res, 200, { ok: true, path: sourcePath });
      } catch (e) {
        console.error(`[save] error writing ${sourcePath}:`, e.message);
        return json(res, 500, { error: String(e.message) });
      }
    });
    return;
  }

  json(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`[save-server] http://localhost:${PORT} (repo: ${ROOT})`);
});
