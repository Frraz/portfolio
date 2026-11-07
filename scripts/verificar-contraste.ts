import { TEMAS } from "../src/temas/temas.ts";
import { contraste, luminancia } from "../src/temas/cor.ts";

// Pares de docs/05-design-system.md. `forma` é só gráfico (3:1).
const pares: [string, string, number][] = [
  ["tinta", "fundo", 4.5],
  ["tinta", "superficie", 4.5],
  ["tinta", "superficie2", 4.5],
  ["tinta2", "fundo", 4.5],
  ["tinta2", "superficie", 4.5],
  ["tinta2", "superficie2", 4.5],
  ["tintaDado", "fundo", 4.5],
  ["tintaDado", "superficie", 4.5],
  ["tintaDado", "superficie2", 4.5],
  ["sinal", "fundo", 4.5],
  ["sinal", "superficie", 4.5],
  ["sinal", "superficie2", 4.5],
  ["alerta", "fundo", 4.5],
  ["alerta", "superficie", 4.5],
  ["alerta", "superficie2", 4.5],
  ["forma", "fundo", 3],
  ["forma", "superficie", 3],
];
let falhas = 0;
for (const t of TEMAS) {
  const c = t.cores as Record<string, string>;
  for (const [a, b, min] of pares) {
    const r = contraste(c[a], c[b]);
    if (r < min) {
      console.error(`✗ ${t.id}: ${a}/${b} = ${r.toFixed(2)} (mínimo ${min})`);
      falhas++;
    }
  }
  // O teto de luz da cena é calculado por `tinta2` (src/temas/cor.ts). Texto em `tintaDado` sobre a chuva só fica
  // legível se ela não tiver menos contraste com a luz que `tinta2`: mais clara no tema escuro, mais escura no claro.
  const lt2 = luminancia(c.tinta2);
  const ltd = luminancia(c.tintaDado);
  if (t.esquema === "dark" ? ltd < lt2 : ltd > lt2) {
    console.error(`✗ ${t.id}: tintaDado tem menos contraste com a cena que tinta2`);
    falhas++;
  }
}
if (falhas) process.exit(1);
console.log(`✓ Contraste: ${TEMAS.length} temas, todos os pares em AA.`);
