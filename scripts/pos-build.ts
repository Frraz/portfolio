/**
 * Depois do `next build`: CSP por rota, arquivos públicos gerados, SBOM, gzip e verificação da saída.
 * Nonce exige servidor; aqui cada script inline tem seu hash. Decisão 9 em docs/decisoes.md.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, relative } from "node:path";
import { ARTE_FONTE, SELOS } from "../src/ctf/selos.ts";
import { TEMAS } from "../src/temas/temas.ts";

const SAIDA = "out";
const URL_SITE = process.env.SITE_URL || "https://warley.ferzion.com.br";
const LIMITE_CABECALHO = 6 * 1024;

const percorrer = (d: string): string[] => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? percorrer(p) : [p]; });

export function hashesInline(html: string) {
  const achados = new Set<string>();
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attrs, corpo] = m;
    if (/\bsrc\s*=/.test(attrs) || !corpo) continue;
    if (/type\s*=\s*["']application\/ld\+json["']/i.test(attrs)) continue; // bloco de dados: não executa
    achados.add(`'sha256-${createHash("sha256").update(corpo, "utf8").digest("base64")}'`);
  }
  return [...achados];
}

const politica = (hashes: string[]) =>
  [
    "default-src 'none'",
    `script-src 'self'${hashes.length ? " " + hashes.join(" ") : ""}`,
    "style-src 'self'",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "media-src 'none'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join("; ");

const arquivos = percorrer(SAIDA);
const versao = createHash("sha256").update(arquivos.filter((f) => /\.(html|js|css)$/.test(f)).sort().map((f) => readFileSync(f)).reduce((h, b) => h.update(b), createHash("sha256")).digest()).digest("hex").slice(0, 12);

// 1. Arquivos públicos
const expira = new Date(Date.now() + 182 * 864e5).toISOString();
mkdirSync(join(SAIDA, ".well-known"), { recursive: true });
writeFileSync(join(SAIDA, ".well-known/security.txt"), `# selo 4: ${SELOS[4]}\nContact: mailto:warley.ferraz.wf@gmail.com\nExpires: ${expira}\nPreferred-Languages: pt, en\nCanonical: ${URL_SITE}/.well-known/security.txt\nPolicy: ${URL_SITE}/seguranca\n`);
writeFileSync(join(SAIDA, "robots.txt"), `# selo 2: ${SELOS[2]}\nUser-agent: *\nAllow: /\n\nSitemap: ${URL_SITE}/sitemap.xml\n`);

// Selo 0: comentário antes do <html>, fora da árvore que o React hidrata. Não muda os hashes de script.
const inicial = join(SAIDA, "index.html");
const htmlInicial = readFileSync(inicial, "utf8");
writeFileSync(inicial, htmlInicial.replace(/^<!DOCTYPE html>/i, `<!DOCTYPE html><!--${ARTE_FONTE}selo 0: ${SELOS[0]}\n-->`));

// Manifesto: a página cabe em um atalho no celular, sem nenhuma permissão extra. Ícones em public/ (pnpm og).
writeFileSync(join(SAIDA, "manifest.webmanifest"), JSON.stringify({ name: "Warley Ferraz Almeida", short_name: "Warley", start_url: "/", display: "standalone", background_color: TEMAS[0].cores.fundo, theme_color: TEMAS[0].cores.fundo, lang: "pt-BR", icons: [{ src: "/icone.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }, { src: "/icone-192.png", sizes: "192x192", type: "image/png" }, { src: "/icone-512.png", sizes: "512x512", type: "image/png" }] }));
const hoje = new Date().toISOString().slice(0, 10);
const rotas = ["", "/cv", "/seguranca", "/sistema"];
writeFileSync(join(SAIDA, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rotas.map((r) => `  <url><loc>${URL_SITE}${r}</loc><lastmod>${hoje}</lastmod></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(join(SAIDA, "humans.txt"), `/* Pessoa */\nWarley Ferraz Almeida\n${URL_SITE}\n\n/* Site */\nNext.js, React, Three.js, GSAP e Lenis. Estático, servido por nginx.\n`);
writeFileSync(join(SAIDA, "saude.txt"), "ok\n");

// 2. CSP por rota
const mapa: Record<string, string> = {};
for (const a of arquivos.filter((f) => f.endsWith(".html"))) {
  const chave = "/" + relative(SAIDA, a);
  mapa[chave] = politica(hashesInline(readFileSync(a, "utf8")));
  if (mapa[chave].length > LIMITE_CABECALHO) {
    console.error(`✗ CSP de ${chave} tem ${mapa[chave].length} bytes (limite ${LIMITE_CABECALHO}).`);
    process.exit(1);
  }
}
mkdirSync("deploy", { recursive: true });
const padrao = politica([]);
writeFileSync("deploy/csp-map.conf", `# Gerado por scripts/pos-build.ts. Não edite à mão.\nmap $uri $csp {\n  default "${padrao}";\n${Object.entries(mapa).map(([k, v]) => `  "${k}" "${v}";`).join("\n")}\n}\n`);
writeFileSync("deploy/csp-map.json", JSON.stringify({ padrao, rotas: mapa }, null, 1));

