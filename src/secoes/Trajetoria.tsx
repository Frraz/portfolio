import type { ConteudoSite } from "@/conteudo/esquema";
import { periodo } from "@/formatos";
import { Secao } from "./Secao";

/** Os dez empregos como saltos de um traceroute: o último é o NOC. Datas reais, sem latência inventada. */
export function Trajetoria({ c }: { c: ConteudoSite }) {
  const todas = c.trajetoria.experiencias;
  return (
    <Secao id="trajetoria" titulo={c.trajetoria.titulo}>
      <p className="medida introducao">{c.trajetoria.introducao}</p>
      <ol className="traceroute">
        {todas.map((e, i) => (
          <li key={`${e.empresa}-${e.inicio}`} className="salto" data-ti={e.ti ? "sim" : "nao"} data-destino={i === todas.length - 1 ? "sim" : undefined}>
            <span className="salto-n dado" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="salto-corpo">
              <h3>{e.cargo}</h3>
              <p className="salto-empresa">
                {e.empresa} <span className="dado">{periodo(e.inicio, e.fim)}</span>
              </p>
              <p className="salto-descricao">{e.descricao}</p>
            </div>
          </li>
        ))}
      </ol>
    </Secao>
  );
}
