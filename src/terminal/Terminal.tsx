"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { PDF_PUBLICO } from "@/arquivos-nomes";
import { conteudo } from "@/conteudo";
import { ctfCompleto } from "@/ctf/progresso";
import { IDS_TEMAS } from "@/temas/temas";
import { alternarSom } from "@/som/controle";
import { trocarTema, temaSalvo } from "@/temas/trocar";
import { completar, executar, type Contexto, type Efeito } from "./comandos";

type Linha = { id: number; texto: string; entrada?: boolean };

const c = conteudo("pt-BR");
const lerCabecalhos = async () => {
  try {
    const r = await fetch("/", { method: "HEAD", cache: "no-store" });
    return r.headers;
  } catch {
    return null;
  }
};
const temPdf = async () => {
  try {
    return (await fetch(`/${PDF_PUBLICO}`, { method: "HEAD" })).ok;
  } catch {
    return false;
  }
};

/** Sem animação ao abrir: ação de teclado responde de imediato. */
export default function Terminal({ aberto, aoFechar, alternarChuva }: { aberto: boolean; aoFechar: () => void; alternarChuva: (pausada: boolean) => void }) {
  const roteador = useRouter();
  const [linhas, setLinhas] = useState<Linha[]>([{ id: 0, texto: c.terminal.boasVindas }]);
  const [valor, setValor] = useState("");
  const historico = useRef<string[]>([]);
  const posicao = useRef(-1);
  const proximo = useRef(1);
  const saida = useRef<HTMLDivElement>(null);
  const contexto = useMemo<Contexto>(() => ({ c, temas: [], cabecalhos: lerCabecalhos, temPdf, arquivoPdf: `/${PDF_PUBLICO}`}), []);

  useEffect(() => {
    saida.current?.scrollTo({ top: saida.current.scrollHeight });
  }, [linhas]);

  const aplicar = (e: Efeito) => {
    switch (e.tipo) {
      case "limpar":
        setLinhas([]);
        break;
      case "fechar":
        aoFechar();
        break;
      case "abrir":
        aoFechar();
        roteador.push(e.rota, { transitionTypes: ["rota"] });
        break;
      case "baixar": {
        const a = document.createElement("a");
        a.href = e.arquivo;
        a.download = "";
        a.click();
        break;
      }
      case "tema": {
        const anterior = temaSalvo();
        trocarTema(e.id);
        if (e.temporario) window.setTimeout(() => trocarTema(anterior), 10_000);
        break;
      }
      case "chuva":
        alternarChuva(e.pausada);
        break;
      case "som":
        void alternarSom(e.ligado);
        break;
    }
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const entrada = valor;
    setValor("");
    if (entrada.trim()) historico.current.unshift(entrada);
    posicao.current = -1;
    const temas = [...IDS_TEMAS.filter((t) => t !== "fosforo"), ...(ctfCompleto() ? ["fosforo"] : [])];
    const r = await executar(entrada, { ...contexto, temas });
    setLinhas((atual) => [
      ...atual,
      { id: proximo.current++, texto: `$ ${entrada}`, entrada: true },
      ...r.linhas.map((texto) => ({ id: proximo.current++, texto })),
    ]);
    if (r.efeito) aplicar(r.efeito);
  };

  const tecla = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const p = posicao.current + (e.key === "ArrowUp" ? 1 : -1);
      if (p < -1 || p >= historico.current.length) return;
      posicao.current = p;
      setValor(p === -1 ? "" : historico.current[p]);
    } else if (e.key === "Tab") {
      const achado = completar(valor);
      if (achado) {
        e.preventDefault();
        setValor(`${achado} `);
      }
    }
  };

  return (
    <Dialog.Root open={aberto} onOpenChange={(o) => !o && aoFechar()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="terminal-fundo" />
        <Dialog.Popup className="terminal" aria-label={c.terminal.titulo}>
          <Dialog.Title className="so-leitor">{c.terminal.titulo}</Dialog.Title>
          <div ref={saida} className="terminal-saida" role="log" aria-live="polite" tabIndex={0}>
            {linhas.map((l) => (
              <p key={l.id} className={l.entrada ? "terminal-entrada" : undefined}>
                {l.texto || " "}
              </p>
            ))}
          </div>
          <form className="terminal-linha" onSubmit={enviar}>
            <span aria-hidden="true">$</span>
            <input aria-label={c.terminal.rotuloEntrada} value={valor} onChange={(e) => setValor(e.target.value)} onKeyDown={tecla} autoComplete="off" autoCapitalize="off" spellCheck={false} autoFocus enterKeyHint="send" />
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
