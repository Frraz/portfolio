import localFont from "next/font/local";

export const fonteTitulo = localFont({
  src: "../fontes/grenze-gotisch.woff2",
  weight: "100 900",
  variable: "--fonte-titulo",
  display: "swap",
  preload: true,
  adjustFontFallback: "Times New Roman",
});
// Itálico fica de fora da pré-carga: aparece só na margem, como fonte de fallback sintética até carregar.
export const fonteTexto = localFont({
  src: [{ path: "../fontes/literata.woff2", weight: "200 900", style: "normal" }],
  variable: "--fonte-texto",
  display: "swap",
  preload: true,
  adjustFontFallback: "Times New Roman",
});
export const fonteDado = localFont({
  src: "../fontes/jetbrains-mono.woff2",
  weight: "100 800",
  variable: "--fonte-dado",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});
export const fonteNumero = localFont({
  src: "../fontes/jacquard-24.woff2",
  weight: "400",
  variable: "--fonte-numero",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});
export const classesFontes = [fonteTitulo, fonteTexto, fonteDado, fonteNumero].map((f) => f.variable).join(" ");
