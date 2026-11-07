import type { ReactNode } from "react";
import { Trilhas } from "@/componentes/graficos/Trilhas";

type Props = { id: string; titulo: string; children: ReactNode; /** Reserva a faixa da direita para a forma desenhada pela chuva. */ forma?: boolean };

/** Seção do site. A posição na página vive na régua da moldura, e não em um número ao lado do título. */
export function Secao({ id, titulo, children, forma = false }: Props) {
  return (
    <section id={id} className="secao" data-forma={forma ? "sim" : undefined} aria-labelledby={`${id}-titulo`}>
      <Trilhas secao={id} />
      <div className="secao-corpo">
        <h2 id={`${id}-titulo`} className="titulo-secao">
          {titulo}
        </h2>
        {children}
      </div>
    </section>
  );
}
