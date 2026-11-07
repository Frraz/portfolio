/**
 * Níveis de qualidade da cena. Palpite inicial por heurística local, sem dado externo,
 * corrigido em execução pelo controlador de quadros.
 */
export type Nivel = "alto" | "medio" | "baixo";
export const CONFIG: Record<Nivel, { camadas: number; dprMax: number; pos: boolean }> = {
  alto: { camadas: 3, dprMax: 2, pos: true },
  medio: { camadas: 2, dprMax: 1.5, pos: true },
  baixo: { camadas: 1, dprMax: 1.25, pos: false },
};
const ORDEM: Nivel[] = ["baixo", "medio", "alto"];

export function nivelInicial(): Nivel {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const celular = matchMedia("(pointer: coarse)").matches;
  const nucleos = nav.hardwareConcurrency ?? 4;
  const memoria = nav.deviceMemory ?? 8;
  if (celular) return nucleos >= 8 && memoria >= 6 ? "medio" : "baixo";
  return nucleos >= 6 && memoria >= 8 ? "alto" : "medio";
}

export const nivelAbaixo = (n: Nivel): Nivel | null => ORDEM[ORDEM.indexOf(n) - 1] ?? null;

/** Média móvel de 60 quadros. Reduz DPR e depois o nível; sobe só o DPR, para não oscilar. */
export class Controlador {
  private soma = 0;
  private quadros = 0;
  private bom = 0;
  constructor(
    private aoReduzir: () => void,
    private aoSubirDpr: () => void,
  ) {}
  medir(ms: number) {
    if (ms > 250) return; // aba voltou de segundo plano
    this.soma += ms;
    this.quadros++;
    if (this.quadros < 60) return;
    const media = this.soma / this.quadros;
    this.soma = 0;
    this.quadros = 0;
    if (media > 22) {
      this.bom = 0;
      this.aoReduzir();
    } else if (media < 14) {
      this.bom++;
      if (this.bom >= 5) {
        this.bom = 0;
        this.aoSubirDpr();
      }
    } else {
      this.bom = 0;
    }
  }
}
