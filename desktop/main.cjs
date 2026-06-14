const { app, BrowserWindow, shell } = require("electron");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

function getRendererIndexPath() {
  return path.join(getRendererRootDir(), "index.html");
}

function getRendererRootDir() {
  if (app.isPackaged) {
    return path.join(app.getAppPath(), "renderer");
  }

  return process.env.DESKTOP_RENDERER_DIR || path.join(process.cwd(), "dist-desktop", "web");
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

async function createMainWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 760,
    autoHideMenuBar: true,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
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

  win.loadURL(url);
}

app.whenReady().then(() => {
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
