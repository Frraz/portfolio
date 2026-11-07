"use client";

import { useEffect, useState } from "react";
import { TOTAL_SELOS } from "@/ctf/progresso";

/**
 * Aviso ao confirmar um selo do CTF, fora do terminal (que não anima). Mostra só o dado real: qual selo e quantos
 * foram reunidos. Entrada e saída em CSS; com movimento reduzido, aparece e some sem transição.
 * O terminal já anuncia o selo para leitores de tela, por isso aqui fica `aria-hidden`.
 */
export function SeloToast() {
  const [selo, setSelo] = useState<{ indice: number; total: number } | null>(null);
  useEffect(() => {
    let t = 0;
    const aoSelo = (e: Event) => {
      setSelo((e as CustomEvent<{ indice: number; total: number }>).detail);
      window.clearTimeout(t);
      t = window.setTimeout(() => setSelo(null), 2600);
    };
    addEventListener("sinal:selo", aoSelo);
    return () => {
      removeEventListener("sinal:selo", aoSelo);
      window.clearTimeout(t);
    };
  }, []);
  if (selo === null) return null;
  return (
    <div className="selo-aviso" aria-hidden="true">
      <span className="dado">selo {selo.indice}</span>
      <span className="dado selo-aviso-total">
        {selo.total}/{TOTAL_SELOS}
      </span>
    </div>
  );
}
