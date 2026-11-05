import type { Metadata } from "next";
import { Rodape } from "@/secoes/Rodape";
import { conteudo } from "@/conteudo";

const c = conteudo("pt-BR");
export const metadata: Metadata = { title: c.seo.seguranca.titulo, description: c.seo.seguranca.descricao, alternates: { canonical: "/seguranca" } };

export default function Seguranca() {
  const s = c.seguranca;
  // Regra do projeto: nada é anunciado aqui antes de ser testado em produção.
  const testados = s.aplicado.filter((a) => a.testadoEmProducao);
  return (
    <>
      <article className="leitura">
        <h1>{s.titulo}</h1>
        <p className="medida" style={{ marginTop: "1rem" }}>
          {s.abertura} {s.relatar}{" "}
          <a className="link-ouro" href="/.well-known/security.txt">
            security.txt
          </a>
        </p>
        {testados.length > 0 ? (
          <>
            <h2>{s.aplicadoTitulo}</h2>
            <table className="leitura-tabela">
              <tbody>
                {testados.map((a) => (
                  <tr key={a.controle}>
                    <th scope="row">{a.controle}</th>
                    <td>{a.significa}</td>
                    <td className="dado">{a.conferir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}
        <h2>{s.naoGaranteTitulo}</h2>
        <p className="medida">{s.naoGarante}</p>
        <h2>{s.regrasTitulo}</h2>
        <ol className="regras">
          {s.regras.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
        <h2 id="privacidade">{s.privacidadeTitulo}</h2>
        <p className="medida">{s.privacidade}</p>
      </article>
      <Rodape c={c} />
    </>
  );
}
