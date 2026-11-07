/**
 * Rolagem programática, sem importar Lenis nem GSAP: este módulo entra no JavaScript inicial.
 * Quando o relógio liga o Lenis (src/movimento/relogio.ts), ele se registra aqui e a rolagem fica suave.
 * Sem Lenis (movimento reduzido ou antes de o movimento carregar), usa a rolagem nativa.
 */
type Rolador = { scrollTo: (alvo: number | HTMLElement, opcoes?: { duration?: number; immediate?: boolean }) => void };

let rolador: Rolador | null = null;

export const registrarRolador = (r: Rolador | null) => {
  rolador = r;
};

const reduzido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Rola até um seletor, um elemento ou uma posição em pixels (0 é o topo). */
export function rolarPara(alvo: number | string | HTMLElement) {
  const el = typeof alvo === "string" ? document.querySelector<HTMLElement>(alvo) : alvo;
  if (el === null) return;
  if (rolador) return rolador.scrollTo(el, { duration: 1.2 });
  if (typeof el === "number") window.scrollTo({ top: el, behavior: reduzido() ? "auto" : "smooth" });
  else el.scrollIntoView({ behavior: reduzido() ? "auto" : "smooth" });
}
