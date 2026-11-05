/**
 * Gera o atlas de glifos da chuva, com campo de distância (SDF) em um canal.
 * Roda no Chromium do Playwright para usar o motor de texto real do navegador.
 * Saídas: public/gl/atlas.png e src/gl/chuva/atlas-info.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const b64 = (p: string) => readFileSync(`node_modules/${p}`).toString("base64");
const FONTES = {
  mono: b64("@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2"),
  jp: b64("@fontsource/noto-sans-jp/files/noto-sans-jp-119-400-normal.woff2"),
  grego: b64("@fontsource-variable/literata/files/literata-greek-wght-normal.woff2"),
  glag: b64("@fontsource/noto-sans-glagolitic/files/noto-sans-glagolitic-glagolitic-400-normal.woff2"),
};

// Ordem fixa. Latinas no início porque a chuva soletra palavras curtas.
const LATINAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const DIGITOS = "0123456789".split("");
const KATAKANA = Array.from({ length: 46 }, (_, i) => String.fromCodePoint(0x30a2 + i));
const GREGO = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθλμξπσφψω".split("");
const GLAGOLITICO = Array.from({ length: 38 }, (_, i) => String.fromCodePoint(0x2c00 + i));

const grupos: { fonte: string; glifos: string[] }[] = [
  { fonte: "mono", glifos: [...LATINAS, ...DIGITOS] },
  { fonte: "jp", glifos: KATAKANA },
  { fonte: "grego", glifos: GREGO },
  { fonte: "glag", glifos: GLAGOLITICO },
];
const COLUNAS = 16;
const CELULA = 64;
const total = grupos.reduce((s, g) => s + g.glifos.length, 0);
const LINHAS = Math.ceil(total / COLUNAS);

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.setContent("<!doctype html><title>atlas</title>");
// O tsx/esbuild injeta __name em funções nomeadas; o navegador precisa conhecer esse auxiliar.
await pagina.evaluate("window.__name = (f) => f");
const png: string = await pagina.evaluate(
  async ({ FONTES, grupos, COLUNAS, CELULA, LINHAS }) => {
    for (const [nome, dados] of Object.entries(FONTES)) {
      const f = new FontFace(nome, `url(data:font/woff2;base64,${dados})`);
      await f.load();
      document.fonts.add(f);
    }
    const ESCALA = 4;
    const lado = CELULA * ESCALA;
    const fonte = document.createElement("canvas");
    fonte.width = fonte.height = lado;
    const cf = fonte.getContext("2d", { willReadFrequently: true })!;
    const saida = document.createElement("canvas");
    saida.width = COLUNAS * CELULA;
    saida.height = LINHAS * CELULA;
    const cs = saida.getContext("2d")!;
    const img = cs.createImageData(saida.width, saida.height);
    const ALCANCE = 8 * ESCALA;

    // Transformada de distância euclidiana (Felzenszwalb) em duas passadas.
    function dt1(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
      let k = 0;
      v[0] = 0;
      z[0] = -1e20;
      z[1] = 1e20;
      for (let q = 1; q < n; q++) {
        let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
        while (s <= z[k]) {
          k--;
          s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
        }
        k++;
        v[k] = q;
        z[k] = s;
        z[k + 1] = 1e20;
      }
      k = 0;
      for (let q = 0; q < n; q++) {
        while (z[k + 1] < q) k++;
        d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
      }
    }
    function dt2(grade: Float64Array, l: number) {
      const f = new Float64Array(l);
      const d = new Float64Array(l);
      const v = new Int32Array(l);
      const z = new Float64Array(l + 1);
      for (let x = 0; x < l; x++) {
        for (let y = 0; y < l; y++) f[y] = grade[y * l + x];
        dt1(f, l, d, v, z);
        for (let y = 0; y < l; y++) grade[y * l + x] = d[y];
      }
      for (let y = 0; y < l; y++) {
        for (let x = 0; x < l; x++) f[x] = grade[y * l + x];
        dt1(f, l, d, v, z);
        for (let x = 0; x < l; x++) grade[y * l + x] = d[x];
      }
    }
    let idx = 0;
    for (const grupo of grupos) {
      for (const g of grupo.glifos) {
        cf.fillStyle = "#000";
        cf.fillRect(0, 0, lado, lado);
        cf.fillStyle = "#fff";
        cf.textAlign = "center";
        cf.textBaseline = "alphabetic";
        cf.font = `${lado * 0.68}px ${grupo.fonte}`;
        const m = cf.measureText(g);
        const asc = m.actualBoundingBoxAscent;
        const des = m.actualBoundingBoxDescent;
        cf.fillText(g, lado / 2, lado / 2 + (asc - des) / 2);
        const px = cf.getImageData(0, 0, lado, lado).data;
        const fora = new Float64Array(lado * lado);
        const dentro = new Float64Array(lado * lado);
        for (let i = 0; i < lado * lado; i++) {
          const on = px[i * 4] > 127;
          fora[i] = on ? 0 : 1e20;
          dentro[i] = on ? 1e20 : 0;
        }
        dt2(fora, lado);
        dt2(dentro, lado);
        const cx = (idx % COLUNAS) * CELULA;
        const cy = Math.floor(idx / COLUNAS) * CELULA;
        for (let y = 0; y < CELULA; y++) {
          for (let x = 0; x < CELULA; x++) {
            const i = (y * ESCALA + ESCALA / 2) * lado + x * ESCALA + ESCALA / 2;
            const s = Math.sqrt(fora[i]) - Math.sqrt(dentro[i]);
            const v = Math.max(0, Math.min(1, 0.5 - s / (2 * ALCANCE)));
            const o = ((cy + y) * saida.width + cx + x) * 4;
            img.data[o] = img.data[o + 1] = img.data[o + 2] = Math.round(v * 255);
            img.data[o + 3] = 255;
          }
        }
        idx++;
      }
    }
    cs.putImageData(img, 0, 0);
    return saida.toDataURL("image/png");
  },
  { FONTES, grupos, COLUNAS, CELULA, LINHAS },
);
await navegador.close();

mkdirSync("public/gl", { recursive: true });
mkdirSync("src/gl/chuva", { recursive: true });
writeFileSync("public/gl/atlas.png", Buffer.from(png.split(",")[1], "base64"));
writeFileSync(
  "src/gl/chuva/atlas-info.ts",
  `// Gerado por scripts/gerar-atlas.ts. Não edite à mão.
export const ATLAS = { colunas: ${COLUNAS}, linhas: ${LINHAS}, total: ${total}, latinas: ${LATINAS.length} } as const;
`,
);
console.log(`Atlas: ${total} glifos, ${COLUNAS}x${LINHAS}`);
