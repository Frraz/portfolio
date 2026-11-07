"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

type Props = { secoes: { id: string; rotulo: string }[]; ui: Record<string, string> };

const MolduraDados = dynamic(() => import("./MolduraDados"), { ssr: false });

/** Os dados da moldura entram quando o navegador fica ocioso, como o movimento. */
export function CarregadorMoldura(props: Props) {
  const [ativo, setAtivo] = useState(false);
  useEffect(() => {
    const ocioso = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 200));
    ocioso(() => setAtivo(true));
  }, []);
  return ativo ? <MolduraDados {...props} /> : null;
}
