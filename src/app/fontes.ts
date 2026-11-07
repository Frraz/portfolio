import localFont from "next/font/local";

// Mona Sans: nome, títulos e leitura. O eixo de largura (75–125) é a assinatura do site.
export const fonteTexto = localFont({
  src: "../fontes/mona-sans.woff2",
  weight: "200 900",
  variable: "--fonte-texto",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  // Intervalo de largura declarado para o navegador aceitar font-stretch 75%–125%.
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
});
// JetBrains Mono: só dado real (hora, hash, código, comando). Mais estreita que a Martian Mono, que deixava
// os números com buracos ("420  h") e o conjunto quadrado demais (decisão 87).
export const fonteDado = localFont({
  src: "../fontes/jetbrains-mono.woff2",
  weight: "100 800",
  variable: "--fonte-dado",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});
export const classesFontes = [fonteTexto, fonteDado].map((f) => f.variable).join(" ");
