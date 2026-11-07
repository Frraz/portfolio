/**
 * Placa de circuito determinística por semente (docs/05, decisão 93). Função pura, usada por scripts/gerar-trilhas.ts
 * e pelo teste tests/unidade/trilhas.test.ts.
 *
 * Tudo nasce numa grade de 6 unidades no viewBox 1200×800. Cada peça (corpo de CI, pad, trilha, via) ocupa nós da
 * grade e pertence a uma rede. Antes de gravar uma peça, a grade confere se algum nó dela fica a menos de dois nós
 * (12 unidades) de um nó de outra rede. Se fica, a peça é sorteada de novo; se não couber depois de várias
 * tentativas, é descartada. Assim nada se cruza, nada encosta e nada sai da área útil, como numa placa real.
 *
 * Barramentos saem dos pads com passo de 12, dobram 45° em leque e voltam ao eixo. Na diagonal, cada trilha dobra
 * 12 unidades antes ou depois da vizinha, o que mantém as trilhas paralelas e sem cruzamento.
 */
export const L = 1200;
export const A = 800;
const G = 6; // passo da grade
const PASSO = 12; // distância entre trilhas vizinhas
const MARGEM = 24; // área útil: nada encosta na borda, exceto as trilhas que saem da placa de propósito
const NX = L / G;
const NY = Math.floor(A / G);

export type Ponto = [number, number];
export type Retangulo = [number, number, number, number];
export type Placa = { d: string; vias: Ponto[]; pads: Retangulo[]; corpos: Retangulo[]; marcas: Ponto[] };
/** Geometria completa, com a rede de cada elemento, para o teste conferir as distâncias. */
export type Geometria = Placa & {
  trilhas: { rede: number; pts: Ponto[] }[];
  viasRede: { rede: number; p: Ponto }[];
  corposRede: { rede: number; r: Retangulo }[];
  padsRede: { rede: number; r: Retangulo }[];
  permitidos: Set<string>;
};

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

const par = (a: number, b: number) => (a < b ? `${a}|${b}` : `${b}|${a}`);

type No = { i: number; j: number; rede: number };
type Peca = { rede: number; nos: No[]; saida?: boolean };

class Grade {
  private ocup = new Map<number, number>();
  readonly permitidos = new Set<string>();
  private chave = (i: number, j: number) => i * 1000 + j;

  permitir(a: number, b: number) {
    this.permitidos.add(par(a, b));
  }

  private conflita(n: No, ocup: Map<number, number>) {
    for (let di = -1; di <= 1; di++)
      for (let dj = -1; dj <= 1; dj++) {
        const outra = ocup.get(this.chave(n.i + di, n.j + dj));
        if (outra !== undefined && outra !== n.rede && !this.permitidos.has(par(outra, n.rede))) return true;
      }
    return false;
  }

  private dentro(n: No, saida: boolean) {
    const m = MARGEM / G;
    if (saida) return n.i >= m && n.j >= -4 && n.j <= NY + 4 && n.i <= NX + 4;
    return n.i >= m && n.i <= NX - m && n.j >= m && n.j <= NY - m;
  }

  /** Grava todas as peças ou nenhuma. As peças do grupo também são conferidas entre si. */
  tentar(pecas: Peca[]) {
    const gravados: number[] = [];
    for (const p of pecas) {
      for (const n of p.nos) {
        if (!this.dentro(n, Boolean(p.saida)) || this.conflita(n, this.ocup)) {
          for (const k of gravados) this.ocup.delete(k);
          return false;
        }
      }
      for (const n of p.nos) {
        const k = this.chave(n.i, n.j);
        if (!this.ocup.has(k)) {
          this.ocup.set(k, n.rede);
          gravados.push(k);
        }
      }
    }
    return true;
  }

