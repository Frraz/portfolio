import type { CSSProperties } from "react";
import type { ConteudoSite } from "@/conteudo/esquema";
import { formatarMesAno, fracaoDecorrida, periodo } from "@/formatos";
import { Secao } from "./Secao";

type Props = { c: ConteudoSite; numero: number; margem: string };

export function Formacao({ c, numero, margem }: Props) {
  const f = c.formacao;
  return (
    <Secao id="formacao" numero={numero} margem={margem} titulo={f.titulo}>
      <div className="lancetas">
        {f.cursos.map((curso) => {
          const luz = curso.concluido ? 1 : fracaoDecorrida(curso.inicio, curso.fim);
          return (
            <article key={curso.nome} className="lanceta">
              <div className="lanceta-janela" style={{ "--luz": luz } as CSSProperties} aria-hidden="true" />
              <h3>{curso.nome}</h3>
              <p className="lanceta-instituicao">{curso.instituicao}</p>
              <p className="legenda">
                {curso.concluido ? (
                  <>
                    {f.concluido}, {curso.carga}. <span className="dado">{periodo(curso.inicio, curso.fim)}</span>
                  </>
                ) : (
                  <>
                    {f.emAndamento}. {f.previsao}: <span className="dado">{formatarMesAno(curso.fim)}</span>
                  </>
                )}
              </p>
              {curso.destaques.length > 0 ? <p className="lanceta-destaques">{curso.destaques.join(", ")}.</p> : <p className="lanceta-destaques">{f.legendaLanceta}</p>}
            </article>
          );
        })}
      </div>
      <div className="formacao-rodape">
        <div>
          <h3 className="bloco-titulo">{f.estudoTitulo}</h3>
          <p className="medida">{f.estudo}</p>
        </div>
        <div>
          <h3 className="bloco-titulo">{f.idiomasTitulo}</h3>
          <p className="medida">{f.idiomas}</p>
        </div>
      </div>
    </Secao>
  );
}
