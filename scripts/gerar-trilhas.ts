import { writeFileSync } from "node:fs";

/**
 * Trilhas de placa de circuito (docs/05). Determinísticas por semente: o mesmo nome gera sempre a mesma placa.
 *
 * Como numa placa real, as trilhas andam em barramentos paralelos com passo fixo. Saem dos pads de um
 * componente, fazem uma curva de 45° em leque (o passo se mantém na diagonal) e terminam em vias ou na borda.
 * Só a metade direita da placa é desenhada: a esquerda é do texto. Nenhum componente de marca.
 * Saída: src/componentes/graficos/trilhas.gerado.ts
 */
const L = 1200;
const A = 800;
const PASSO = 12; // distância entre trilhas vizinhas
const RAIZ2 = Math.SQRT2;

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const semente = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
const r1 = (v: number) => Math.round(v * 10) / 10;

type Placa = {
  d: string;
  vias: [number, number][];
  pads: [number, number, number, number][];
  corpos: [number, number, number, number][];
};

/**
 * Barramento de `n` trilhas que sai na horizontal de (x0, y0 + i·passo), no sentido `sx` (1 direita, −1 esquerda),
 * dobra 45° para cima ou para baixo (`sy`), anda `diagonal` e volta à horizontal até a mesma coluna final.
 * Cada trilha dobra `i·k` antes ou depois da vizinha. Com k = passo·(1 − √2) na dobra para baixo (a trilha de baixo
 * está por dentro da curva) e k = passo·(√2 − 1) na dobra para cima, a distância perpendicular continua igual ao
 * passo na diagonal. Com a mesma diagonal para todas, a segunda dobra herda o mesmo k e o passo volta igual.
 */
function barramento(n: number, x0: number, y0: number, sx: 1 | -1, sy: 1 | -1, reto1: number, diagonal: number, reto2: number) {
  const k = sy === 1 ? PASSO * (1 - RAIZ2) : PASSO * (RAIZ2 - 1);
  const folga = Math.max(0, -Math.min(0, k * (n - 1))); // nenhuma dobra antes do pad
  const xFim = x0 + sx * (folga + reto1 + Math.abs(k) * n + diagonal + reto2);
  const linhas: [number, number][][] = [];
  for (let i = 0; i < n; i++) {
    const y = y0 + i * PASSO;
    const b = folga + reto1 + i * k;
    const p1: [number, number] = [x0 + sx * b, y];
    const p2: [number, number] = [p1[0] + sx * diagonal, y + sy * diagonal];
    linhas.push([[x0, y], p1, p2, [xFim, p2[1]]]);
  }
  return linhas;
}

function placa(nome: string): Placa {
  const r = mulberry32(semente(nome));
  const trilhas: [number, number][][] = [];
  const vias: [number, number][] = [];
  const pads: [number, number, number, number][] = [];
  const corpos: [number, number, number, number][] = [];

  // Dois componentes na metade direita, cada um com uma fileira de pads de cada lado.
  for (let c = 0; c < 2; c++) {
    const n = 4 + Math.floor(r() * 3);
    const altura = n * PASSO + 16;
    const largura = 56 + Math.floor(r() * 4) * 12;
    const cx = Math.round(860 + c * 200 + r() * 40);
    const cy = Math.round(150 + c * 300 + r() * 120);
    const x = cx - largura / 2;
    const y = cy - altura / 2;
    corpos.push([x, y, largura, altura]);
    for (const lado of [-1, 1] as const) {
      const xp = lado === -1 ? x - 10 : x + largura + 2;
      const y0 = y + 8 + PASSO / 2;
      for (let i = 0; i < n; i++) pads.push([xp, y0 + i * PASSO - 2, 8, 4]);
      // Nem todo lado tem barramento: placa cheia demais vira ruído.
      if (r() < 0.25) continue;
      const usadas = Math.max(3, n - Math.floor(r() * 2));
      const sy = r() > 0.5 ? 1 : -1;
      const reto1 = 18 + Math.floor(r() * 4) * PASSO;
      const diagonal = 36 + Math.floor(r() * 6) * PASSO;
      const reto2 = 30 + Math.floor(r() * 8) * PASSO;
      const sx = lado;
      const inicioX = lado === -1 ? xp : xp + 8;
      const bus = barramento(usadas, inicioX, y0, sx, sy, reto1, diagonal, reto2);
      const terminaEmVia = r() > 0.35;
      for (const [i, linha] of bus.entries()) {
        const fim = linha[linha.length - 1];
        if (terminaEmVia) {
          // Vias em degrau alternado: dois de diâmetro 8 não cabem lado a lado em passo 12.
          fim[0] += sx * (i % 2) * 14;
          vias.push([r1(fim[0] + sx * 4), r1(fim[1])]);
        } else {
          fim[0] = sx === 1 ? L + 20 : fim[0] - 400;
        }
        trilhas.push(linha);
      }
    }
  }

  // Trilhas soltas entre vias, para a textura de placa. Retas ou com uma dobra de 45°.
  for (let k = 0; k < 6; k++) {
    const x = Math.round(640 + r() * 520);
    const y = Math.round(60 + r() * 680);
    const ir = 24 + Math.floor(r() * 6) * PASSO;
    const sy = r() > 0.5 ? 1 : -1;
    const diag = r() > 0.5 ? 24 + Math.floor(r() * 3) * PASSO : 0;
    const pts: [number, number][] = [[x, y], [x + ir, y]];
    if (diag) pts.push([x + ir + diag, y + sy * diag], [x + ir + diag + 24, y + sy * diag]);
    trilhas.push(pts);
    vias.push([x - 4, y], [pts[pts.length - 1][0] + 4, pts[pts.length - 1][1]]);
  }

  const d = trilhas.map((pts) => "M" + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L")).join("");
  return { d, vias, pads, corpos };
}

// Só seções com a direita livre de texto e de forma da chuva. O Início guarda o selo 6 nos metadados.
const NOMES = ["inicio", "trajetoria", "certificados"];
const saida = Object.fromEntries(NOMES.map((n) => [n, placa(n)]));
const corpo = `// Gerado por scripts/gerar-trilhas.ts. Não edite à mão.
export const TRILHAS_LARGURA = ${L};
export const TRILHAS_ALTURA = ${A};
export type Placa = { d: string; vias: [number, number][]; pads: [number, number, number, number][]; corpos: [number, number, number, number][] };
export const TRILHAS: Record<string, Placa> = ${JSON.stringify(saida)};
`;
writeFileSync("src/componentes/graficos/trilhas.gerado.ts", corpo);
console.log(`Trilhas geradas: ${NOMES.length} placas`);
