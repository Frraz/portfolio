import type { Metadata } from "next";
import { Rodape } from "@/secoes/Rodape";
import { conteudo } from "@/conteudo";
import { hexdump } from "@/conteudo/derivados";
import { Hexdump } from "@/componentes/graficos/Hexdump";
import { Trilhas } from "@/componentes/graficos/Trilhas";
import { TEMAS, type Papel } from "@/temas/temas";
import { contraste } from "@/temas/cor";

const c = conteudo("pt-BR");
export const metadata: Metadata = { title: c.seo.sistema.titulo, description: c.seo.sistema.descricao, alternates: { canonical: "/sistema" } };

const NOMES: Record<string, string> = { rubro: c.ui.temaRubro, claro: c.ui.temaClaro, fosforo: c.ui.temaFosforo };
const kebab = (p: string) => p.replace(/([A-Z0-9])/g, "-$1").toLowerCase();
const PAPEIS = Object.keys(TEMAS[0].cores) as Papel[];
// Largura e peso vêm dos tokens de globais.css: a amostra mostra o que o site usa.
const ESCALA: [string, string, string, string][] = [
  ["--t-nome", "var(--larg-nome)", "var(--peso-nome)", "Warley"],
  ["--t-h2", "var(--larg-titulo)", "var(--peso-titulo)", "Trajetória"],
  ["--t-h3", "var(--larg-subtitulo)", "var(--peso-sub)", "Analista de Redes N2"],
  ["--t-lead", "100%", "400", "Monitoro uma rede de fibra óptica."],
  ["--t-corpo", "100%", "400", "Texto de leitura, 62 a 72 caracteres por linha."],
  ["--t-legenda", "100%", "400", "Legenda e nota."],
];

export default function Sistema() {
  const r = c.sistema.rotulos;
  return (
    <>
      <article className="leitura">
        <h1>{c.sistema.titulo}</h1>
        <p className="medida" style={{ marginTop: "1rem" }}>
          {c.sistema.abertura}
        </p>

        <h2>{r.cores}</h2>
        <div className="amostras-tema">
          {TEMAS.map((t) => (
            <div key={t.id} className="cartao-tema" data-tema={t.id}>
              <h3>{NOMES[t.id]}</h3>
              <p className="legenda">{r.amostraTexto}</p>
              <p style={{ color: "var(--sinal)" }}>{r.principal}</p>
              <div className="tira" aria-hidden="true">
                {Object.keys(t.cores).map((papel) => (
                  <span key={papel} className={`cor-${t.id}-${papel}`} />
                ))}
              </div>
              <p style={{ marginTop: "0.5rem" }}>
                <button type="button" className="botao">
                  {r.principal}
                </button>
              </p>
            </div>
          ))}
        </div>
        <table className="papeis">
          <caption className="so-leitor">{r.contraste}</caption>
          <thead>
            <tr>
              <th scope="col">{r.papel}</th>
              {TEMAS.map((t) => (
                <th key={t.id} scope="col">
                  {NOMES[t.id]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAPEIS.map((papel) => (
              <tr key={papel}>
                <th scope="row">{kebab(papel)}</th>
                {TEMAS.map((t) => (
                  <td key={t.id}>
                    <span className={`amostra cor-${t.id}-${papel}`} aria-hidden="true" /> <span className="dado">{t.cores[papel]}</span>
                    <br />
                    <span className="dado legenda">{contraste(t.cores[papel], t.cores.fundo).toFixed(2)}:1</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <h2>{r.tipografia}</h2>
        <h3 style={{ marginTop: "1rem" }}>{r.larguras}</h3>
        {ESCALA.map(([token, larg, peso, texto]) => (
          <p key={token} style={{ fontSize: `var(${token})`, fontStretch: larg, fontWeight: peso, lineHeight: 1.05, letterSpacing: token === "--t-nome" || token === "--t-h2" ? "-0.028em" : undefined, marginTop: "0.75rem" }}>
            {texto}
          </p>
        ))}
        <p className="dado" style={{ marginTop: "1rem" }}>
          {r.amostraDado}
        </p>

        <h2>{r.botoes}</h2>
        <p style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <button type="button" className="botao">
            {r.principal}
          </button>
          <button type="button" className="botao-sec">
            {r.secundario}
          </button>
          <button type="button" className="botao" disabled>
            {r.desativado}
          </button>
        </p>

        <h2>{r.moldura}</h2>
        <p className="medida" style={{ marginTop: "1rem" }}>
          {r.molduraTexto}
        </p>

        <h2>{r.graficos}</h2>
        <div className="sistema-bloco" style={{ minHeight: "14rem" }}>
          <Trilhas secao="trajetoria" />
          <p className="legenda">{r.trilhas}</p>
        </div>
        <div className="sistema-bloco">
          <p className="legenda">{r.hexdump}</p>
          <Hexdump texto={c.sistema.abertura} linhas={hexdump(c.sistema.abertura).length > 8 ? 8 : 4} />
        </div>
      </article>
      <Rodape c={c} />
    </>
  );
}
