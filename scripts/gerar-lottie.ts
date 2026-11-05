/** Gera nove sigilos em Lottie: aro e pétalas desenhados com trim path, um para cada selo. Sem editor visual. */
import { mkdirSync, writeFileSync } from "node:fs";

const QUADROS = 60;
const OURO = [0.824, 0.663, 0.306, 1];

const estatico = (k: unknown) => ({ a: 0, k });
const circulo = (x: number, y: number, d: number) => ({ ty: "el", p: estatico([x, y]), s: estatico([d, d]) });
const traco = (largura: number) => ({ ty: "st", c: estatico(OURO), o: estatico(100), w: estatico(largura), lc: 2, lj: 2 });
const corte = (ini: number, fim: number) => ({
  ty: "tm",
  s: estatico(0),
  e: { a: 1, k: [{ t: ini, s: [0], o: { x: [0.3], y: [0] }, i: { x: [0.1], y: [1] } }, { t: fim, s: [100] }] },
  o: estatico(0),
  m: 1,
});
const grupo = (itens: unknown[]) => ({ ty: "gr", it: [...itens, { ty: "tr", p: estatico([0, 0]), a: estatico([0, 0]), s: estatico([100, 100]), r: estatico(0), o: estatico(100) }] });

function sigilo(indice: number) {
  const petalas = indice + 3; // de 3 a 11: cada selo tem o seu desenho
  const formas = [grupo([circulo(50, 50, 88), corte(0, 28), traco(2)]), grupo([circulo(50, 50, 18), corte(10, 30), traco(1.5)])];
  for (let i = 0; i < petalas; i++) {
    const a = (i / petalas) * Math.PI * 2 - Math.PI / 2;
    const ini = 16 + (i / petalas) * 22;
    formas.push(grupo([circulo(50 + Math.cos(a) * 28, 50 + Math.sin(a) * 28, 32 - petalas), corte(ini, ini + 16), traco(1.25)]));
  }
  return {
    v: "5.9.0",
    fr: 60,
    ip: 0,
    op: QUADROS,
    w: 100,
    h: 100,
    nm: `selo-${indice}`,
    ddd: 0,
    assets: [],
    layers: [{ ddd: 0, ind: 1, ty: 4, nm: "sigilo", sr: 1, ks: { o: estatico(100), r: estatico(0), p: estatico([0, 0, 0]), a: estatico([0, 0, 0]), s: estatico([100, 100, 100]) }, ao: 0, shapes: formas, ip: 0, op: QUADROS, st: 0, bm: 0 }],
  };
}

mkdirSync("public/gl/selos", { recursive: true });
for (let i = 0; i < 9; i++) writeFileSync(`public/gl/selos/selo-${i}.json`, JSON.stringify(sigilo(i)));
console.log("Sigilos: 9 arquivos Lottie gerados.");
