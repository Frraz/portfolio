import type { CSSProperties } from "react";
import type { ConteudoSite } from "@/conteudo/esquema";
import { horas } from "@/conteudo/derivados";
import { formatarMesAno, fracaoDecorrida, periodo } from "@/formatos";
import { Secao } from "./Secao";

const MARCA_HORAS = 500;

/**
 * Régua de carga horária: os cursos concluídos dividem o mesmo eixo, de zero à maior carga real (2.600 h),
 * com uma marca a cada 500 h. Assim a proporção entre 420 h e 2.600 h fica visível sem número inventado.
 * O curso em andamento não tem carga publicada: a régua dele é o tempo, do início à previsão, cheia até hoje.
 */
export function Formacao({ c }: { c: ConteudoSite }) {
  const f = c.formacao;
  const maior = Math.max(...f.cursos.map((k) => horas(k.carga) ?? 0));
  return (
    <Secao id="formacao" titulo={f.titulo}>
      <ul className="blocos" style={{ "--marca": `${(MARCA_HORAS / maior) * 100}%` } as CSSProperties}>
        {f.cursos.map((curso) => {
          const h = horas(curso.carga);
          const andamento = !curso.concluido;
          const decorrido = andamento ? fracaoDecorrida(curso.inicio, curso.fim) : 1;
          const largura = !andamento && h ? (h / maior) * 100 : 100;
          return (
            <li
              key={curso.nome}
              className="bloco"
              data-andamento={andamento ? "sim" : undefined}
              data-inicio={andamento ? curso.inicio : undefined}
              data-fim={andamento ? curso.fim : undefined}
              style={{ "--larg": `${largura}%`, "--preenche": decorrido } as CSSProperties}
            >
              <div className="bloco-cabeca">
                <h3>{curso.nome}</h3>
                <p className="bloco-instituicao">{curso.instituicao}</p>
                <p className="bloco-periodo">
                  {andamento ? (
                    <>
                      {f.emAndamento}. {f.previsao}: <span className="dado">{formatarMesAno(curso.fim)}</span>
                    </>
                  ) : (
                    <span className="dado">{periodo(curso.inicio, curso.fim)}</span>
                  )}
                </p>
              </div>
              <div className="bloco-medida">
                <div className="bloco-trilho" aria-hidden="true">
                  <span className="bloco-barra">
                    <span className="bloco-enchimento" />
                  </span>
                </div>
                {andamento ? (
                  <p className="bloco-pontas dado" aria-hidden="true">
                    <span>{formatarMesAno(curso.inicio)}</span>
                    <span>{formatarMesAno(curso.fim)}</span>
                  </p>
                ) : null}
                <p className="bloco-numero">
                  {andamento ? (
                    <>
                      <span className="bloco-pct" suppressHydrationWarning>
                        {Math.round(decorrido * 100)}%
                      </span>{" "}
                      <span className="bloco-situacao">{f.tempoDecorrido}</span>
                    </>
                  ) : (
                    <>
                      {curso.carga} <span className="bloco-situacao">{f.concluido}</span>
                    </>
                  )}
                </p>
              </div>
              <p className="bloco-destaques">{curso.destaques.length > 0 ? `${curso.destaques.join(", ")}.` : f.legendaBloco}</p>
            </li>
          );
        })}
      </ul>
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
