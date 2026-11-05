"use client";

import { useState } from "react";

/** Prioridade C fica recolhida com JavaScript. Sem ele, tudo aparece. */
export function VerTodos({ alvo, todos, menos }: { alvo: string; todos: string; menos: string }) {
  const [aberto, setAberto] = useState(false);
  const alternar = () => {
    const novo = !aberto;
    setAberto(novo);
    document.querySelectorAll<HTMLElement>(`[data-grupo-filtro="${alvo}"] [data-prioridade="C"]`).forEach((el) => {
      el.dataset.mostrar = novo ? "sim" : "nao";
    });
  };
  return (
    <button type="button" className="filtro sem-impressao" aria-expanded={aberto} onClick={alternar} style={{ marginTop: "1.5rem" }}>
      {aberto ? menos : todos}
    </button>
  );
}
