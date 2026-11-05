/** Recompensa do CTF: o coelho branco atravessa a coluna de chuva uma vez. Silhueta própria. */
import gsap from "gsap";

const SILHUETA =
  '<svg viewBox="0 0 40 32" width="40" height="32" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 4c1-3 3-4 4-2l1 6c2-1 4-1 5 0l1-6c1-2 3-1 3 2l-1 7c8-3 16 1 17 9 0 6-4 10-10 10H16c-5 0-7-3-6-6-3 0-6-3-5-8 0-2 2-4 3-5Z"/></svg>';

export function coelhoBranco() {
  const el = document.createElement("div");
  el.className = "coelho";
  el.innerHTML = SILHUETA;
  document.body.appendChild(el);
  const passos = 9;
  const linha = gsap.timeline({ onComplete: () => el.remove() });
  gsap.set(el, { x: -60, y: innerHeight * 0.82 });
  for (let i = 0; i < passos; i++) {
    const x = -60 + ((innerWidth + 120) * (i + 1)) / passos;
    linha.to(el, { x, duration: 0.5, ease: "none" }, i * 0.5);
    linha.to(el, { y: innerHeight * 0.82 - 26, duration: 0.22, ease: "power2.out" }, i * 0.5);
    linha.to(el, { y: innerHeight * 0.82, duration: 0.24, ease: "power2.in" }, i * 0.5 + 0.24);
  }
}
