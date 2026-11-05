import { CarregadorMovimento } from "@/componentes/CarregadorMovimento";
import { conteudo, secoesAtivas } from "@/conteudo";
import { fracaoDecorrida } from "@/formatos";
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

const c = conteudo("pt-BR");
const URL_SITE = process.env.SITE_URL ?? "http://localhost:3000";

const pessoa = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: c.pessoa.nome,
  url: URL_SITE,
  jobTitle: c.agora.cargo,
  worksFor: { "@type": "Organization", name: c.agora.empresa },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "UNIASSELVI" },
    { "@type": "CollegeOrUniversity", name: "Faculdade Focus" },
  ],
  address: { "@type": "PostalAddress", addressLocality: "Rondon do Pará", addressRegion: "PA", addressCountry: "BR" },
  sameAs: [c.pessoa.linkedin, c.pessoa.github],
};

export default function Pagina() {
  const secoes = secoesAtivas(c);
  const dados = (id: string) => {
    const s = secoes.find((x) => x.id === id)!;
    return { numero: s.numero, margem: s.margem };
  };
  return (
    <>
      <Palco fracoes={c.formacao.cursos.map((k) => (k.concluido ? 1 : fracaoDecorrida(k.inicio, k.fim)))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pessoa) }} />
      <CarregadorMovimento />
      <div className="fibra sem-js-oculto" aria-hidden="true">
        <span className="fibra-luz" />
      </div>
      <Inicio c={c} />
      <Sobre c={c} {...dados("sobre")} />
      <Agora c={c} {...dados("agora")} />
      <Trajetoria c={c} {...dados("trajetoria")} />
      <Formacao c={c} {...dados("formacao")} />
      <Competencias c={c} {...dados("competencias")} />
      <Certificados c={c} {...dados("certificados")} />
      <Contato c={c} {...dados("contato")} />
      <Rodape c={c} />
    </>
  );
}
