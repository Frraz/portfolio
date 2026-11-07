"use client";

/** Régua de progresso na borda direita: desce com a rolagem. Duplica a navegação real (docs/05). */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { rolarPara } from "@/movimento/relogio";

type Props = { secoes: { id: string; rotulo: string }[]; rotulo: string };

export function Regua({ secoes, rotulo }: Props) {
  const marca = useRef<HTMLSpanElement>(null);
  const trilho = useRef<HTMLSpanElement>(null);
  const [posicoes, setPosicoes] = useState<number[]>([]);

  useEffect(() => {
    // Posição de cada seção como fração da altura do documento. Recalculada ao redimensionar.
    const medir = () => {
      const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      // Uma marcação a cada 100 px de rolagem do documento: o passo vem da altura real.
      trilho.current?.style.setProperty("--passo", `${((100 / total) * 100).toFixed(4)}%`);
      setPosicoes(secoes.map((s) => Math.min(1, Math.max(0, (document.getElementById(s.id)?.offsetTop ?? 0) / total))));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(document.body);
    let ultimo = -1;
    const pulso = () => {
      const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const f = Math.min(1, Math.max(0, scrollY / total));
      if (f !== ultimo && marca.current) {
        ultimo = f;
        marca.current.style.transform = `translateY(${(f * 100).toFixed(2)}cqh)`;
      }
    };
    gsap.ticker.add(pulso);
    return () => {
      gsap.ticker.remove(pulso);
      ro.disconnect();
    };
  }, [secoes]);

  return (
    // Puramente visual: a navegação de verdade é a barra. Por isso fica fora da árvore de acessibilidade e do foco por teclado.
    <div className="regua" aria-hidden="true" data-rotulo={rotulo}>
      <span className="regua-trilho" aria-hidden="true" ref={trilho}>
        <span className="regua-marca" ref={marca} />
      </span>
      {secoes.map((s, i) => (
        <a key={s.id} href={`#${s.id}`} tabIndex={-1} className="regua-traco" style={{ top: `${(posicoes[i] ?? i / secoes.length) * 100}%` }} onClick={(e) => { e.preventDefault(); rolarPara(`#${s.id}`); }}>
          <span className="regua-nome">{s.rotulo}</span>
        </a>
      ))}
    </div>
  );
}
