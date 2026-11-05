/** Caminho da câmera pela nave. `t` = seção + progresso. Sem cena: só números, para poder ser testado. */
export type Quadro = { t: number; pos: [number, number, number]; alvo: [number, number, number] };

export const QUADROS: Quadro[] = [
  { t: -1, pos: [0, 4.5, 6], alvo: [0, 6.5, -20] },
  { t: 0, pos: [0.6, 3.1, 3], alvo: [-0.4, 6.2, -26] },
  { t: 1, pos: [1.4, 3.0, -4], alvo: [-1.2, 6.8, -28] },
  { t: 2, pos: [1.2, 2.8, -9], alvo: [-0.8, 6.0, -34] },
  { t: 3, pos: [0.6, 2.7, -34], alvo: [0.1, 5.2, -62] }, // Formação: as janelas ficam ao longe, a informação está no DOM
  { t: 3.6, pos: [0, 3.0, -38], alvo: [0.3, 6.0, -62] },
  { t: 4.1, pos: [-1.2, 2.8, -42], alvo: [0.4, 12, -26] }, // Competências: o olhar sobe para as nervuras
  { t: 5, pos: [-1.8, 2.6, -44], alvo: [1.2, 13.5, -26] },
  { t: 6, pos: [-1.2, 2.6, -36], alvo: [-1.6, 4.2, -18] },
  { t: 6.3, pos: [-1.0, 2.2, -28], alvo: [13, 6.2, 7] }, // Contato: a câmera se vira para o portal, à direita do texto
  { t: 8, pos: [-1.0, 2.2, -18], alvo: [13, 6.2, 7] },
];

const suave = (x: number) => x * x * (3 - 2 * x);

export function amostrar(t: number, pos: number[], alvo: number[]) {
  const n = QUADROS.length;
  let i = 0;
  while (i < n - 2 && t > QUADROS[i + 1].t) i++;
  const a = QUADROS[i];
  const b = QUADROS[i + 1];
  const f = suave(Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))));
  for (let k = 0; k < 3; k++) {
    pos[k] = a.pos[k] + (b.pos[k] - a.pos[k]) * f;
    alvo[k] = a.alvo[k] + (b.alvo[k] - a.alvo[k]) * f;
  }
}
