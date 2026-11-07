"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Experiencia = dynamic(() => import("./Experiencia"), { ssr: false });

function podeUsarWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("webgl2");
  } catch {
    return false;
  }
}

/** Baixa a cena só depois da primeira pintura, em ociosidade: o LCP é o texto. */
export function CarregadorCena() {
  const [ativa, setAtiva] = useState(false);
  useEffect(() => {
    const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conexao?.saveData || !podeUsarWebGL()) return;
    const ocioso = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 300));
    ocioso(() => setAtiva(true));
  }, []);
  return ativa ? <Experiencia /> : null;
}
