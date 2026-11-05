import { ptBR } from "./pt-BR";
import type { ConteudoSite } from "./esquema";

export type Idioma = "pt-BR";
const CONTEUDOS: Record<Idioma, ConteudoSite> = { "pt-BR": ptBR };

export const conteudo = (idioma: Idioma = "pt-BR"): ConteudoSite => CONTEUDOS[idioma];

/** Seções ativas, na ordem. A numeração sai da posição: ativar "Obras" renumera Contato sozinho. */
export function secoesAtivas(c: ConteudoSite) {
  const obras = c.obrasAtivas && c.projetos.some((p) => p.publicado);
  return c.secoes.filter((s) => s.id !== "obras" || obras).map((s, numero) => ({ ...s, numero }));
}
