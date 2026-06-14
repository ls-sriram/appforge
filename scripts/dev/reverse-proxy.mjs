import http from "node:http";
import httpProxy from "http-proxy";

const FRONTEND = process.env.FRONTEND_TARGET || "http://127.0.0.1:8081";
const BACKEND = process.env.BACKEND_TARGET || "http://127.0.0.1:8080";
const PORT = Number(process.env.PROXY_PORT || 3000);

const proxy = httpProxy.createProxyServer({
  xfwd: true,
  changeOrigin: false,
  ws: true,
});

const server = http.createServer((req, res) => {
  const url = req.url || "/";
  const target =
    url.startsWith("/api/") || url === "/health" ? BACKEND : FRONTEND;

  proxy.web(req, res, { target }, (err) => {
    res.statusCode = 502;
    res.setHeader("Content-Type", "text/plain");
    res.end(`Proxy error: ${err.message}`);
  });
});

server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head, { target: FRONTEND });
});

server.listen(PORT, () => {
  console.log(`[proxy] listening on http://localhost:${PORT}`);
  console.log(`[proxy] /api/*, /health -> ${BACKEND}`);
  console.log(`[proxy] /* -> ${FRONTEND}`);
});
