import type { ConteudoSite } from "@/conteudo/esquema";
import { Filtro } from "@/componentes/Filtro";
import { Secao } from "./Secao";

/**
 * Degraus de evidência: uma fileira por origem do conhecimento, da mais forte para a mais fraca.
 * O peso aparece só na tipografia (tamanho e tom caem a cada degrau), sem nível ou porcentagem.
 */
export function Competencias({ c }: { c: ConteudoSite }) {
  const k = c.competencias;
  return (
    <Secao id="competencias" titulo={k.titulo}>
      <p className="medida introducao">{k.introducao}</p>
      <Filtro grupo="area" rotulo={k.titulo} opcoes={k.filtros} />
      <div className="degraus" data-grupo-filtro="area">
        {k.grupos.map((g, i) => (
          <section key={g.evidencia} className="degrau" data-fileira data-evidencia={g.evidencia} data-nivel={i} aria-labelledby={`degrau-${g.evidencia}`}>
            <div className="degrau-cabeca">
              <h3 id={`degrau-${g.evidencia}`}>{g.titulo}</h3>
              <p className="degrau-explicacao">{g.explicacao}</p>
            </div>
            <div className="degrau-corpo">
              <ul className="degrau-itens">
                {g.itens.map((item) => (
                  <li key={item.nome} data-areas={item.areas.join(" ")}>
                    {item.nome}
                  </li>
                ))}
              </ul>
              {"nota" in g && g.nota ? <p className="degrau-nota">{g.nota}</p> : null}
            </div>
          </section>
        ))}
      </div>
    </Secao>
  );
}