// 2b. Service worker: lista de pré-cache e versão saem do próprio build.
// Só o que a primeira tela usa: os recursos referenciados pelo HTML das páginas (scripts iniciais, CSS e fontes
// pré-carregadas). Os chunks da cena 3D ficam de fora e entram no cache em tempo de execução, quando forem pedidos.
const paginas = ["index.html", "cv.html", "offline.html"].map((f) => join(SAIDA, f));
const doHtml = new Set(paginas.flatMap((p) => [...readFileSync(p, "utf8").matchAll(/(?:src|href)="(\/_next\/static\/[^"]+\.(?:js|css|woff2))"/g)].map((m) => m[1])));
const precache = ["/", "/cv", "/offline", "/tema.js", ...doHtml];
writeFileSync(join(SAIDA, "sw.js"), readFileSync("scripts/sw-modelo.js", "utf8").replace('"__VERSAO__"', JSON.stringify(versao)).replace('["__PRECACHE__"]', JSON.stringify(precache)));

// 3. SBOM mínimo em CycloneDX, a partir das dependências de produção instaladas
const pacote = JSON.parse(readFileSync("package.json", "utf8"));
const componentes = Object.keys(pacote.dependencies ?? {}).map((n) => {
  const v = JSON.parse(readFileSync(`node_modules/${n}/package.json`, "utf8")).version as string;
  return { type: "library", name: n, version: v, purl: `pkg:npm/${n.replace("@", "%40")}@${v}` };
});
writeFileSync(join(SAIDA, "sbom.json"), JSON.stringify({ bomFormat: "CycloneDX", specVersion: "1.5", version: 1, metadata: { timestamp: new Date().toISOString(), component: { type: "application", name: pacote.name, version: pacote.version } }, components: componentes }, null, 1));

// 4. Verificação da saída, antes de comprimir
execFileSync("npx", ["tsx", "scripts/verificar-conteudo.ts", "--saida"], { stdio: "inherit" });

// 5. gzip estático para o nginx (gzip_static)
let n = 0;
for (const a of percorrer(SAIDA).filter((f) => /\.(html|js|css|json|txt|xml|svg|webmanifest|glb)$/.test(f))) {
  const dados = readFileSync(a);
  if (dados.length < 1024) continue;
  writeFileSync(`${a}.gz`, gzipSync(dados, { level: 9 }));
  n++;
}
const tamanho = Object.values(mapa).map((v) => v.length);
console.log(`✓ Pós-build: ${Object.keys(mapa).length} rotas com CSP (maior ${Math.max(...tamanho)} bytes), ${componentes.length} componentes no SBOM, ${n} arquivos comprimidos.`);