  /** Nenhum nó ocupado dentro do retângulo (em unidades). Reserva o respiro em volta dos CIs. */
  vazio(x0: number, y0: number, x1: number, y1: number) {
    for (let i = Math.floor(x0 / G); i <= Math.ceil(x1 / G); i++) for (let j = Math.floor(y0 / G); j <= Math.ceil(y1 / G); j++) if (this.ocup.has(this.chave(i, j))) return false;
    return true;
  }
}

/** Nós de uma linha poligonal com segmentos retos ou a 45°, com todos os vértices na grade. */
function rasterizar(pts: Ponto[], rede: number): No[] {
  const nos: No[] = [];
  for (let k = 0; k < pts.length - 1; k++) {
    const [x0, y0] = pts[k];
    const [x1, y1] = pts[k + 1];
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    const passos = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / G;
    if (!Number.isInteger(passos) || (dx && dy && Math.abs(x1 - x0) !== Math.abs(y1 - y0))) throw new Error(`segmento fora da grade: ${pts[k]} → ${pts[k + 1]}`);
    for (let s = k === 0 ? 0 : 1; s <= passos; s++) nos.push({ i: x0 / G + dx * s, j: y0 / G + dy * s, rede });
  }
  return nos;
}

const noDe = ([x, y]: Ponto, rede: number): No => ({ i: x / G, j: y / G, rede });
const nosRet = (x0: number, y0: number, x1: number, y1: number, rede: number) => {
  const nos: No[] = [];
  for (let x = x0; x <= x1; x += G) for (let y = y0; y <= y1; y += G) nos.push(noDe([x, y], rede));
  return nos;
};

