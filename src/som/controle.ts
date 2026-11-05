/** Interface leve do som: o motor só é baixado depois de um clique. */
export const CHAVE_SOM = "nave:som";

export async function alternarSom(ligado: boolean) {
  const { ligar, desligar } = await import("./motor");
  if (ligado) ligar();
  else desligar();
  dispatchEvent(new CustomEvent(CHAVE_SOM, { detail: ligado }));
}
