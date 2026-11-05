import type { ConteudoSite } from "@/conteudo/esquema";
import { Filtro } from "@/componentes/Filtro";
import { Secao } from "./Secao";

type Props = { c: ConteudoSite; numero: number; margem: string };

export function Competencias({ c, numero, margem }: Props) {
  const k = c.competencias;
  return (
    <Secao id="competencias" numero={numero} margem={margem} titulo={k.titulo}>
      <p className="medida">{k.introducao}</p>
      <Filtro grupo="area" rotulo={k.titulo} opcoes={k.filtros} />
      <div data-grupo-filtro="area">
        {k.grupos.map((g) => (
          <section key={g.evidencia} className="fileira" data-fileira data-evidencia={g.evidencia} aria-label={g.titulo}>
            <div>
              <h3>{g.titulo}</h3>
              <p className="legenda">{g.explicacao}</p>
            </div>
            <div>
              <ul className="fileira-itens">
                {g.itens.map((i) => (
                  <li key={i.nome} data-areas={i.areas.join(" ")}>
                    {i.nome}
                  </li>
                ))}
              </ul>
              {"nota" in g && g.nota ? (
                <p className="legenda" style={{ marginTop: "1rem" }}>
                  {g.nota}
                </p>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </Secao>
  );
}
