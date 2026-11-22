// Dev only: serve the repo at http://127.0.0.1:<port>/gita/, the same path GitHub Pages uses.
// Run: node scripts/serve.mjs   (or import { serve } for the self-test)
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".mjs": "text/javascript",
  ".js": "text/javascript",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};
// Only the files the site publishes (see .github/workflows/pages.yml).
const PUBLIC = /^(index\.html|sw\.js|manifest\.webmanifest|icon[\w-]*\.(svg|png)|apple-touch-icon\.png|(css|js|content|fonts|vendor)\/.+)$/;

export function serve(port = 8765) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (url === "/gita") return res.writeHead(301, { Location: "/gita/" }).end();
    let rel = url.startsWith("/gita/") ? url.slice(6) : null;
    if (rel === "") rel = "index.html";
    const file = rel && path.join(ROOT, rel);
    if (!rel || rel.split("/").some((p) => p.startsWith(".")) || !PUBLIC.test(rel) || !fs.existsSync(file) || !fs.statSync(file).isFile())
      return res.writeHead(404).end("Not found");
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 8765;
  await serve(port);
  console.log(`Gita app: http://127.0.0.1:${port}/gita/`);
}
