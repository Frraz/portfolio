import { CarregadorMovimento } from "@/componentes/CarregadorMovimento";
import { conteudo } from "@/conteudo";
import { Palco } from "@/gl/Palco";
import { Agora } from "@/secoes/Agora";
import { Certificados } from "@/secoes/Certificados";
import { Competencias } from "@/secoes/Competencias";
import { Contato } from "@/secoes/Contato";
import { Formacao } from "@/secoes/Formacao";
import { Inicio } from "@/secoes/Inicio";
import { Rodape } from "@/secoes/Rodape";
import { Sobre } from "@/secoes/Sobre";
import { Trajetoria } from "@/secoes/Trajetoria";
import { metadadosPagina, URL_SITE } from "@/site";
import type { Metadata } from "next";

const c = conteudo("pt-BR");
export const metadata: Metadata = metadadosPagina({ titulo: c.seo.inicio.titulo, descricao: c.seo.inicio.descricao, caminho: "/" });

// Dados estruturados para buscadores. Só fatos do conteúdo: cargo atual, formação e o que é usado no trabalho.
// Sem endereço: a localidade fica fora do site (decisão 98).
// `alumniOf` é só para cursos concluídos; o curso em andamento não entra.
const instituicoes = [...new Set(c.formacao.cursos.filter((k) => k.concluido).map((k) => k.instituicao))];
const dados = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${URL_SITE}/#pessoa`,
      name: c.pessoa.nome,
      url: URL_SITE,
      email: `mailto:${c.pessoa.email}`,
      description: c.seo.descricaoPessoa,
      jobTitle: c.agora.cargo,
      worksFor: { "@type": "Organization", name: c.agora.empresa },
      alumniOf: instituicoes.map((name) => ({ "@type": "CollegeOrUniversity", name })),
      knowsAbout: c.competencias.grupos.find((g) => g.evidencia === "trabalho")?.itens.map((i) => i.nome) ?? [],
      knowsLanguage: ["pt-BR"],
      sameAs: [c.pessoa.linkedin, c.pessoa.github],
    },
    {
      "@type": "WebSite",
      "@id": `${URL_SITE}/#site`,
      url: URL_SITE,
      name: c.pessoa.nome,
      inLanguage: "pt-BR",
      author: { "@id": `${URL_SITE}/#pessoa` },
    },
  ],
};

export default function Pagina() {
  return (
    <>
      <Palco />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }} />
      <CarregadorMovimento />
      <Inicio c={c} />
      <Sobre c={c} />
      <Agora c={c} />
      <Trajetoria c={c} />
      <Formacao c={c} />
      <Competencias c={c} />
      <Certificados c={c} />
      <Contato c={c} />
      <Rodape c={c} />
    </>
  );
}
