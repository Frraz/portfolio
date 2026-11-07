"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Parâmetro da URL e seletor do grupo filtrado. */
  grupo: string;
  rotulo: string;
  opcoes: Record<string, string>;
};

function aplicar(grupo: string, valor: string) {
  const alvo = document.querySelector(`[data-grupo-filtro="${grupo}"]`);
  if (!alvo) return 0;
  alvo.querySelectorAll<HTMLElement>("[data-areas]").forEach((el) => {
    const areas = (el.dataset.areas ?? "").split(" ");
    el.dataset.oculto = valor === "todas" || areas.includes(valor) ? "nao" : "sim";
  });
  alvo.querySelectorAll<HTMLElement>("[data-fileira]").forEach((f) => {
    f.dataset.vazia = f.querySelector('[data-areas]:not([data-oculto="sim"])') ? "nao" : "sim";
  });
  return alvo.querySelectorAll('[data-areas]:not([data-oculto="sim"])').length;
}

/** Reordenação com Motion: cada item parte de onde estava. O filtro funciona igual sem ela. */
async function reordenar(alvo: Element, antes: Map<Element, DOMRect>) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const visiveis = [...alvo.querySelectorAll<HTMLElement>('[data-areas]:not([data-oculto="sim"])')].filter((el) => el.offsetParent !== null && el.nodeName !== "path").slice(0, 40);
  const depois = visiveis.map((el) => [el, el.getBoundingClientRect()] as const);
  const { animate } = await import("motion");
  for (const [el, r] of depois) {
    const a = antes.get(el);
    if (a && a.width > 0) animate(el, { x: [a.left - r.left, 0], y: [a.top - r.top, 0] }, { duration: 0.24, ease: [0.16, 1, 0.3, 1] });
    else animate(el, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.24, ease: [0.16, 1, 0.3, 1] });
  }
}

/**
 * O HTML já traz todos os itens: sem JavaScript nada se perde.
 * O filtro só marca o que esconder, e fica na URL para poder ser compartilhado.
 */
export function Filtro({ grupo, rotulo, opcoes }: Props) {
  const [valor, setValor] = useState("todas");

  useEffect(() => {
    const inicial = new URLSearchParams(location.search).get(grupo);
    if (inicial && inicial in opcoes) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- URL só existe no navegador
      setValor(inicial);
      aplicar(grupo, inicial);
    }
  }, [grupo, opcoes]);

  const escolher = (novo: string) => {
    setValor(novo);
    const alvo = document.querySelector(`[data-grupo-filtro="${grupo}"]`);
    const antes = new Map<Element, DOMRect>();
    alvo?.querySelectorAll("[data-areas]").forEach((el) => antes.set(el, el.getBoundingClientRect()));
    const visiveis = aplicar(grupo, novo);
    if (alvo) void reordenar(alvo, antes);
    dispatchEvent(new CustomEvent("nave:filtro", { detail: { grupo, visiveis } }));
    const url = new URL(location.href);
    if (novo === "todas") url.searchParams.delete(grupo);
    else url.searchParams.set(grupo, novo);
    history.replaceState(null, "", url);
  };

  return (
    <div className="filtros" role="group" aria-label={rotulo}>
      {Object.entries(opcoes).map(([id, nome]) => (
        <button key={id} type="button" className="filtro" aria-pressed={valor === id} onClick={() => escolher(id)}>
          {nome}
        </button>
      ))}
    </div>
  );
}
