import type { ConteudoSite } from "@/conteudo/esquema";
import { Secao } from "./Secao";

type Props = { c: ConteudoSite; numero: number; margem: string };

export function Sobre({ c, numero, margem }: Props) {
  const [lead, ...resto] = c.sobre.paragrafos;
  return (
    <>
      <Secao id="sobre" numero={numero} margem={margem} titulo={c.sobre.titulo}>
        <div className="sobre-grade">
          <div className="sobre-texto medida">
            <p className="sobre-lead">{lead}</p>
            {resto.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="sobre-lateral">
            <div>
              <h3 className="bloco-titulo">{c.sobre.aindaNaoTenhoTitulo}</h3>
              <p>{c.sobre.aindaNaoTenho}</p>
            </div>
            <div>
              <h3 className="bloco-titulo">{c.sobre.procuroTitulo}</h3>
              <p>{c.sobre.procuro}</p>
            </div>
          </div>
        </div>
      </Secao>
      <div className="inicial" aria-hidden="true">
        <span>W</span>
      </div>
    </>
  );
}
