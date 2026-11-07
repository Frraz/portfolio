/** Progresso do CTF: só no navegador do visitante, sem servidor nem placar. */
import hashes from "./hashes.gerado.json" with { type: "json" };

const CHAVE = "selos";
export const TOTAL_SELOS = hashes.length;

export function selosObtidos(): number[] {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
    return Array.isArray(v) ? v.filter((n) => Number.isInteger(n) && n >= 0 && n < TOTAL_SELOS) : [];
  } catch {
    return [];
  }
}

export async function hashTexto(texto: string) {
  const dados = new TextEncoder().encode(texto);
  const bruto = await crypto.subtle.digest("SHA-256", dados);
  return [...new Uint8Array(bruto)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Devolve o índice do selo, ou -1. O código não diferencia maiúsculas. */
export async function conferirSelo(codigo: string) {
  const h = await hashTexto(codigo.trim().toUpperCase());
  return hashes.indexOf(h);
}

export function registrarSelo(indice: number) {
  const atual = selosObtidos();
  if (atual.includes(indice)) return { novo: false, total: atual.length };
  const lista = [...atual, indice].sort((a, b) => a - b);
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {}
  dispatchEvent(new CustomEvent("sinal:selo", { detail: { indice, total: lista.length } }));
  return { novo: true, total: lista.length };
}

export const ctfCompleto = () => selosObtidos().length === TOTAL_SELOS;
