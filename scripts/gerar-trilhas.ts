import { writeFileSync } from "node:fs";
import { A, L, placa } from "./trilhas/placa.ts";

/**
 * Gera as placas de circuito das seções (`pnpm trilhas`). O algoritmo está em scripts/trilhas/placa.ts.
 * Só seções com a direita livre de texto e de forma da chuva. O Início guarda o selo 6 nos metadados.
 * Saída: src/componentes/graficos/trilhas.gerado.ts
 */
const NOMES = ["inicio", "trajetoria", "certificados"];
const saida = Object.fromEntries(
  NOMES.map((n) => {
    const { d, vias, pads, corpos, marcas } = placa(n);
    return [n, { d, vias, pads, corpos, marcas }];
  }),
);
const corpo = `// Gerado por scripts/gerar-trilhas.ts. Não edite à mão.
export const TRILHAS_LARGURA = ${L};
export const TRILHAS_ALTURA = ${A};
export type Placa = { d: string; vias: [number, number][]; pads: [number, number, number, number][]; corpos: [number, number, number, number][]; marcas: [number, number][] };
export const TRILHAS: Record<string, Placa> = ${JSON.stringify(saida)};
`;
writeFileSync("src/componentes/graficos/trilhas.gerado.ts", corpo);
console.log(`Trilhas geradas: ${NOMES.length} placas (${NOMES.map((n) => `${n}: ${saida[n].vias.length} vias, ${saida[n].corpos.length} componentes`).join("; ")})`);
