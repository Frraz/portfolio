import { IDS_TEMAS, TEMAS, TEMA_PADRAO } from "./temas";

const reduzido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function temaSalvo() {
  return document.documentElement.dataset.tema ?? TEMA_PADRAO;
}

/** Troca o tema com View Transition quando houver. A cor da chuva tem sua própria transição, de 800 ms. */
export function trocarTema(id: string) {
  if (!(IDS_TEMAS as string[]).includes(id)) return;
  const aplicar = () => {
    document.documentElement.dataset.tema = id;
    const cor = TEMAS.find((t) => t.id === id)?.cores.fundo;
    if (cor) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", cor);
  };
  try {
    localStorage.setItem("tema", id);
  } catch {}
  if (document.startViewTransition && !reduzido()) document.startViewTransition(aplicar);
  else aplicar();
}
