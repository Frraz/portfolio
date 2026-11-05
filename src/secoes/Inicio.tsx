import Link from "next/link";
import type { ConteudoSite } from "@/conteudo/esquema";

export function Inicio({ c }: { c: ConteudoSite }) {
  return (
    <div className="hero-trilho">
    <section id="inicio" className="hero" aria-labelledby="inicio-titulo">
      <div className="hero-veu" aria-hidden="true" />
      <h1 id="inicio-titulo">
        {c.pessoa.linhasNome.map((linha) => (
          <span key={linha}>{linha}</span>
        ))}
      </h1>
      <p className="hero-sub">{c.inicio.subtitulo}</p>
      <p className="hero-apoio">{c.inicio.apoio}</p>
      <div className="hero-acoes">
        <Link transitionTypes={["rota"]} className="botao" href="/cv" data-magnetico>
          {c.inicio.acaoPrincipal}
        </Link>
        <a className="link-ouro" href="#contato" data-magnetico>
          {c.inicio.acaoSecundaria}
        </a>
      </div>
      <p className="hero-local">{c.inicio.local}</p>
    </section>
    </div>
  );
}
