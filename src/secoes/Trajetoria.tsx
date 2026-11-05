import type { ConteudoSite } from "@/conteudo/esquema";
import { periodo } from "@/formatos";
import { Secao } from "./Secao";

type Props = { c: ConteudoSite; numero: number; margem: string };

export function Trajetoria({ c, numero, margem }: Props) {
  return (
    <Secao id="trajetoria" numero={numero} margem={margem} titulo={c.trajetoria.titulo}>
      <p className="medida" style={{ marginBottom: "2.5rem" }}>
        {c.trajetoria.introducao}
      </p>
      <ol className="caminho">
        {c.trajetoria.experiencias.map((e, i, todas) => {
          const ano = e.inicio.slice(0, 4);
          const mostrar = ano !== todas[i - 1]?.inicio.slice(0, 4);
          return (
            <li key={`${e.empresa}-${e.inicio}`} className="passo" data-ti={e.ti ? "sim" : "nao"}>
              <div className="passo-ano" aria-hidden="true">
                {mostrar ? ano : ""}
              </div>
              <div>
                <h3>{e.cargo}</h3>
                <p className="passo-empresa">
                  {e.empresa} <span className="dado">{periodo(e.inicio, e.fim)}</span>
                </p>
                <p className="passo-descricao">{e.descricao}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Secao>
  );
}
