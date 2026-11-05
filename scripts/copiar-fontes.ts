import { copyFileSync, mkdirSync } from "node:fs";

const mapa: [string, string][] = [
  ["@fontsource-variable/grenze-gotisch/files/grenze-gotisch-latin-wght-normal.woff2", "grenze-gotisch.woff2"],
  ["@fontsource-variable/literata/files/literata-latin-wght-normal.woff2", "literata.woff2"],
  ["@fontsource-variable/literata/files/literata-latin-wght-italic.woff2", "literata-italic.woff2"],
  ["@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", "jetbrains-mono.woff2"],
  ["@fontsource/jacquard-24/files/jacquard-24-latin-400-normal.woff2", "jacquard-24.woff2"],
];
mkdirSync("src/fontes", { recursive: true });
for (const [de, para] of mapa) copyFileSync(`node_modules/${de}`, `src/fontes/${para}`);
console.log(`Fontes copiadas: ${mapa.length}`);
