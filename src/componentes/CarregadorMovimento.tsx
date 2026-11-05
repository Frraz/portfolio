"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Movimento = dynamic(() => import("@/movimento/Movimento"), { ssr: false });

/** O movimento é só um acréscimo: entra depois da primeira pintura e nada depende dele para ser lido. */
export function CarregadorMovimento() {
  const [ativo, setAtivo] = useState(false);
  useEffect(() => {
    const ocioso = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 200));
    ocioso(() => setAtivo(true));
  }, []);
  return ativo ? <Movimento /> : null;
}
