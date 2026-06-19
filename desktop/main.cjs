const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const STATE_FILE = "desktop-state.json";

function getRendererIndexPath() {
  return path.join(getRendererRootDir(), "index.html");
}

function getRendererRootDir() {
  if (app.isPackaged) {
    return path.join(app.getAppPath(), "renderer");
  }

  return process.env.DESKTOP_RENDERER_DIR || path.join(process.cwd(), "dist-desktop", "web");
}

function getPreloadPath() {
  return path.join(__dirname, "preload.cjs");
}

function getDesktopStatePath() {
  return path.join(app.getPath("userData"), STATE_FILE);
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".ttf":
      return "font/ttf";
    case ".otf":
      return "font/otf";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}

function resolveRequestPath(rendererRootDir, urlPathname) {
  const decodedPath = decodeURIComponent(urlPathname.split("?")[0]);
  const trimmed = decodedPath.replace(/^\/+/, "");
  const candidates = [];

  if (trimmed.length === 0) {
    candidates.push("index.html");
  } else {
    candidates.push(trimmed);
    candidates.push(`${trimmed}.html`);
    candidates.push(path.join(trimmed, "index.html"));
  }

  for (const candidate of candidates) {
    const absolutePath = path.resolve(rendererRootDir, candidate);
    const relativePath = path.relative(rendererRootDir, absolutePath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      continue;
    }

    if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
      return absolutePath;
    }
  }

  return path.join(rendererRootDir, "index.html");
}

function startRendererServer() {
  const rendererRootDir = getRendererRootDir();

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const requestPath = req.url || "/";
      const filePath = resolveRequestPath(rendererRootDir, requestPath);

      fs.readFile(filePath, (error, buffer) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Failed to load desktop bundle.");
          return;
        }

        res.writeHead(200, { "Content-Type": getContentType(filePath) });
        res.end(buffer);
      });
    });

    server.on("error", reject);
    server.listen(0, "localhost", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Failed to start desktop renderer server."));
        return;
      }

      resolve({
        server,
        url: `http://localhost:${address.port}/`,
      });
    });
  });
}

function validateRepoPath(repoPath) {
  if (!repoPath || typeof repoPath !== "string") return false;

  const requiredPaths = [
    path.join(repoPath, "config", "app-manifest.json"),
    path.join(repoPath, "src", "ui", "index.ts"),
    path.join(repoPath, "package.json"),
  ];

  if (!requiredPaths.every((candidate) => fs.existsSync(candidate))) {
    return false;
  }

  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(repoPath, "package.json"), "utf8"),
    );
    return pkg && pkg.name === "appforge";
  } catch {
    return false;
  }
}

function getRepoName(repoPath) {
  if (!repoPath) return null;
  return path.basename(repoPath);
}

function loadDesktopState() {
  const statePath = getDesktopStatePath();
  if (!fs.existsSync(statePath)) {
    return {
      repoPath: null,
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(statePath, "utf8"));
    return {
      repoPath: typeof parsed.repoPath === "string" ? parsed.repoPath : null,
    };
  } catch {
    return {
      repoPath: null,
    };
  }
}

function saveDesktopState(nextState) {
  fs.mkdirSync(path.dirname(getDesktopStatePath()), { recursive: true });
  fs.writeFileSync(
    getDesktopStatePath(),
    JSON.stringify({ repoPath: nextState.repoPath ?? null }, null, 2),
    "utf8",
  );
}

function getPublicDesktopState() {
  const repoPath = desktopState.repoPath;
  return {
    repoPath,
    repoName: repoPath ? getRepoName(repoPath) : null,
    repoValid: validateRepoPath(repoPath),
  };
}

function broadcastDesktopState() {
  const state = getPublicDesktopState();
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send("appforge-desktop:state-changed", state);
  }
}

