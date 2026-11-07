/**
 * Onde a página está. Lido da rolagem a cada quadro, sem evento: o teto de luz do texto não pode ficar defasado.
 * As medidas ficam em cache e só são refeitas quando o layout muda.
 */
export const ORDEM_SECOES = ["sobre", "agora", "trajetoria", "formacao", "competencias", "certificados", "contato"] as const;

type Medida = { topo: number; altura: number };
let medidas: Medida[] = [];
/** Hero primeiro: a seção que cruza o centro da tela decide qual forma aparece. */
const TODAS = ["inicio", ...ORDEM_SECOES] as const;
let medidasTodas: Medida[] = [];

export function medirTrilha() {
  const medir = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return { topo: 1e9, altura: 1 };
    const r = el.getBoundingClientRect();
    return { topo: r.top + scrollY, altura: Math.max(r.height, 1) };
  };
  medidasTodas = TODAS.map(medir);
  medidas = medidasTodas.slice(1);
}

/** `t` contínuo (seção + progresso, de 0 a 7) e a seção ativa com o progresso dentro dela. */
export function lerTrilha() {
  const y = scrollY;
  const meio = y + innerHeight * 0.5;
  let t = 0;
  for (let i = 0; i < medidas.length; i++) {
    const m = medidas[i];
    if (meio >= m.topo) t = i + Math.min(1, (meio - m.topo) / m.altura);
  }
  let ativa = 0;
  for (let i = 0; i < medidasTodas.length; i++) if (meio >= medidasTodas[i].topo) ativa = i;
  const m = medidasTodas[ativa];
  return { t, y, secao: TODAS[ativa] as string, p: m ? Math.min(1, Math.max(0, (meio - m.topo) / m.altura)) : 0 };
}
