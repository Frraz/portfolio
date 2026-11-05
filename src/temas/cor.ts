/** Utilitários de cor usados pelos scripts, pelos testes e pela cena. */
const canal = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
export const paraRgb = (h: string): [number, number, number] => [canal(h, 1), canal(h, 3), canal(h, 5)];
const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const paraLinear = (h: string): [number, number, number] => {
  const [r, g, b] = paraRgb(h);
  return [linear(r), linear(g), linear(b)];
};
export function luminancia(h: string) {
  const [r, g, b] = paraLinear(h);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contraste(a: string, b: string) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
export function mistura(topo: string, base: string, alfa: number) {
  const t = paraRgb(topo);
  const b = paraRgb(base);
  const c = t.map((v, i) => Math.round((alfa * v + (1 - alfa) * b[i]) * 255));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}
export function paraOklch(h: string) {
  const [r, g, b] = paraLinear(h);
  const cbrt = (v: number) => Math.cbrt(v);
  const l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  const H = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})`;
}
