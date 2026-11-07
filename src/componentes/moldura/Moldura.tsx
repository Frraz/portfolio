"use client";

/**
 * Moldura de instrumento (docs/05). Cada valor é real: hora de Rondon do Pará, rolagem, seção, FPS e nível.
 * Atualiza por refs a partir do ticker do GSAP, o único relógio do site. Sem re-render por quadro.
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { hud } from "@/movimento/estado";
import { registrar } from "@/movimento/registro";

type Props = { secoes: { id: string; rotulo: string }[]; ui: Record<string, string> };

const hora = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Belem", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
const NOME_TEMA: Record<string, string> = { rubro: "temaRubro", claro: "temaClaro", fosforo: "temaFosforo" };

export function Moldura({ secoes, ui }: Props) {
  const relogio = useRef<HTMLSpanElement>(null);
  const cena = useRef<HTMLSpanElement>(null);
  const secao = useRef<HTMLSpanElement>(null);
  const rolagem = useRef<HTMLSpanElement>(null);
  const fps = useRef<HTMLSpanElement>(null);
  const nivel = useRef<HTMLSpanElement>(null);
  const tema = useRef<HTMLSpanElement>(null);
  const atual = useRef(secoes[0]?.id ?? "");

  // Passos reais de carregamento desta visita, para o boot log e o registro da sessão.
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav) registrar("info", ui.bootHtml, nav.responseEnd);
    document.fonts.ready.then(() => registrar("info", ui.bootFontes));
  }, [ui]);

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
    let ultimaHora = "";
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
      // Hora e demais células mudam pouco: a cada 500 ms bastam, o relógio só quando o segundo vira.
      if (acumulado >= 500) {
        const h = hora.format(new Date());
        if (h !== ultimaHora) {
          ultimaHora = h;
          escrever(relogio.current, h);
        }
        escrever(fps.current, `${Math.round((quadros * 1000) / acumulado)} ${ui.molduraFps}`);
        escrever(nivel.current, hud.nivel || "—");
        escrever(cena.current, `${ui.molduraCena} ${hud.cena === "ativa" ? ui.cenaAtiva : hud.cena === "estatica" ? ui.cenaEstatica : ui.cenaCarregando}`);
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
    <div className="moldura" aria-hidden="true">
      <span className="moldura-canto moldura-se">
        <span className="dado">{ui.molduraId}</span>
        <span className="dado" ref={cena}>
          {ui.molduraCena} {ui.cenaCarregando}
        </span>
      </span>
      <span className="moldura-canto moldura-sd">
        <span className="dado" ref={relogio}>
          --:--:--
        </span>
        <span className="dado">{ui.molduraFuso}</span>
      </span>
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
    </div>
  );
}
