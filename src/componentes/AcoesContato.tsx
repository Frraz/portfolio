"use client";

import { useEffect, useRef, useState } from "react";
import { IconeCopiar, IconeMensagem } from "./Icones";

type Textos = { copiar: string; copiado: string; copiarFalha: string; mostrarWhatsapp: string };

export function CopiarEmail({ email, textos }: { email: string; textos: Textos }) {
  const [aviso, setAviso] = useState("");
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setAviso(textos.copiado);
    } catch {
      setAviso(textos.copiarFalha);
    }
  };
  return (
    <>
      <button type="button" className="botao-quieto sem-js-oculto" onClick={copiar}>
        <IconeCopiar />
        {textos.copiar}
      </button>
      <span aria-live="polite" className="legenda">
        {aviso}
      </span>
    </>
  );
}

export function RevelarWhatsapp({ texto }: { texto: string }) {
  const [numero, setNumero] = useState<{ cru: string; formatado: string } | null>(null);
  const link = useRef<HTMLAnchorElement>(null);
  // O foco vai ao link só depois de ele existir no DOM.
  const texto_ = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!numero) return;
    link.current?.focus();
    // O número se decodifica em até 400 ms; o texto real já está no DOM para quem usa leitor de tela.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !texto_.current) return;
    const alvo = texto_.current;
    void (async () => {
      const [{ default: gsap }, { ScrambleTextPlugin }] = await Promise.all([import("gsap"), import("gsap/ScrambleTextPlugin")]);
      gsap.registerPlugin(ScrambleTextPlugin);
      gsap.to(alvo, { duration: 0.4, scrambleText: { text: numero.formatado, chars: "0123456789", speed: 1 } });
    })();
  }, [numero]);
  if (!process.env.WHATSAPP_ATIVO) return null;

  const revelar = async () => {
    const { revelarNumero, formatarNumero } = await import("./whatsapp");
    const cru = revelarNumero();
    setNumero({ cru, formatado: formatarNumero(cru) });
  };

  if (numero) {
    return (
      <a ref={link} className="botao-quieto" href={`https://wa.me/${numero.cru}`} target="_blank" rel="noopener noreferrer" aria-live="polite">
        <IconeMensagem />
        <span ref={texto_} className="dado" style={{ color: "inherit" }}>
          {numero.formatado}
        </span>
      </a>
    );
  }
  return (
    <button type="button" className="botao-quieto sem-js-oculto" data-magnetico onClick={revelar}>
      <IconeMensagem />
      {texto}
    </button>
  );
}
