/**
 * Relógio único: o ticker do GSAP conduz Lenis, ScrollTrigger e a cena. Decisão 11 em docs/decisoes.md.
 * Sem `requestAnimationFrame` paralelo. Com movimento reduzido, não há rolagem suave.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { reduzido } from "./estado";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
const pulso = (tempo: number) => lenis?.raf(tempo * 1000);

export function ligarRelogio() {
  gsap.ticker.lagSmoothing(0);
  if (reduzido()) return () => {};
  // O Lenis já respeita o scroll-padding do CSS: nenhum deslocamento extra para a barra fixa.
  lenis = new Lenis({ autoRaf: false, lerp: 0.12, anchors: { duration: 1.2 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(pulso);
  return () => {
    gsap.ticker.remove(pulso);
    lenis?.destroy();
    lenis = null;
  };
}

export const rolarPara = (alvo: string | HTMLElement) => {
  const el = typeof alvo === "string" ? document.querySelector<HTMLElement>(alvo) : alvo;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.2 });
  else el.scrollIntoView();
};
