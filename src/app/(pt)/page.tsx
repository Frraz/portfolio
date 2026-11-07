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
  return (
    <>
      <Palco />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pessoa) }} />
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
