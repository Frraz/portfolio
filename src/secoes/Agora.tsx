import type { ConteudoSite } from "@/conteudo/esquema";
import { Secao } from "./Secao";

/** O cargo atual. À direita, em tela larga, a chuva desenha a árvore de fibra (src/gl/forma/Forma.tsx). */
export function Agora({ c }: { c: ConteudoSite }) {
  return (
    <Secao id="agora" titulo={c.agora.titulo} forma>
      <div className="agora-cabeca">
        <h3 className="agora-cargo">{c.agora.cargo}</h3>
        <p className="agora-empresa">{c.agora.empresa}</p>
        <p className="agora-periodo">{c.agora.periodo}</p>
      </div>
      <ul className="lista-trabalho medida">
        {c.agora.atividades.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <h3 className="bloco-titulo">{c.agora.ferramentasTitulo}</h3>
      <ul className="ferramentas">
        {c.agora.ferramentas.map((f) => (
          <li key={f} translate="no">
            {f}
          </li>
        ))}
      </ul>
    </Secao>
  );
}
