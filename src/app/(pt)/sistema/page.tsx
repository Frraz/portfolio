import type { Metadata } from "next";
import { Rodape } from "@/secoes/Rodape";
import { conteudo } from "@/conteudo";
import { rosaceaSvg } from "@/ornamentos";
import { TEMAS } from "@/temas/temas";

const c = conteudo("pt-BR");
export const metadata: Metadata = { title: c.seo.sistema.titulo, description: c.seo.sistema.descricao, alternates: { canonical: "/sistema" } };

const NOMES: Record<string, string> = { ouro: c.ui.temaOuro, fosforo: c.ui.temaFosforo, rubro: c.ui.temaRubro, purpura: c.ui.temaPurpura, pergaminho: c.ui.temaPergaminho };

export default function Sistema() {
  return (
    <>
      <article className="leitura">
        <h1>{c.sistema.titulo}</h1>
        <p className="medida" style={{ marginTop: "1rem" }}>
          {c.sistema.abertura}
        </p>

        <h2>Cores</h2>
        <div className="amostras-tema">
          {TEMAS.map((t) => (
            <div key={t.id} className="cartao-tema" data-tema={t.id}>
              <p style={{ fontFamily: "var(--font-titulo)", fontSize: "var(--t-h3)", fontWeight: 600 }}>{NOMES[t.id]}</p>
              <p className="legenda">Texto secundário sobre o fundo.</p>
              <p style={{ color: "var(--acento)" }}>Acento de interface</p>
              <div className="tira" aria-hidden="true">
                {Object.entries(t.cores).map(([papel, hex]) => (
                  <span key={papel} title={`${papel} ${hex}`} className={`cor-${t.id}-${papel}`} />
                ))}
              </div>
              <p style={{ marginTop: "0.75rem" }}>
                <button type="button" className="botao">
                  Botão
                </button>
              </p>
            </div>
          ))}
        </div>

        <h2>Tipografia</h2>
        <p style={{ fontFamily: "var(--font-titulo)", fontSize: "var(--t-display)", fontWeight: 600, lineHeight: 1 }}>Grenze Gotisch: ação, função, ótica</p>
        <p style={{ fontSize: "var(--t-lead)", marginTop: "1rem" }}>Literata para leitura: a luz passa pelo vidro.</p>
        <p className="dado" style={{ marginTop: "0.5rem" }}>
          JetBrains Mono: 08/2026 – atual, sha256sum
        </p>
        <p style={{ fontFamily: "var(--font-numero)", fontSize: "var(--t-h2)", color: "var(--acento)", marginTop: "0.5rem" }}>0 1 2 3 4 5 6 7 8</p>

        <h2>Ornamentos</h2>
        <div className="poster-rosacea" style={{ position: "relative", right: "auto", top: "auto", ["--tam" as string]: "min(70vw, 420px)" }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: rosaceaSvg() }} />
      </article>
      <Rodape c={c} />
    </>
  );
}
