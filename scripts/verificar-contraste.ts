import { TEMAS } from "../src/temas/temas.ts";
import { contraste, mistura } from "../src/temas/cor.ts";

const VIDRO_ALFA = 0.82;
const pares: [string, string, number][] = [
  ["tinta", "fundo", 4.5],
  ["tinta", "superficie", 4.5],
  ["tinta2", "fundo", 4.5],
  ["tinta2", "superficie", 4.5],
  ["acento", "fundo", 4.5],
  ["acento", "superficie", 4.5],
  ["alerta", "fundo", 4.5],
  ["alerta", "superficie", 4.5],
  ["acento2", "superficie", 3],
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
  // Vidro: pior caso é a cor mais forte da cena atrás do painel.
  const atras = t.esquema === "dark" ? c.chuvaCabeca : c.chuva;
  const fundo = mistura(c.superficie, atras, VIDRO_ALFA);
  for (const papel of ["tinta", "tinta2"]) {
    const r = contraste(c[papel], fundo);
    if (r < 4.5) {
      console.error(`✗ ${t.id}: ${papel} sobre vidro = ${r.toFixed(2)}`);
      falhas++;
    }
  }
}
if (falhas) process.exit(1);
console.log(`✓ Contraste: ${TEMAS.length} temas, todos os pares em AA.`);
