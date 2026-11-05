"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { estadoCena, reduzido } from "@/movimento/estado";

gsap.registerPlugin(DrawSVGPlugin);

type No = { x: number; y: number; nivel: number };
type Ramo = { d: string; nivel: number; de: number; para: number };
type Textos = { grupo: string; instrucao: string; olt: string; divisor: string; onu: string; painel: string; completa: string; reiniciar: string };
type Props = { nos: No[]; ramos: Ramo[]; textos: Textos };

const CHAVE = "divisor";
const PETALAS = 8;

function carregar(): number[] {
  try {
    const v = JSON.parse(sessionStorage.getItem(CHAVE) ?? "[0]");
    return Array.isArray(v) ? v : [0];
  } catch {
    return [0];
  }
}

/**
 * A coisa viva do site: luz saindo da OLT e se dividindo até as oito ONUs.
 * É uma ilustração: não há potência, clientes nem alarmes, e a legenda diz isso sempre.
 */
export default function Divisor({ nos, ramos, textos }: Props) {
  const [acesos, setAcesos] = useState<number[]>([0]);
  const [aviso, setAviso] = useState("");
  const caixa = useRef<HTMLDivElement>(null);

  const filhos = useMemo(() => {
    const m = new Map<number, number[]>();
    ramos.forEach((r) => m.set(r.de, [...(m.get(r.de) ?? []), r.para]));
    return m;
  }, [ramos]);
  const pai = useMemo(() => new Map(ramos.map((r) => [r.para, r.de])), [ramos]);
  const folhas = useMemo(() => nos.flatMap((n, i) => (n.nivel === 3 ? [i] : [])), [nos]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessão só existe no navegador
    setAcesos(carregar());
  }, []);

  const qtdFolhas = acesos.filter((i) => folhas.includes(i)).length;
  const completa = qtdFolhas === PETALAS;

  useEffect(() => {
    try {
      sessionStorage.setItem(CHAVE, JSON.stringify(acesos));
    } catch {}
    estadoCena.corDivisor = completa ? 1 : 0;
    estadoCena.sujo = 60;
  }, [acesos, completa]);

  const acender = useCallback(
    (alvos: number[]) => {
      setAcesos((atual) => {
        const novos = alvos.filter((i) => !atual.includes(i));
        if (!novos.length) return atual;
        const lista = [...atual, ...novos];
        const total = lista.filter((i) => folhas.includes(i)).length;
        if (novos.some((i) => folhas.includes(i))) {
          setAviso(total === PETALAS ? textos.completa : textos.painel.replace("{n}", String(total)).replace("{t}", String(PETALAS)));
        }
        // O pulso corre só pelos ramos novos. Sem movimento reduzido, nada se move: acende na hora.
        if (!reduzido()) {
          requestAnimationFrameSeguro(() => {
            for (const i of novos) {
              const ramo = caixa.current?.querySelector<SVGPathElement>(`[data-para="${i}"]`);
              if (ramo) gsap.fromTo(ramo, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.42, ease: "power2.out" });
              const circulo = caixa.current?.querySelector<SVGCircleElement>(`[data-no="${i}"]`);
              if (circulo) gsap.fromTo(circulo, { scale: 0.3, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, delay: 0.3, ease: "elastic.out(1,0.5)" });
            }
          });
        }
        return lista;
      });
    },
    [folhas, textos],
  );

  const tocar = (i: number) => {
    if (acesos.includes(i)) {
      acender(filhos.get(i) ?? []);
      return;
    }
    const p = pai.get(i);
    if (p !== undefined && acesos.includes(p)) acender([i]);
  };

  const teclado = (e: React.KeyboardEvent, i: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const ordem = nos.map((_, k) => k).sort((a, b) => nos[a].nivel - nos[b].nivel || nos[a].x - nos[b].x);
    const pos = ordem.indexOf(i);
    const delta = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
    const proximo = ordem[(pos + delta + ordem.length) % ordem.length];
    caixa.current?.querySelector<HTMLButtonElement>(`[data-botao="${proximo}"]`)?.focus();
  };

  const nomeDe = (n: No) => (n.nivel === 0 ? textos.olt : n.nivel === 3 ? textos.onu : textos.divisor);

  return (
    <div ref={caixa} className="divisor" role="group" aria-label={textos.grupo}>
      <svg className="divisor-luz" viewBox="-2 -2 104 104" aria-hidden="true" focusable="false">
        {ramos.map((r) =>
          acesos.includes(r.para) ? <path key={r.para} data-para={r.para} d={r.d} /> : null,
        )}
        {nos.map((n, i) => (acesos.includes(i) ? <circle key={i} data-no={i} cx={n.x} cy={n.y} r={n.nivel === 0 ? 2.8 : n.nivel === 3 ? 1.9 : 1.5} /> : null))}
      </svg>
      <svg className="divisor-janela" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false" data-completa={completa ? "sim" : "nao"}>
        <circle r="48" className="divisor-aro" />
        {Array.from({ length: PETALAS }, (_, i) => {
          const a = (i / PETALAS) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={(Math.cos(a) * 30).toFixed(3)} cy={(Math.sin(a) * 30).toFixed(3)} r="12.5" className={i < qtdFolhas ? "petala acesa" : "petala"} />;
        })}
        <circle r="9" className={completa ? "petala acesa" : "petala"} />
      </svg>
      {nos.map((n, i) => {
        const alcancavel = acesos.includes(i) || (pai.get(i) !== undefined && acesos.includes(pai.get(i)!));
        return (
          <button
            key={i}
            type="button"
            data-botao={i}
            className="divisor-no"
            style={{ left: `${((n.x + 2) / 104) * 100}%`, top: `${((n.y + 2) / 104) * 100}%` }}
            aria-label={`${nomeDe(n)} ${i + 1}`}
            aria-pressed={acesos.includes(i)}
            disabled={!alcancavel}
            onClick={() => tocar(i)}
            onKeyDown={(e) => teclado(e, i)}
          />
        );
      })}
      <p className="legenda divisor-ajuda">{textos.instrucao}</p>
      {acesos.length > 1 ? (
        <button type="button" className="filtro divisor-reiniciar" onClick={() => setAcesos([0])}>
          {textos.reiniciar}
        </button>
      ) : null}
      <p className="so-leitor" aria-live="polite">
        {aviso}
      </p>
    </div>
  );
}

const requestAnimationFrameSeguro = (f: () => void) => gsap.delayedCall(0, f);
