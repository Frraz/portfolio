/**
 * Registro da sessão (docs/07): só eventos reais desta visita, só na memória da aba.
 * Nunca guarda IP, navegador, localização nem o que o visitante digita. Nada sai do navegador.
 */
export type Evento = { t: number; hora: string; tipo: "info" | "acao" | "flag"; texto: string };

const LIMITE = 50;
let eventos: readonly Evento[] = [];
const VAZIO: readonly Evento[] = [];
const ouvintes = new Set<() => void>();

/** Instantâneo imutável: troca de referência a cada evento, como pede o useSyncExternalStore. */
export const lerEventos = (): readonly Evento[] => eventos;
export const lerEventosServidor = (): readonly Evento[] => VAZIO;
export function assinar(fn: () => void) {
  ouvintes.add(fn);
  return () => void ouvintes.delete(fn);
}

/** `t` opcional: tempo já medido pelo navegador (por exemplo, o fim da resposta HTML). */
export function registrar(tipo: Evento["tipo"], texto: string, t = performance.now()) {
  if (typeof window === "undefined") return;
  const agora = new Date();
  const e: Evento = { t, hora: agora.toISOString().slice(11, 23), tipo, texto };
  eventos = [...eventos, e].slice(-LIMITE);
  for (const fn of ouvintes) fn();
}
