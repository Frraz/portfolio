import { SELOS } from "./ctf/selos";

/**
 * Geometria do rendilhado. A rosácea do SVG (sem JavaScript) e a do shader usam estes parâmetros.
 * A árvore 1:2 → 1:4 → 1:8 da rede GPON é a mesma lógica de divisão do vitral.
 */
export const ROSACEA = {
  petalas: 12,
  moldura: [0.955, 1.0],
  miolo: 0.19,
  anelInterno: 0.36,
  petalaMeia: { raio: 0.56, largura: 0.145 },
  circuloExterno: { raio: 0.82, largura: 0.1 },
} as const;

const fix = (n: number) => Number(n.toFixed(3));
const polar = (r: number, a: number) => [fix(r * Math.cos(a)), fix(r * Math.sin(a))];

/** SVG da rosácea em coordenadas de -100 a 100. Sem cor literal: herda `currentColor`. */
export function rosaceaSvg(): string {
  const { petalas, moldura, miolo, anelInterno, petalaMeia, circuloExterno } = ROSACEA;
  const S = 100;
  let vidros = "";
  let pedra = "";
  for (let i = 0; i < petalas; i++) {
    const a = (i / petalas) * Math.PI * 2 - Math.PI / 2;
    const [ex, ey] = polar(circuloExterno.raio * S, a);
    const [mx, my] = polar(petalaMeia.raio * S, a);
    const [ax, ay] = polar(anelInterno * S, a);
    const [bx, by] = polar(moldura[0] * S, a + Math.PI / petalas);
    const [cx, cy] = polar(miolo * S, a + Math.PI / petalas);
    pedra += `<line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}"/>`;
    const rl = petalaMeia.largura * S;
    vidros += `<circle class="v2" cx="${mx}" cy="${my}" r="${fix(rl)}"/>`;
    vidros += `<circle class="v1" cx="${ex}" cy="${ey}" r="${fix(circuloExterno.largura * S)}"/>`;
    vidros += `<circle class="v3" cx="${ax}" cy="${ay}" r="${fix(rl * 0.55)}"/>`;
  }
  const circ = (r: number) => `<circle r="${fix(r * S)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-104 -104 208 208" aria-hidden="true" focusable="false">
<metadata>selo 6: ${SELOS[6]}</metadata>
<g class="vidros">${vidros}</g>
<g class="pedra" fill="none" stroke="currentColor">${pedra}${circ(moldura[0])}${circ(moldura[1])}${circ(miolo)}${circ(0.68)}</g>
<g class="cruz" fill="none" stroke="currentColor" stroke-linecap="square"><path d="M0-14V14M-3.5-10H3.5M-7-4H7M-4 5 4 8"/></g>
</svg>`;
}

/** Árvore GPON: OLT → 1:2 → 1:4 → 1:8, com nós em coordenadas de 0 a 100. */
export function arvoreGpon() {
  const nos: { x: number; y: number; nivel: number }[] = [{ x: 50, y: 4, nivel: 0 }];
  const ramos: { d: string; nivel: number; de: number; para: number }[] = [];
  const passo = (x: number, y: number, nivel: number, largura: number, indice: number) => {
    if (nivel === 3) return;
    for (const lado of [-1, 1]) {
      const nx = x + (lado * largura) / 2;
      const ny = y + 31;
      const para = nos.length;
      ramos.push({ d: `M${x} ${y} C ${x} ${y + 18}, ${nx} ${ny - 18}, ${nx} ${ny}`, nivel: nivel + 1, de: indice, para });
      nos.push({ x: nx, y: ny, nivel: nivel + 1 });
      passo(nx, ny, nivel + 1, largura / 2, para);
    }
  };
  passo(50, 4, 0, 46, 0);
  return { nos, ramos };
}
