"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sigilo animado ao confirmar um selo. Fica fora do terminal, que não anima.
 * `lottie_light` não usa `eval`: passa pela CSP. Sem movimento reduzido, o traço se desenha; com ele, aparece pronto.
 */
export function SeloToast() {
  const [selo, setSelo] = useState<number | null>(null);
  const caixa = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const aoSelo = (e: Event) => setSelo((e as CustomEvent<{ indice: number }>).detail.indice);
    addEventListener("nave:selo", aoSelo);
    return () => removeEventListener("nave:selo", aoSelo);
  }, []);
  useEffect(() => {
    if (selo === null || !caixa.current) return;
    let anim: { destroy: () => void; goToAndStop: (v: number, q: boolean) => void; totalFrames: number } | null = null;
    let cancelado = false;
    (async () => {
      const [{ default: lottie }, dados] = await Promise.all([import("lottie-web/build/player/lottie_light"), fetch(`/gl/selos/selo-${selo}.json`).then((r) => r.json())]);
      if (cancelado || !caixa.current) return;
      const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
      anim = lottie.loadAnimation({ container: caixa.current, renderer: "svg", loop: false, autoplay: !reduzido, animationData: dados });
      if (reduzido) anim!.goToAndStop(anim!.totalFrames - 1, true);
    })();
    const t = window.setTimeout(() => setSelo(null), 2600);
    return () => {
      cancelado = true;
      window.clearTimeout(t);
      anim?.destroy();
    };
  }, [selo]);
  if (selo === null) return null;
  return <div ref={caixa} className="selo-sigilo" aria-hidden="true" />;
}
