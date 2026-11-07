"use client";

/**
 * Dados dos cantos de baixo da moldura. Cada valor é real: seção, rolagem, FPS, nível de qualidade e tema.
 * Atualiza por refs a partir do ticker do GSAP, o único relógio do site. Sem re-render por quadro.
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { hud } from "@/movimento/estado";

type Props = { secoes: { id: string; rotulo: string }[]; ui: Record<string, string> };

const NOME_TEMA: Record<string, string> = { rubro: "temaRubro", claro: "temaClaro", fosforo: "temaFosforo" };

export default function MolduraDados({ secoes, ui }: Props) {
  const secao = useRef<HTMLSpanElement>(null);
  const rolagem = useRef<HTMLSpanElement>(null);
  const fps = useRef<HTMLSpanElement>(null);
  const nivel = useRef<HTMLSpanElement>(null);
  const tema = useRef<HTMLSpanElement>(null);
  const atual = useRef(secoes[0]?.id ?? "");

  useEffect(() => {
    // Seção atual: a que cruza o centro da tela.
    const obs = new IntersectionObserver(
      (itens) => {
        for (const i of itens) if (i.isIntersecting) atual.current = i.target.id;
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const s of secoes) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }

    let acumulado = 0;
    let quadros = 0;
    let ultimoY = -1;
    const escrever = (el: HTMLElement | null, txt: string) => {
      if (el && el.textContent !== txt) el.textContent = txt;
    };
    const pulso = (_t: number, delta: number) => {
      quadros++;
      acumulado += delta;
      const y = Math.round(scrollY);
      if (y !== ultimoY) {
        ultimoY = y;
        escrever(rolagem.current, `y ${y}`);
        escrever(secao.current, secoes.find((s) => s.id === atual.current)?.id ?? "");
      }
      // FPS, nível e tema mudam pouco: a cada 500 ms bastam.
      if (acumulado >= 500) {
        escrever(fps.current, `${Math.round((quadros * 1000) / acumulado)} ${ui.molduraFps}`);
        escrever(nivel.current, hud.nivel || "—");
        const t = document.documentElement.dataset.tema ?? "";
        escrever(tema.current, ui[NOME_TEMA[t]]?.toLowerCase() ?? t);
        acumulado = 0;
        quadros = 0;
      }
    };
    gsap.ticker.add(pulso);
    return () => {
      gsap.ticker.remove(pulso);
      obs.disconnect();
    };
  }, [secoes, ui]);

  return (
    <>
      <span className="moldura-canto moldura-ie">
        <span className="dado" ref={secao}>
          {secoes[0]?.id}
        </span>
        <span className="dado" ref={rolagem}>
          y 0
        </span>
      </span>
      <span className="moldura-canto moldura-id">
        <span className="dado" ref={fps}>
          0 {ui.molduraFps}
        </span>
        <span className="dado" ref={nivel}>
          —
        </span>
        <span className="dado" ref={tema} />
      </span>
    </>
  );
}
