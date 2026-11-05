import type { ConteudoSite } from "@/conteudo/esquema";
import { Filtro } from "@/componentes/Filtro";
import { VerTodos } from "@/componentes/VerTodos";
import { Secao } from "./Secao";

type Props = { c: ConteudoSite; numero: number; margem: string };
const data = new Intl.DateTimeFormat("pt-BR", { month: "2-digit", year: "numeric", timeZone: "UTC" });

export function Certificados({ c, numero, margem }: Props) {
  const k = c.certificados;
  return (
    <Secao id="certificados" numero={numero} margem={margem} titulo={k.titulo}>
      <p className="medida">{k.introducao}</p>
      <Filtro grupo="certificado" rotulo={k.titulo} opcoes={k.filtros} />
      <ul className="relicario" data-grupo-filtro="certificado">
        {k.itens.map((cert) => (
          <li key={`${cert.nome}-${cert.emissor}`} className="selo" data-areas={cert.area} data-prioridade={cert.prioridade}>
            <div>
              <p className="selo-nome">{cert.nome}</p>
              <p className="selo-meta">
                {cert.emissor}
                {cert.conclusao ? (
                  <>
                    {", "}
                    <span className="dado">{data.format(new Date(`${cert.conclusao}T00:00:00Z`))}</span>
                  </>
                ) : null}
                {cert.carga ? `, ${cert.carga}` : ""}
              </p>
            </div>
            <div className="selo-acao">
              {cert.validacaoUrl ? (
                <a className="link-ouro" href={cert.validacaoUrl} target="_blank" rel="noopener noreferrer">
                  {k.validar}
                </a>
              ) : (
                <span className="legenda">{k.semValidacao}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <VerTodos alvo="certificado" todos={k.verTodos} menos={k.verMenos} />
    </Secao>
  );
}
