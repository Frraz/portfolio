import type { ConteudoSite } from "@/conteudo/esquema";
import { CopiarEmail, RevelarWhatsapp } from "@/componentes/AcoesContato";
import { existeArquivoPublico, PDF_PUBLICO } from "@/arquivos";
import { Secao } from "./Secao";

export function Contato({ c }: { c: ConteudoSite }) {
  const k = c.contato;
  const linkedin = c.pessoa.linkedin.replace("https://www.", "").replace(/\/$/, "");
  const github = c.pessoa.github.replace("https://", "").replace(/\/$/, "");
  return (
    <Secao id="contato" titulo={k.titulo} forma>
      <p className="medida introducao">{k.texto}</p>
      <div className="contato-email">
        <a className="chamado-email" href={`mailto:${c.pessoa.email}`} translate="no">
          {c.pessoa.email}
        </a>
        <CopiarEmail email={c.pessoa.email} textos={k} />
      </div>
      {/* Cada canal é uma linha: o nome do canal à esquerda, o endereço real à direita. */}
      <ul className="canais" aria-label={k.canais.rotulo}>
        <li>
          <a className="canal" href={c.pessoa.linkedin} target="_blank" rel="noopener noreferrer">
            <span className="canal-rotulo">{k.canais.linkedin}</span>
            <span className="canal-valor" translate="no">
              {linkedin}
            </span>
          </a>
        </li>
        <li>
          <a className="canal" href={c.pessoa.github} target="_blank" rel="noopener noreferrer">
            <span className="canal-rotulo">{k.canais.github}</span>
            <span className="canal-valor" translate="no">
              {github}
            </span>
          </a>
        </li>
        {process.env.WHATSAPP_ATIVO ? (
          <li className="canal canal-acao sem-js-oculto">
            <span className="canal-rotulo">{k.canais.whatsapp}</span>
            <RevelarWhatsapp texto={k.mostrarWhatsapp} />
          </li>
        ) : null}
      </ul>
      {existeArquivoPublico(PDF_PUBLICO) ? (
        <p className="contato-pdf">
          <a className="botao-sec" href={`/${PDF_PUBLICO}`} download>
            {k.baixarPdf}
          </a>
        </p>
      ) : null}
    </Secao>
  );
}
