import type { ConteudoSite } from "@/conteudo/esquema";
import { curto, fingerprint } from "@/conteudo/derivados";
import { Filtro } from "@/componentes/Filtro";
import { VerTodos } from "@/componentes/VerTodos";
import { Secao } from "./Secao";

const data = new Intl.DateTimeFormat("pt-BR", { month: "2-digit", year: "numeric", timeZone: "UTC" });

/** Registro em tabela. O SHA-256 identifica o registro deste site, calculado no build, e não o código do certificado. */
export function Certificados({ c }: { c: ConteudoSite }) {
  const k = c.certificados;
  return (
    <Secao id="certificados" titulo={k.titulo}>
      <p className="medida introducao">{k.introducao}</p>
      <Filtro grupo="certificado" rotulo={k.titulo} opcoes={k.filtros} />
      <div className="registro-caixa">
        <table className="registro" data-grupo-filtro="certificado">
          <caption className="so-leitor">{k.titulo}</caption>
          <thead>
            <tr>
              <th scope="col">{k.colunas.curso}</th>
              <th scope="col">{k.colunas.emissor}</th>
              <th scope="col">{k.colunas.data}</th>
              <th scope="col">{k.colunas.carga}</th>
              <th scope="col">{k.colunas.validacao}</th>
              <th scope="col">{k.colunas.registro}</th>
            </tr>
          </thead>
          <tbody>
            {k.itens.map((cert) => (
              <tr key={`${cert.nome}-${cert.emissor}`} data-areas={cert.area} data-prioridade={cert.prioridade}>
                <th scope="row">{cert.nome}</th>
                <td data-rotulo={k.colunas.emissor}>{cert.emissor}</td>
                <td className="dado" data-rotulo={k.colunas.data}>{cert.conclusao ? data.format(new Date(`${cert.conclusao}T00:00:00Z`)) : ""}</td>
                <td className="dado" data-rotulo={k.colunas.carga}>{cert.carga ?? ""}</td>
                <td data-rotulo={k.colunas.validacao}>
                  {cert.validacaoUrl ? (
                    <a className="link-destaque" href={cert.validacaoUrl} target="_blank" rel="noopener noreferrer">
                      {k.validar}
                    </a>
                  ) : (
                    <span className="legenda">{k.semValidacao}</span>
                  )}
                </td>
                <td className="dado registro-hash" data-rotulo={k.colunas.registro} translate="no">
                  {curto(fingerprint([cert.nome, cert.emissor, cert.conclusao, cert.codigo]))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="legenda registro-legenda">{k.legendaRegistro}</p>
      <VerTodos alvo="certificado" todos={k.verTodos} menos={k.verMenos} />
    </Secao>
  );
}
