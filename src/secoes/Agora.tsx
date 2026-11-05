import type { ConteudoSite } from "@/conteudo/esquema";
import { DivisorCarregador } from "@/componentes/DivisorCarregador";
import { arvoreGpon } from "@/ornamentos";
import { Secao } from "./Secao";

type Props = { c: ConteudoSite; numero: number; margem: string };

export function Agora({ c, numero, margem }: Props) {
  const { nos, ramos } = arvoreGpon();
  return (
    <Secao id="agora" numero={numero} margem={margem} titulo={c.agora.titulo}>
      <div className="agora-grade">
        <div>
          <h3 className="agora-cargo">{c.agora.cargo}</h3>
          <p className="agora-empresa">{c.agora.empresa}</p>
          <p className="legenda">{c.agora.periodo}</p>
          <ul className="lista-trabalho medida">
            {c.agora.atividades.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <h3 className="bloco-titulo" style={{ marginTop: "2.5rem" }}>
            {c.agora.ferramentasTitulo}
          </h3>
          <ul className="ferramentas">
            {c.agora.ferramentas.map((f) => (
              <li key={f} translate="no">
                {f}
              </li>
            ))}
          </ul>
        </div>
        <figure className="agora-figura">
          <div className="arvore-caixa">
            <svg className="arvore" viewBox="-2 -2 104 104" role="img" aria-labelledby="arvore-legenda">
              {ramos.map((r) => (
                <path key={r.d} d={r.d} data-nivel={r.nivel} />
              ))}
              {nos.map((n) => (
                <circle key={`${n.x}-${n.y}`} data-nivel={n.nivel} className={n.nivel === 3 ? "folha" : undefined} cx={n.x} cy={n.y} r={n.nivel === 0 ? 2.4 : n.nivel === 3 ? 1.5 : 1.2} />
              ))}
            </svg>
            <DivisorCarregador nos={nos} ramos={ramos} textos={c.agora.divisor} />
          </div>
          <figcaption>
            <h3 className="bloco-titulo" style={{ marginTop: "1.5rem" }}>
              {c.agora.luzTitulo}
            </h3>
            <p>{c.agora.luz}</p>
            <p id="arvore-legenda" className="legenda" style={{ marginTop: "0.5rem" }}>
              {c.agora.legendaDiagrama}
            </p>
          </figcaption>
        </figure>
      </div>
    </Secao>
  );
}
