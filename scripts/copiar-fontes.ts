import { copyFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";

// Mona Sans (peso e largura) e JetBrains Mono (peso), docs/05. Só `latin`; latin-ext entra com os idiomas.
// A Martian Mono continua só no atlas da chuva (scripts/gerar-atlas.ts), pré-renderizada.
const mapa: [string, string][] = [
  ["@fontsource-variable/mona-sans/files/mona-sans-latin-wdth-normal.woff2", "mona-sans.woff2"],
  ["@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", "jetbrains-mono.woff2"],
];
mkdirSync("src/fontes", { recursive: true });
const manter = new Set(mapa.map(([, p]) => p));
for (const f of readdirSync("src/fontes")) if (!manter.has(f)) rmSync(`src/fontes/${f}`);
for (const [de, para] of mapa) copyFileSync(`node_modules/${de}`, `src/fontes/${para}`);
console.log(`Fontes copiadas: ${mapa.length}`);