async function promptForRepoSource(parentWindow) {
  while (true) {
    const result = await dialog.showOpenDialog(parentWindow ?? undefined, {
      title: "Select an AppForge repository",
      buttonLabel: "Use This Repo",
      properties: ["openDirectory"],
      message: "Choose the AppForge repository this desktop bundle should edit.",
    });

    if (result.canceled || result.filePaths.length === 0) {
      return getPublicDesktopState();
    }

    const selectedPath = result.filePaths[0];
    if (validateRepoPath(selectedPath)) {
      desktopState = { repoPath: selectedPath };
      saveDesktopState(desktopState);
      broadcastDesktopState();
      return getPublicDesktopState();
    }

    await dialog.showMessageBox(parentWindow ?? undefined, {
      type: "error",
      message: "That folder is not a valid AppForge repository.",
      detail:
        "Expected to find config/app-manifest.json, src/ui/index.ts, and a package.json with name \"appforge\".",
      buttons: ["Choose Another Folder"],
      defaultId: 0,
    });
  }
}

function resolveWritePath(repoPath, sourcePath) {
  const absolutePath = path.resolve(repoPath, sourcePath);
  const relativePath = path.relative(repoPath, absolutePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Path escapes selected repository.");
  }

  return absolutePath;
}

async function createMainWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 760,
    autoHideMenuBar: true,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#0b0d12",
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith("file://")) {
      return;
    }

    event.preventDefault();
    shell.openExternal(url);
  });

  const { server, url } = await startRendererServer();
  win.on("closed", () => {
    server.close();
  });

  await win.loadURL(url);

  if (!validateRepoPath(desktopState.repoPath)) {
    await promptForRepoSource(win);
  } else {
    broadcastDesktopState();
  }
}

let desktopState = { repoPath: null };

ipcMain.handle("appforge-desktop:get-state", async () => getPublicDesktopState());

ipcMain.handle("appforge-desktop:list-apps", async () => {
  const repoPath = desktopState.repoPath;
  if (!validateRepoPath(repoPath)) return [];
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(repoPath, "config", "app-manifest.json"), "utf8"),
    );
    return Object.values(manifest.apps ?? {}).map((a) => ({
      id: a.appId,
      displayName: a.displayName ?? a.appId,
    }));
  } catch {
    // Fallback: scan src/apps/ directory names
    const appsDir = path.join(repoPath, "src", "apps");
    if (!fs.existsSync(appsDir)) return [];
    return fs.readdirSync(appsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => ({
        id: e.name,
        displayName: e.name.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
      }));
  }
});

ipcMain.handle("appforge-desktop:scan-app", async (_event, payload) => {
  const repoPath = desktopState.repoPath;
  if (!validateRepoPath(repoPath)) throw new Error("No valid AppForge repository selected.");
  const appId = payload && typeof payload.appId === "string" ? payload.appId : null;
  if (!appId) throw new Error("Missing appId.");

  const result = spawnSync("node", [
    path.join(repoPath, "scripts", "scan-ui-documents.mjs"),
    appId,
    "--stdout",
  ], { cwd: repoPath, encoding: "utf8", timeout: 30_000 });

  if (result.status !== 0 || result.error) {
    throw new Error(`Scanner failed for "${appId}": ${result.stderr || result.error?.message || "unknown error"}`);
  }

  return JSON.parse(result.stdout);
});

ipcMain.handle("appforge-desktop:select-repo-source", async (event) =>
  promptForRepoSource(BrowserWindow.fromWebContents(event.sender) ?? undefined),
);

ipcMain.handle("appforge-desktop:save-file", async (_event, payload) => {
  const repoPath = desktopState.repoPath;
  if (!validateRepoPath(repoPath)) {
    throw new Error("No valid AppForge repository selected.");
  }

  const sourcePath = payload && typeof payload.sourcePath === "string"
    ? payload.sourcePath
    : null;
  const content = payload && typeof payload.content === "string"
    ? payload.content
    : null;

  if (!sourcePath || content === null) {
    throw new Error("Missing sourcePath or content.");
  }

  const absolutePath = resolveWritePath(repoPath, sourcePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content, "utf8");

  return { ok: true, path: sourcePath };
});

app.whenReady().then(() => {
  desktopState = loadDesktopState();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
