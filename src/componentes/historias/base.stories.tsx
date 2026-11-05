import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Filtro } from "../Filtro";
import { RevelarWhatsapp, CopiarEmail } from "../AcoesContato";
import { Margem } from "../Margem";
import { rosaceaSvg } from "@/ornamentos";
import { ptBR } from "@/conteudo/pt-BR";

const meta: Meta = { title: "Base" };
export default meta;
type H = StoryObj;

export const Botoes: H = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
      <button type="button" className="botao">
        Ver currículo
      </button>
      <button type="button" className="botao-quieto">
        Botão quieto
      </button>
      <a className="link-ouro" href="#contato">
        Falar comigo
      </a>
    </div>
  ),
};

export const Filtros: H = { render: () => <Filtro grupo="area" rotulo="Áreas" opcoes={ptBR.competencias.filtros} /> };
export const Contato: H = {
  render: () => (
    <div className="chamado-acoes">
      <RevelarWhatsapp texto={ptBR.contato.mostrarWhatsapp} />
      <CopiarEmail email={ptBR.pessoa.email} textos={ptBR.contato} />
    </div>
  ),
};
export const MargemManuscrito: H = { render: () => <div style={{ width: 120 }}><Margem numero={3} nome="Peregrinação" /></div> };
export const Vitral: H = { render: () => <div className="vitral" style={{ padding: "2rem", maxWidth: "32rem" }}>Painel de vidro. O alfa mínimo foi calculado para o pior caso atrás dele.</div> };
export const Rosacea: H = {
  render: () => <div className="poster-rosacea" style={{ position: "relative", right: "auto", top: "auto", ["--tam" as string]: "420px" }} dangerouslySetInnerHTML={{ __html: rosaceaSvg() }} />,
};
