import type { ConteudoSite } from "@/conteudo/esquema";
import { tempoDecorrido } from "@/conteudo/derivados";
import { Hexdump } from "@/componentes/graficos/Hexdump";
import { formatarMesAno, formatarTempo } from "@/formatos";
import { Secao } from "./Secao";

export function Sobre({ c }: { c: ConteudoSite }) {
  const [lead, ...resto] = c.sobre.paragrafos;
  const f = c.sobre.ficha;
  // Datas e tempos vêm dos dados já publicados: início do primeiro curso e do cargo atual.
  const inicioEstudo = c.formacao.cursos.map((k) => k.inicio).sort()[0];
  const cargo = c.trajetoria.experiencias.at(-1)!;
  return (
    <Secao id="sobre" titulo={c.sobre.titulo}>
      {/* A ficha gruda só enquanto o texto ao lado passa: o topo é o limite do `sticky`, e os blocos ficam fora dele. */}
      <div className="sobre-topo">
        <div className="sobre-texto medida">
          <p className="sobre-lead">{lead}</p>
          {resto.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside className="sobre-ficha">
          <dl>
            <div>
              <dt>{f.cargo}</dt>
              <dd>{c.agora.cargo}</dd>
            </div>
            <div>
              <dt>{f.local}</dt>
              <dd>{c.pessoa.local}</dd>
            </div>
            <div>
              <dt>{f.estudo}</dt>
              <dd>
                <span className="dado">{formatarMesAno(inicioEstudo)}</span>, {formatarTempo(tempoDecorrido(inicioEstudo), f)}
              </dd>
            </div>
            <div>
              <dt>{f.noCargo}</dt>
              <dd>{formatarTempo(tempoDecorrido(cargo.inicio), f)}</dd>
            </div>
          </dl>
          <Hexdump texto={c.sobre.paragrafos.join("\n")} linhas={6} />
        </aside>
      </div>
      <div className="sobre-blocos">
        <div>
          <h3>{c.sobre.aindaNaoTenhoTitulo}</h3>
          <p>{c.sobre.aindaNaoTenho}</p>
        </div>
        <div>
          <h3>{c.sobre.procuroTitulo}</h3>
          <p>{c.sobre.procuro}</p>
        </div>
      </div>
    </Secao>
  );
}
