import type { ReactNode } from "react";
import { Margem } from "@/componentes/Margem";

type Props = { id: string; numero: number; margem: string; titulo: string; children: ReactNode };

export function Secao({ id, numero, margem, titulo, children }: Props) {
  return (
    <section id={id} className="secao" aria-labelledby={`${id}-titulo`}>
      <Margem numero={numero} nome={margem} />
      <div>
        <h2 id={`${id}-titulo`} className="titulo-secao">
          {titulo}
        </h2>
        {children}
      </div>
    </section>
  );
}
