"use client";

/**
 * Boot log do hero (docs/07): os passos reais de carregamento desta visita, com tempos de `performance.now`.
 * Nunca bloqueia: o H1 já está na tela. Some depois de um tempo. Sem JavaScript, não aparece.
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import { reduzido } from "@/movimento/estado";
import { assinar, lerEventos, lerEventosServidor } from "@/movimento/registro";

const fmt = (ms: number) => (ms / 1000).toFixed(3).padStart(7, "0");

export function BootLog() {
  const eventos = useSyncExternalStore(assinar, lerEventos, lerEventosServidor);
  const [fim, setFim] = useState(false);

  useEffect(() => {
    const sumir = setTimeout(() => setFim(true), reduzido() ? 1200 : 9000);
    return () => clearTimeout(sumir);
  }, []);

  const linhas = eventos.filter((e) => e.tipo === "info" && e.t < 8000).slice(0, 6);
  if (fim || !linhas.length) return null;
  return (
    <ol className="bootlog" aria-hidden="true">
      {linhas.map((l, i) => (
        <li key={i} className="dado">
          <span>{fmt(l.t)}</span> <span>{l.texto}</span>
        </li>
      ))}
    </ol>
  );
}
