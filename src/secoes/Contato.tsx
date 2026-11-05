import type { ConteudoSite } from "@/conteudo/esquema";
import { CopiarEmail, RevelarWhatsapp } from "@/componentes/AcoesContato";
import { existeArquivoPublico, PDF_PUBLICO } from "@/arquivos";
import { Secao } from "./Secao";

type Props = { c: ConteudoSite; numero: number; margem: string };

export function Contato({ c, numero, margem }: Props) {
  const k = c.contato;
  const linkedin = c.pessoa.linkedin.replace("https://www.", "").replace(/\/$/, "");
  const github = c.pessoa.github.replace("https://", "").replace(/\/$/, "");
  return (
    <Secao id="contato" numero={numero} margem={margem} titulo={k.titulo}>
      <p className="medida">{k.texto}</p>
      <a className="chamado-email link-ouro" href={`mailto:${c.pessoa.email}`} translate="no">
        {c.pessoa.email}
      </a>
      <div className="chamado-acoes">
        <a className="botao-quieto" href={c.pessoa.linkedin} target="_blank" rel="noopener noreferrer" translate="no">
          {linkedin}
        </a>
        <a className="botao-quieto" href={c.pessoa.github} target="_blank" rel="noopener noreferrer" translate="no">
          {github}
        </a>
        <RevelarWhatsapp texto={k.mostrarWhatsapp} />
        <CopiarEmail email={c.pessoa.email} textos={k} />
      </div>
      {existeArquivoPublico(PDF_PUBLICO) ? (
        <p style={{ marginTop: "1.5rem" }}>
          <a className="botao" href={`/${PDF_PUBLICO}`} download>
            {k.baixarPdf}
          </a>
        </p>
      ) : null}
    </Secao>
  );
}
