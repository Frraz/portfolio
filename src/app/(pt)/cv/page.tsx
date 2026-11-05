import type { Metadata } from "next";
import Link from "next/link";
import { RevelarWhatsapp } from "@/componentes/AcoesContato";
import { Rodape } from "@/secoes/Rodape";
import { existeArquivoPublico, PDF_PUBLICO } from "@/arquivos";
import { conteudo } from "@/conteudo";
import { periodo, formatarMesAno } from "@/formatos";

const c = conteudo("pt-BR");
export const metadata: Metadata = { title: c.seo.cv.titulo, description: c.seo.cv.descricao, alternates: { canonical: "/cv" } };

export default function Curriculo() {
  const exp = [...c.trajetoria.experiencias].reverse();
  const ti = exp.filter((e) => e.ti);
  const outras = exp.filter((e) => !e.ti);
  const cursos = c.certificados.itens.filter((x) => x.prioridade === "A");
  return (
    <>
      <article className="leitura">
        <h1>{c.pessoa.nome}</h1>
        <p style={{ fontSize: "var(--t-lead)", marginTop: "0.75rem" }}>{c.cv.subtitulo}</p>
        <p className="legenda" style={{ marginTop: "0.5rem" }}>
          {c.inicio.local}
        </p>
        <p style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.25rem 1.25rem", alignItems: "center" }}>
          <a className="link-ouro" href={`mailto:${c.pessoa.email}`} translate="no">
            {c.pessoa.email}
          </a>
          <a className="link-ouro" href={c.pessoa.linkedin} translate="no">
            LinkedIn
          </a>
          <a className="link-ouro" href={c.pessoa.github} translate="no">
            GitHub
          </a>
          <RevelarWhatsapp texto={c.contato.mostrarWhatsapp} />
        </p>
        <div className="sem-impressao" style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {existeArquivoPublico(PDF_PUBLICO) ? (
            <a className="botao" href={`/${PDF_PUBLICO}`} download>
              {c.cv.baixar}
            </a>
          ) : null}
          <Link transitionTypes={["rota"]} className="botao-quieto" href="/">
            {c.cv.voltar}
          </Link>
        </div>

        <h2>{c.cv.objetivoTitulo}</h2>
        <p className="medida">{c.cv.objetivo}</p>
        <h2>{c.cv.resumoTitulo}</h2>
        <p className="medida">{c.cv.resumo}</p>

        <h2>{c.cv.experienciaTi}</h2>
        {ti.map((e) => (
          <div key={e.inicio} style={{ marginBottom: "1.25rem" }}>
            <h3>
              {e.cargo}, {e.empresa}
            </h3>
            <p className="dado">{periodo(e.inicio, e.fim)}</p>
            {e.fim === null ? (
              <ul style={{ marginTop: "0.5rem", display: "grid", gap: "0.4rem" }}>
                {c.agora.atividades.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            ) : (
              <p className="medida">{e.descricao}</p>
            )}
          </div>
        ))}

        <h2>{c.formacao.titulo}</h2>
        {c.formacao.cursos.map((k) => (
          <p key={k.nome} style={{ marginBottom: "0.5rem" }}>
            <strong style={{ fontWeight: 560 }}>{k.nome}</strong>, {k.instituicao}.{" "}
            {k.concluido ? `${c.formacao.concluido}, ${k.carga}. ` : `${c.formacao.emAndamento}. ${c.formacao.previsao}: ${formatarMesAno(k.fim)}. `}
            <span className="dado">{periodo(k.inicio, k.fim)}</span>
          </p>
        ))}

        <h2>{c.competencias.titulo}</h2>
        {c.competencias.grupos.map((g) => (
          <p key={g.evidencia} style={{ marginBottom: "0.75rem" }} className="medida">
            <strong style={{ fontWeight: 560 }}>{g.titulo}:</strong> {g.itens.map((i) => i.nome).join(", ")}.
          </p>
        ))}

        <h2>{c.cv.cursosTitulo}</h2>
        <ul style={{ display: "grid", gap: "0.3rem" }}>
          {cursos.map((k) => (
            <li key={k.nome}>
              {k.nome}, {k.emissor}
              {k.conclusao ? `, ${formatarMesAno(k.conclusao)}` : ""}
            </li>
          ))}
        </ul>

        <h2>{c.cv.anteriores}</h2>
        <ul style={{ display: "grid", gap: "0.3rem" }}>
          {outras.map((e) => (
            <li key={e.inicio}>
              {e.cargo}, {e.empresa}. <span className="dado">{periodo(e.inicio, e.fim)}</span>
            </li>
          ))}
        </ul>

        <h2>{c.formacao.idiomasTitulo}</h2>
        <p>{c.formacao.idiomas}</p>
      </article>
      <Rodape c={c} />
    </>
  );
}
