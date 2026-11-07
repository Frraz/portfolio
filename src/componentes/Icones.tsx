/** Ícones das partes que carregam com a página (barra e contato), desenhados aqui para não levar uma biblioteca de ícones ao JavaScript inicial. Os menus, que carregam depois, usam lucide-react. */
type P = { tamanho?: number };

const base = (t: number) => ({ width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true });

export function IconePausar({ tamanho = 16 }: P) {
  return (
    <svg {...base(tamanho)}>
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

export function IconeTocar({ tamanho = 16 }: P) {
  return (
    <svg {...base(tamanho)}>
      <path d="M6 4.5v15a1 1 0 0 0 1.5.87l12-7.5a1 1 0 0 0 0-1.74l-12-7.5A1 1 0 0 0 6 4.5z" />
    </svg>
  );
}

export function IconeCopiar({ tamanho = 16 }: P) {
  return (
    <svg {...base(tamanho)}>
      <rect x="8" y="8" width="14" height="14" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export function IconeMensagem({ tamanho = 16 }: P) {
  return (
    <svg {...base(tamanho)}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
