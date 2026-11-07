/**
 * Imagem de compartilhamento e ícones (`pnpm og`). Roda à mão, como o atlas, e o resultado fica versionado em public/.
 * Só dados reais: nome, cargo atual e domínio, com as fontes e as cores do tema Rubro e a placa gerada do Início.
 * Saída: public/og/warley-ferraz-almeida.png, public/icone.svg, public/icone-192.png, public/icone-512.png e
 * public/apple-touch-icon.png.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { ptBR } from "../src/conteudo/pt-BR.ts";
import { TEMAS } from "../src/temas/temas.ts";
import { A, L, placa } from "./trilhas/placa.ts";

const cor = TEMAS[0].cores;
const fonte = (arquivo: string) => `data:font/woff2;base64,${readFileSync(`src/fontes/${arquivo}`).toString("base64")}`;
const DOMINIO = new URL(process.env.SITE_URL || "https://warley.ferzion.com.br").host;

// Ícone: uma linha de base com um único pulso quadrado. É o "sinal" do conceito, sem letra nem marca.
// O ícone do iOS já recebe cantos arredondados do sistema: ali o fundo é quadrado.
const icone = (raio: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="${raio}" fill="${cor.fundo}"/><path d="M10 41H23V22H41V41H54" fill="none" stroke="${cor.sinal}" stroke-width="5" stroke-linecap="square"/></svg>\n`;

const g = placa("inicio");
const svgPlaca = `<svg viewBox="0 0 ${L} ${A}" preserveAspectRatio="xMaxYMid slice" style="position:absolute;inset:0;width:100%;height:100%;color:${cor.forma};opacity:.55;-webkit-mask-image:linear-gradient(to right,transparent 38%,#000 70%)">
  <g fill="none" stroke="currentColor" stroke-width="1.6">
    <path d="${g.d}" stroke-linejoin="round" stroke-linecap="round"/>
    ${g.corpos.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join("")}
    ${g.pads.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="currentColor" stroke="none"/>`).join("")}
    ${g.vias.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join("")}
  </g>
</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "Mona Sans"; src: url(${fonte("mona-sans.woff2")}) format("woff2"); font-weight: 200 900; font-stretch: 75% 125%; }
@font-face { font-family: "JetBrains Mono"; src: url(${fonte("jetbrains-mono.woff2")}) format("woff2"); font-weight: 100 800; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: ${cor.fundo}; color: ${cor.tinta}; font-family: "Mona Sans"; position: relative; overflow: hidden; }
.texto { position: absolute; left: 80px; bottom: 96px; right: 380px; }
h1 { font-size: 84px; line-height: 0.98; font-weight: 640; font-stretch: 112%; letter-spacing: -0.02em; }
p { margin-top: 28px; font-size: 32px; color: ${cor.tinta2}; font-weight: 450; }
.dominio { position: absolute; left: 80px; top: 72px; font-family: "JetBrains Mono"; font-size: 22px; color: ${cor.sinal}; letter-spacing: 0.02em; }
</style></head><body>
${svgPlaca}
<div class="dominio">${DOMINIO}</div>
<div class="texto"><h1>${ptBR.pessoa.linhasNome.join("<br>")}</h1><p>${ptBR.seo.imagemAlt.replace(`${ptBR.pessoa.nome}, `, "")}</p></div>
</body></html>`;

mkdirSync("public/og", { recursive: true });
writeFileSync("public/icone.svg", icone(14));
const nav = await chromium.launch();
const pagina = await nav.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await pagina.setContent(html);
await pagina.evaluate(() => document.fonts.ready);
await pagina.screenshot({ path: "public/og/warley-ferraz-almeida.png", type: "png" });
for (const [arquivo, lado, raio] of [["icone-192.png", 192, 14], ["icone-512.png", 512, 14], ["apple-touch-icon.png", 180, 0]] as const) {
  await pagina.setViewportSize({ width: lado, height: lado });
  await pagina.setContent(`<body style="margin:0;background:transparent">${icone(raio).replace("<svg ", `<svg width="${lado}" height="${lado}" `)}</body>`);
  await pagina.screenshot({ path: `public/${arquivo}`, omitBackground: true });
}
await nav.close();
console.log("Imagem de compartilhamento e ícones gerados em public/");
