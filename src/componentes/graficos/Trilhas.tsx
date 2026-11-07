import { SELOS } from "@/ctf/selos";
import { TRILHAS, TRILHAS_ALTURA, TRILHAS_LARGURA } from "./trilhas.gerado";

/**
 * Trilhas de placa de circuito de uma seção (gerador em scripts/gerar-trilhas.ts). Só decoração.
 * A máscara apaga a placa do lado do texto e nas bordas, para ela nunca disputar a leitura.
 */
export function Trilhas({ secao }: { secao: string }) {
  const t = TRILHAS[secao];
  if (!t) return null;
  const mascara = `trilhas-mascara-${secao}`;
  const degrade = `trilhas-degrade-${secao}`;
  return (
    <svg className="trilhas" viewBox={`0 0 ${TRILHAS_LARGURA} ${TRILHAS_ALTURA}`} preserveAspectRatio="xMaxYMin slice" aria-hidden="true" focusable="false">
      {/* Selo 6 do CTF, de propósito à vista nos metadados do SVG (docs/07). */}
      {secao === "inicio" ? <metadata>{`selo 6: ${SELOS[6]}`}</metadata> : null}
      <defs>
        <linearGradient id={degrade} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.78" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.97" stopColor="#fff" stopOpacity="0.6" />
        </linearGradient>
        <mask id={mascara} maskUnits="userSpaceOnUse" x="0" y="0" width={TRILHAS_LARGURA} height={TRILHAS_ALTURA}>
          <rect width={TRILHAS_LARGURA} height={TRILHAS_ALTURA} fill={`url(#${degrade})`} />
        </mask>
      </defs>
      <g mask={`url(#${mascara})`} fill="none" stroke="currentColor">
        <path className="trilhas-cobre" d={t.d} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {t.corpos.map(([x, y, w, h], i) => (
          <rect key={i} className="trilhas-corpo" x={x} y={y} width={w} height={h} strokeWidth="1.5" />
        ))}
        {t.pads.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="currentColor" stroke="none" />
        ))}
        {t.vias.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" strokeWidth="2" />
        ))}
      </g>
    </svg>
  );
}
