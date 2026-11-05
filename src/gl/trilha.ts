/**
 * Onde a câmera está. Lido da rolagem a cada quadro, sem evento: o teto de luz do texto não pode ficar defasado.
 * As medidas ficam em cache e só são refeitas quando o layout muda.
 */
export const ORDEM_SECOES = ["sobre", "agora", "trajetoria", "formacao", "competencias", "certificados", "contato"] as const;

type Medida = { topo: number; altura: number };
let heroFim = 1;
let medidas: Medida[] = [];
let rosacea = { cx: 0, cy: 0, largura: 600 };

export function medirTrilha() {
  const trilho = document.querySelector<HTMLElement>(".hero-trilho") ?? document.querySelector<HTMLElement>(".hero");
  const alturaTela = innerHeight;
  const posterRosacea = document.querySelector(".poster-rosacea")?.getBoundingClientRect();
  if (posterRosacea) rosacea = { cx: posterRosacea.left + posterRosacea.width / 2, cy: posterRosacea.top + posterRosacea.height / 2, largura: posterRosacea.width };
  // A âncora da primeira seção para acima do fim do hero por causa da barra fixa.
  heroFim = Math.max(((trilho?.offsetHeight ?? alturaTela) - alturaTela * 0.15) * 0.92, 1);
  medidas = ORDEM_SECOES.map((id) => {
    const el = document.getElementById(id);
    if (!el) return { topo: 1e9, altura: 1 };
    const r = el.getBoundingClientRect();
    return { topo: r.top + scrollY, altura: Math.max(r.height, 1) };
  });
}

/** Medida em cache: fica em um palco fixo, e só muda quando a janela muda. */
export const medidaRosacea = () => rosacea;

/** `p` de 0 a 1 ao atravessar o vitral. `t` contínuo: seção + progresso, de 0 a 7. */
export function lerTrilha() {
  const y = scrollY;
  const meio = y + innerHeight * 0.5;
  let t = 0;
  for (let i = 0; i < medidas.length; i++) {
    const m = medidas[i];
    if (meio >= m.topo) t = i + Math.min(1, (meio - m.topo) / m.altura);
  }
  return { p: Math.min(1, y / heroFim), t, y };
}
