const mesAno = new Intl.DateTimeFormat("pt-BR", { month: "2-digit", year: "numeric", timeZone: "UTC" });
const data = (iso: string) => new Date(`${iso.length === 7 ? `${iso}-01` : iso}T00:00:00Z`);

export const formatarMesAno = (iso: string) => mesAno.format(data(iso));
export const periodo = (inicio: string, fim: string | null, atual = "atual") => `${formatarMesAno(inicio)} – ${fim ? formatarMesAno(fim) : atual}`;

/** Fração do curso já decorrida, por data. Não mede aproveitamento. */
export function fracaoDecorrida(inicio: string, fim: string, hoje = new Date()) {
  const a = data(inicio).getTime();
  const b = data(fim).getTime();
  return Math.max(0, Math.min(1, (hoje.getTime() - a) / (b - a)));
}
