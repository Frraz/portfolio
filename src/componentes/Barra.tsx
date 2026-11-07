"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Pause, Play } from "lucide-react";
import { SeloToast } from "./SeloToast";

type Secao = { id: string; rotulo: string; numero: number };
type Props = { nome: string; secoes: Secao[]; ui: Record<string, string> };

// Menus só entram depois da pintura: Base UI não pesa no JavaScript inicial.
const BarraMenus = dynamic(() => import("./BarraMenus"), { ssr: false });
const Terminal = dynamic(() => import("@/terminal/Terminal"), { ssr: false });

export function Barra({ nome, secoes, ui }: Props) {
  const rota = usePathname();
  const naInicial = rota === "/";
  const [atual, setAtual] = useState("inicio");
  const lista = useRef<HTMLUListElement>(null);
  const [pausada, setPausada] = useState(false);
  const [terminal, setTerminal] = useState(false);
  const [terminalUsado, setTerminalUsado] = useState(false);
  const [somLigado, setSomLigado] = useState(false);
  const prefixo = naInicial ? "" : "/";

  const abrirTerminal = () => {
    setTerminalUsado(true);
    setTerminal(true);
  };

  // Atalhos do terminal. Sem animação: ação de teclado responde de imediato.
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      const digitando = alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        abrirTerminal();
      } else if (e.key === "`" && !digitando) {
        e.preventDefault();
        abrirTerminal();
      }
    };
    addEventListener("keydown", tecla);
    const aoSom = (e: Event) => setSomLigado((e as CustomEvent<boolean>).detail);
    addEventListener("nave:som", aoSom);
    // Service worker: só na compilação de produção. Sem ele, o site funciona igual.
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => {
      removeEventListener("keydown", tecla);
      removeEventListener("nave:som", aoSom);
    };
  }, []);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- preferência só existe no navegador
      setPausada(localStorage.getItem("chuva") === "pausada");
    } catch {}
  }, []);

  useEffect(() => {
    if (!naInicial) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setAtual(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secoes.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [naInicial, secoes]);

  // A lente de vidro desliza até o link da seção atual. Mede o link e entrega o deslocamento por variáveis de CSS.
  useEffect(() => {
    const ul = lista.current;
    if (!ul) return;
    const posicionar = () => {
      const link = ul.querySelector<HTMLElement>('.barra-link[aria-current="true"]');
      if (!link) return ul.style.setProperty("--lente-o", "0");
      ul.style.setProperty("--lente-x", `${link.offsetLeft}px`);
      ul.style.setProperty("--lente-l", `${link.offsetWidth}px`);
      ul.style.setProperty("--lente-o", "1");
    };
    posicionar();
    const ro = new ResizeObserver(posicionar);
    ro.observe(ul);
    return () => ro.disconnect();
  }, [atual, naInicial]);

  const alternarChuva = (forcar?: boolean) => {
    const nova = forcar ?? !pausada;
    setPausada(nova);
    try {
      localStorage.setItem("chuva", nova ? "pausada" : "ligada");
    } catch {}
    dispatchEvent(new CustomEvent("nave:chuva", { detail: nova }));
  };

  const alternarSomBarra = async () => {
    const { alternarSom } = await import("@/som/controle");
    await alternarSom(!somLigado);
  };

  return (
    <header className="barra sem-impressao">
      <Link transitionTypes={["rota"]} href="/" className="barra-nome">
        {nome}
      </Link>
      <nav aria-label={ui.navegacao}>
        <ul className="barra-links vidro" ref={lista}>
          {secoes
            .filter((s) => s.id !== "inicio")
            .map((s) => (
              <li key={s.id}>
                <a className="barra-link" href={`${prefixo}#${s.id}`} aria-current={naInicial && atual === s.id ? "true" : undefined}>
                  {s.rotulo}
                </a>
              </li>
            ))}
        </ul>
      </nav>
      <div className="barra-acoes vidro">
        <Link transitionTypes={["rota"]} className="botao-quieto" href="/cv">
          {ui.curriculo}
        </Link>
        {naInicial ? (
          <button type="button" className="botao-quieto sem-js-oculto so-largo" aria-pressed={pausada} aria-label={pausada ? ui.ligarChuva : ui.pausarChuva} title={pausada ? ui.ligarChuva : ui.pausarChuva} onClick={() => alternarChuva()}>
            {pausada ? <Play size={16} strokeWidth={1.5} aria-hidden="true" /> : <Pause size={16} strokeWidth={1.5} aria-hidden="true" />}
          </button>
        ) : null}
        <BarraMenus secoes={secoes} ui={ui} prefixo={prefixo} naInicial={naInicial} pausada={pausada} alternarChuva={() => alternarChuva()} somLigado={somLigado} alternarSomBarra={alternarSomBarra} abrirTerminal={abrirTerminal} />
      </div>
      {terminalUsado ? <Terminal aberto={terminal} aoFechar={() => setTerminal(false)} alternarChuva={alternarChuva} /> : null}
      <SeloToast />
    </header>
  );
}
