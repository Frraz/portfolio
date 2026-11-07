/** Servidor estático local que imita o nginx de produção: resolve /cv em cv.html e serve 404.html. */
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, relative } from "node:path";

import { SELOS } from "../src/ctf/selos.ts";

const RAIZ = "out";
const CSP = JSON.parse(readFileSync("deploy/csp-map.json", "utf8")) as { padrao: string; rotas: Record<string, string> };
const cabecalhos = (arquivo: string) => ({
  "content-security-policy": CSP.rotas["/" + relative(RAIZ, arquivo)] ?? CSP.padrao,
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "x-selo": SELOS[3],
});
const PORTA = Number(process.env.PORTA_TESTE ?? 3000);
const TIPOS: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".avif": "image/avif", ".webmanifest": "application/manifest+json" };

createServer((req, res) => {
  const caminho = normalize(decodeURIComponent((req.url ?? "/").split("?")[0]));
  const candidatos = [caminho, `${caminho}.html`, join(caminho, "index.html")].map((c) => join(RAIZ, c));
  const achado = candidatos.find((c) => existsSync(c) && statSync(c).isFile());
  if (!achado) {
    res.writeHead(404, { "content-type": TIPOS[".html"], ...cabecalhos(join(RAIZ, "404.html")) });
    createReadStream(join(RAIZ, "404.html")).pipe(res);
    return;
  }
  res.writeHead(200, { "content-type": TIPOS[extname(achado)] ?? "application/octet-stream", ...cabecalhos(achado) });
  createReadStream(achado).pipe(res);
}).listen(PORTA, () => console.log(`http://localhost:${PORTA}`));
