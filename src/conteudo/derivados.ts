/**
 * Dados derivados do conteúdo, calculados no build (docs/05, "Elementos gráficos").
 * Nada aqui é texto novo: cada valor vem de um fato já publicado em `src/conteudo/`.
 * Usa `node:crypto`, então só roda em Server Components e scripts.
 */
import { createHash } from "node:crypto";

export type LinhaHex = { offset: string; bytes: string[]; ascii: string };

/** Hexdump no formato do `xxd`: 16 bytes por linha, UTF-8 real do texto. */
export function hexdump(texto: string, porLinha = 16): LinhaHex[] {
  const bytes = new TextEncoder().encode(texto);
  const linhas: LinhaHex[] = [];
  for (let i = 0; i < bytes.length; i += porLinha) {
    const parte = bytes.slice(i, i + porLinha);
    linhas.push({
      offset: i.toString(16).padStart(8, "0"),
      bytes: Array.from(parte, (b) => b.toString(16).padStart(2, "0")),
      ascii: Array.from(parte, (b) => (b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : ".")).join(""),
    });
  }
  return linhas;
}

/** SHA-256 em hexadecimal de um registro, na ordem fixa dos campos. */
export function fingerprint(campos: (string | null)[]): string {
  return createHash("sha256").update(campos.map((c) => c ?? "").join("␟")).digest("hex");
}

/** Os 12 primeiros caracteres bastam para conferência visual. */
export const curto = (hex: string, n = 12) => hex.slice(0, n);

/** Bits do hash do build, para a faixa binária do rodapé. */
export function bitsDoHash(hex: string, n = 64): string {
  return hex
    .split("")
    .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("")
    .slice(0, n);
}

/** Anos e meses completos entre dois AAAA-MM, contados em UTC. */
export function tempoDecorrido(inicio: string, hoje = new Date()): { anos: number; meses: number } {
  const [a, m] = inicio.split("-").map(Number);
  const total = (hoje.getUTCFullYear() - a) * 12 + (hoje.getUTCMonth() + 1 - m);
  const t = Math.max(0, total);
  return { anos: Math.floor(t / 12), meses: t % 12 };
}

/** "2.600 h" vira 2600. Texto sem horas, como "8 h estimadas", lê o primeiro número. Sem número, nulo. */
export function horas(carga: string | null): number | null {
  const m = carga?.match(/\d[\d.]*/);
  return m ? Number(m[0].replace(/\./g, "")) : null;
}
