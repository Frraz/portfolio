/**
 * Estado que a chuva escreve a cada quadro e as formas (cenas A e B) leem. Fora do React: muda por quadro.
 */
import type * as THREE from "three";

export const partilha = {
  /** Seção que cruza o centro da tela e o progresso dentro dela (0 a 1). */
  secao: "inicio" as string,
  p: 0,
  /** Tamanho da tela em px de CSS e em células da chuva. */
  largura: 1,
  altura: 1,
  colunas: 1,
  fileiras: 1,
  /** Teto de luminância atrás do texto e posição a partir da qual a tela fica livre de texto. */
  teto: 10,
  livreX: 1e5,
  tempo: 0,
  /** Canvas do nome do hero e aviso de que ele mudou neste quadro. */
  nomeCanvas: null as HTMLCanvasElement | null,
  nomeMudou: false,
  /** Textura de máscara produzida pela cena A. */
  mascaraA: null as THREE.Texture | null,
  /** Cena parada (movimento reduzido ou chuva pausada): as formas não animam. */
  parada: false,
};
