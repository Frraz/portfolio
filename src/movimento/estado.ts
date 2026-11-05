/**
 * Estado compartilhado entre DOM e cena, fora do React: muda a cada quadro e não pode causar re-render.
 * Quem escreve é o motor de cada recurso; a cena só lê.
 */
export const estadoCena = {
  /** Rosácea acesa por inteiro: Konami ou tema Selado. */
  aceso: 0,
  /** Com as oito ONUs acesas, a cor do vitral passa à chuva da seção Agora. */
  corDivisor: 0,
  /** Quantos selos o filtro atual mostra: é o que sobe à frente do relicário. */
  selosAtivos: 21,
  /** Recompensa do CTF: troca a frase da coluna. */
  coelho: false,
  /** Cena pede redesenho mesmo com a chuva pausada. */
  sujo: 0,
};

export const reduzido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
