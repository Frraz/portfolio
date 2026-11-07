import { describe, expect, it } from "vitest";
import { A, L, placa, type Ponto, type Retangulo } from "../../scripts/trilhas/placa";

/** Distância entre dois segmentos no plano (0 se eles se cruzam). */
function distSeg(a: Ponto, b: Ponto, c: Ponto, d: Ponto) {
  const cruza = (p: Ponto, q: Ponto, r: Ponto) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  const d1 = cruza(a, b, c);
  const d2 = cruza(a, b, d);
  const d3 = cruza(c, d, a);
  const d4 = cruza(c, d, b);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return 0;
  return Math.min(distPonto(c, a, b), distPonto(d, a, b), distPonto(a, c, d), distPonto(b, c, d));
}
function distPonto(p: Ponto, a: Ponto, b: Ponto) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
function distRet(p: Ponto, [x, y, w, h]: Retangulo) {
  const dx = Math.max(x - p[0], 0, p[0] - (x + w));
  const dy = Math.max(y - p[1], 0, p[1] - (y + h));
  return Math.hypot(dx, dy);
}
const segmentos = (pts: Ponto[]) => pts.slice(1).map((p, i) => [pts[i], p] as const);

describe.each(["inicio", "trajetoria", "certificados"])("placa %s", (nome) => {
  const g = placa(nome);
  const separadas = (a: number, b: number) => a !== b && !g.permitidos.has(a < b ? `${a}|${b}` : `${b}|${a}`);

  it("é determinística", () => {
    expect(placa(nome).d).toBe(g.d);
  });

  it("tem componentes, trilhas e vias", () => {
    expect(g.corpos.length).toBeGreaterThanOrEqual(4);
    expect(g.trilhas.length).toBeGreaterThanOrEqual(15);
    expect(g.vias.length).toBeGreaterThanOrEqual(10);
  });

  it("nenhuma trilha cruza ou encosta em trilha de outra rede", () => {
    let menor = Infinity;
    for (let i = 0; i < g.trilhas.length; i++)
      for (let j = i + 1; j < g.trilhas.length; j++) {
        if (!separadas(g.trilhas[i].rede, g.trilhas[j].rede)) continue;
        for (const [a, b] of segmentos(g.trilhas[i].pts)) for (const [c, d] of segmentos(g.trilhas[j].pts)) menor = Math.min(menor, distSeg(a, b, c, d));
      }
    expect(menor).toBeGreaterThanOrEqual(8);
  });

  it("vias ficam longe de trilhas e vias de outras redes", () => {
    for (const v of g.viasRede) {
      for (const t of g.trilhas) if (separadas(v.rede, t.rede)) for (const [a, b] of segmentos(t.pts)) expect(distPonto(v.p, a, b)).toBeGreaterThanOrEqual(8);
      for (const w of g.viasRede) if (separadas(v.rede, w.rede)) expect(Math.hypot(v.p[0] - w.p[0], v.p[1] - w.p[1])).toBeGreaterThanOrEqual(12);
    }
  });

  it("trilhas e vias não passam sobre corpos de componentes", () => {
    for (const c of g.corposRede) {
      for (const v of g.viasRede) if (separadas(v.rede, c.rede)) expect(distRet(v.p, c.r)).toBeGreaterThanOrEqual(6);
      for (const t of g.trilhas) {
        if (!separadas(t.rede, c.rede)) continue;
        for (const [a, b] of segmentos(t.pts)) {
          const passos = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2);
          for (let s = 0; s <= passos; s++) {
            const p: Ponto = [a[0] + ((b[0] - a[0]) * s) / passos, a[1] + ((b[1] - a[1]) * s) / passos];
            expect(distRet(p, c.r)).toBeGreaterThanOrEqual(6);
          }
        }
      }
    }
  });

  it("tudo fica na área útil, exceto as trilhas que saem pela borda de propósito", () => {
    for (const v of g.vias) {
      expect(v[0]).toBeGreaterThanOrEqual(24);
      expect(v[0]).toBeLessThanOrEqual(L - 24);
      expect(v[1]).toBeGreaterThanOrEqual(24);
      expect(v[1]).toBeLessThanOrEqual(A - 24);
    }
    for (const [x, y, w, h] of [...g.corpos, ...g.pads]) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x + w).toBeLessThanOrEqual(L);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y + h).toBeLessThanOrEqual(A);
    }
    // Nada vai para a esquerda além da metade: lá fica o texto.
    for (const t of g.trilhas) for (const [x] of t.pts) expect(x).toBeGreaterThanOrEqual(24);
  });
});
