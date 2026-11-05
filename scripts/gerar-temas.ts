import { writeFileSync } from "node:fs";
import { TEMAS } from "../src/temas/temas.ts";
import { paraOklch } from "../src/temas/cor.ts";

const kebab = (s: string) => s.replace(/([A-Z0-9])/g, "-$1").toLowerCase();
let css = "/* Gerado por scripts/gerar-temas.ts. Não edite à mão. */\n";
for (const t of TEMAS) {
  // Seletor sem :root permite pré-visualizar um tema dentro de um trecho da página (/sistema).
  const seletor = t.id === "ouro" ? `:root, [data-tema="ouro"]` : `[data-tema="${t.id}"]`;
  css += `${seletor} {\n  color-scheme: ${t.esquema};\n`;
  for (const [papel, hex] of Object.entries(t.cores)) css += `  --${kebab(papel)}: ${paraOklch(hex)};\n`;
  css += `}\n`;
}
for (const t of TEMAS) for (const [papel, hex] of Object.entries(t.cores)) css += `.cor-${t.id}-${papel} { background: ${hex}; }\n`;
writeFileSync("src/temas/gerado.css", css);
console.log(`Temas gerados: ${TEMAS.length}`);