export function placa(nome: string): Geometria {
  const r = mulberry32(semente(nome));
  const sorteio = <T,>(lista: readonly T[]) => lista[Math.floor(r() * lista.length)];
  const grade = new Grade();
  let proxima = 1;
  const nova = () => proxima++;

  const trilhas: Geometria["trilhas"] = [];
  const viasRede: Geometria["viasRede"] = [];
  const corposRede: Geometria["corposRede"] = [];
  const padsRede: Geometria["padsRede"] = [];
  const marcas: Ponto[] = [];

  const grade6 = (v: number) => Math.round(v / G) * G;

  // Trilha com via no fim (ou nos dois fins). Retorna as peças, sem gravar.
  const comVias = (pts: Ponto[], rede: number, inicio: boolean, fim: boolean, saida = false): Peca[] => {
    const pecas: Peca[] = [{ rede, nos: rasterizar(pts, rede), saida }];
    if (inicio) pecas.push({ rede, nos: [noDe(pts[0], rede)] });
    if (fim) pecas.push({ rede, nos: [noDe(pts[pts.length - 1], rede)] });
    return pecas;
  };
  const gravarTrilha = (pts: Ponto[], rede: number, inicio: boolean, fim: boolean) => {
    trilhas.push({ rede, pts });
    if (inicio) viasRede.push({ rede, p: pts[0] });
    if (fim) viasRede.push({ rede, p: pts[pts.length - 1] });
  };

  // 1. Circuitos integrados: dois ou três, com pinos em dois ou quatro lados e respiro em volta.
  type Lado = { pads: { p: Ponto; rede: number }[]; d: Ponto; l: Ponto };
  const cis: Lado[][] = [];
  const quantos = 2 + (r() < 0.5 ? 1 : 0);
  for (let c = 0; c < quantos; c++) {
    for (let t = 0; t < 60; t++) {
      const quatro = r() < 0.45;
      const n = quatro ? 4 + Math.floor(r() * 3) : 4 + Math.floor(r() * 4);
      const comp = n * PASSO + PASSO;
      const w = quatro ? comp : sorteio([36, 48, 60]);
      const h = comp;
      const x0 = grade6(700 + r() * (1100 - 700 - w));
      const y0 = grade6(60 + r() * (720 - 60 - h));
      if (!grade.vazio(x0 - 48, y0 - 48, x0 + w + 48, y0 + h + 48)) continue;
      const corpo = nova();
      const lados: Lado[] = [];
      const pecas: Peca[] = [{ rede: corpo, nos: nosRet(x0, y0, x0 + w, y0 + h, corpo) }];
      const defs: { d: Ponto; l: Ponto; origem: Ponto; n: number }[] = [
        { d: [-1, 0], l: [0, 1], origem: [x0 - G, y0 + PASSO], n },
        { d: [1, 0], l: [0, 1], origem: [x0 + w + G, y0 + PASSO], n },
      ];
      if (quatro) defs.push({ d: [0, -1], l: [1, 0], origem: [x0 + PASSO, y0 - G], n: Math.round((w - PASSO) / PASSO) }, { d: [0, 1], l: [1, 0], origem: [x0 + PASSO, y0 + h + G], n: Math.round((w - PASSO) / PASSO) });
      for (const def of defs) {
        const pads: Lado["pads"] = [];
        for (let k = 0; k < def.n; k++) {
          const p: Ponto = [def.origem[0] + def.l[0] * PASSO * k, def.origem[1] + def.l[1] * PASSO * k];
          const rede = nova();
          grade.permitir(corpo, rede);
          pads.push({ p, rede });
          pecas.push({ rede, nos: [noDe(p, rede)] });
        }
        lados.push({ pads, d: def.d, l: def.l });
      }
      if (!grade.tentar(pecas)) continue;
      corposRede.push({ rede: corpo, r: [x0, y0, w, h] });
      marcas.push([x0 + 7, y0 + 7]);
      for (const lado of lados)
        for (const pad of lado.pads) {
          const horizontal = lado.d[0] !== 0;
          padsRede.push({ rede: pad.rede, r: horizontal ? [pad.p[0] - 4, pad.p[1] - 2, 8, 4] : [pad.p[0] - 2, pad.p[1] - 4, 4, 8] });
        }
      cis.push(lados);
      break;
    }
  }

  // 2. Barramentos: de cada lado, um grupo contíguo de pinos sai em leque. Para a esquerda só até a máscara.
  for (const lados of cis)
    for (const lado of lados) {
      if (r() < 0.2) continue;
      const n = lado.pads.length;
      for (let t = 0; t < 40; t++) {
        const m = Math.max(3, n - Math.floor(r() * 3) - (t > 20 ? 1 : 0));
        if (m > n) continue;
        const k0 = Math.floor(r() * (n - m + 1));
        const sy = r() < 0.5 ? 1 : -1;
        const base = sorteio([12, 18, 24]);
        const diag = sorteio([24, 36, 48, 60, 72]);
        const cauda = sorteio([12, 24, 36, 48, 60]);
        const saindo = lado.d[0] !== -1 && r() < 0.35;
        const fim = Math.max(...Array.from({ length: m }, (_, i) => base + (sy === 1 ? m - 1 - i : i) * PASSO)) + diag + cauda;
        const pecas: Peca[] = [];
        const desenhos: { rede: number; pts: Ponto[]; via: boolean }[] = [];
        for (let i = 0; i < m; i++) {
          const pad = lado.pads[k0 + i];
          const b = base + (sy === 1 ? m - 1 - i : i) * PASSO;
          // Local (u ao longo da saída, v ao longo do lado) para global.
          const g = (u: number, v: number): Ponto => [pad.p[0] + lado.d[0] * u + lado.l[0] * v, pad.p[1] + lado.d[1] * u + lado.l[1] * v];
          let uFim = fim + (saindo ? 0 : (i % 2) * PASSO);
          if (saindo) {
            const [px, py] = g(0, sy * diag);
            uFim = lado.d[0] === 1 ? L + PASSO - px : lado.d[1] === 1 ? A + PASSO - py : py + PASSO;
            uFim = Math.max(Math.ceil(uFim / G) * G, b + diag + G);
          }
          const pts: Ponto[] = [g(0, 0), g(b, 0), g(b + diag, sy * diag), g(uFim, sy * diag)];
          pecas.push(...comVias(pts, pad.rede, false, !saindo, saindo));
          desenhos.push({ rede: pad.rede, pts, via: !saindo });
        }
        if (!grade.tentar(pecas)) continue;
        for (const dsn of desenhos) gravarTrilha(dsn.pts, dsn.rede, false, dsn.via);
        break;
      }
    }

  // 3. Componentes passivos de dois pads (resistor ou capacitor), com uma trilha curta e uma via de cada lado.
  for (let c = 0; c < 9; c++) {
    for (let t = 0; t < 25; t++) {
      const horizontal = r() < 0.6;
      const d: Ponto = horizontal ? [1, 0] : [0, 1];
      const x = grade6(680 + r() * 480);
      const y = grade6(40 + r() * 720);
      const pa: Ponto = [x, y];
      const pb: Ponto = [x + d[0] * 24, y + d[1] * 24];
      const corpo = nova();
      const ra = nova();
      const rb = nova();
      grade.permitir(corpo, ra);
      grade.permitir(corpo, rb);
      const sa = sorteio([12, 18, 24, 36]);
      const sb = sorteio([12, 18, 24, 36]);
      const ta: Ponto[] = [pa, [pa[0] - d[0] * sa, pa[1] - d[1] * sa]];
      const tb: Ponto[] = [pb, [pb[0] + d[0] * sb, pb[1] + d[1] * sb]];
      const pecas: Peca[] = [{ rede: corpo, nos: [noDe([x + d[0] * 12, y + d[1] * 12], corpo)] }, { rede: ra, nos: [noDe(pa, ra)] }, { rede: rb, nos: [noDe(pb, rb)] }, ...comVias(ta, ra, false, true), ...comVias(tb, rb, false, true)];
      if (!grade.tentar(pecas)) continue;
      corposRede.push({ rede: corpo, r: horizontal ? [x + 7, y - 3, 10, 6] : [x - 3, y + 7, 6, 10] });
      padsRede.push({ rede: ra, r: [pa[0] - 3, pa[1] - 3, 6, 6] });
      padsRede.push({ rede: rb, r: [pb[0] - 3, pb[1] - 3, 6, 6] });
      gravarTrilha(ta, ra, false, true);
      gravarTrilha(tb, rb, false, true);
      break;
    }
  }

  // 4. Trilhas soltas entre vias, retas ou com uma dobra de 45°, e algumas que entram pela borda direita.
  const DIRS: Ponto[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let c = 0; c < 14; c++) {
    for (let t = 0; t < 25; t++) {
      const daBorda = c < 3;
      const d: Ponto = daBorda ? [-1, 0] : sorteio(DIRS);
      const l: Ponto = [d[1], d[0]];
      const x = daBorda ? L + PASSO : grade6(660 + r() * 500);
      const y = grade6(40 + r() * 720);
      const a = daBorda ? sorteio([72, 96, 120, 144]) : sorteio([24, 36, 48, 60, 72]);
      const virar = r() < 0.6;
      const sy = r() < 0.5 ? 1 : -1;
      const dg = sorteio([18, 24, 36, 48]);
      const cauda = sorteio([12, 24, 36]);
      const g = (u: number, v: number): Ponto => [x + d[0] * u + l[0] * v, y + d[1] * u + l[1] * v];
      const pts: Ponto[] = virar ? [g(0, 0), g(a, 0), g(a + dg, sy * dg), g(a + dg + cauda, sy * dg)] : [g(0, 0), g(a, 0)];
      const rede = nova();
      if (!grade.tentar(comVias(pts, rede, !daBorda, true, daBorda))) continue;
      gravarTrilha(pts, rede, !daBorda, true);
      break;
    }
  }

  const fmt = (v: number) => String(Math.round(v * 10) / 10);
  const d = trilhas.map(({ pts }) => "M" + pts.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join("L")).join("");
  return {
    d,
    vias: viasRede.map((v) => v.p),
    pads: padsRede.map((p) => p.r),
    corpos: corposRede.map((c) => c.r),
    marcas,
    trilhas,
    viasRede,
    corposRede,
    padsRede,
    permitidos: grade.permitidos,
  };
}
