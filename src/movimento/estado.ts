/**
 * Estado compartilhado entre DOM e cena, fora do React: muda a cada quadro e não pode causar re-render.
 * Quem escreve é o motor de cada recurso; a cena só lê.
 */
export const estadoCena = {
  /** Konami: as cabeças de todas as colunas ficam em branco quente por 20 s. */
  aceso: 0,
  /** Recompensa do CTF: troca a frase da coluna. */
  coelho: false,
  /** Cena pede redesenho mesmo com a chuva pausada. */
  sujo: 0,
};

/** Dados reais da cena para a moldura de instrumento (docs/05). Quem decide o nível escreve aqui. */
export const hud: { nivel: string } = { nivel: "" };

export const reduzido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
