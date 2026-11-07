import type { Metadata, Viewport } from "next";
import { ViewTransition, type ReactNode } from "react";
import "../globais.css";
import { classesFontes } from "../fontes";
import { Barra } from "@/componentes/Barra";
import { Moldura } from "@/componentes/moldura/Moldura";
import { conteudo, secoesAtivas } from "@/conteudo";
import { TEMAS } from "@/temas/temas";
import { metadadosPagina, URL_SITE } from "@/site";

const c = conteudo("pt-BR");

// Padrão de todas as páginas: cada rota indexável sobrescreve título, descrição, canônico e cartões (src/site.ts).
export const metadata: Metadata = {
  ...metadadosPagina({ titulo: c.seo.inicio.titulo, descricao: c.seo.inicio.descricao, caminho: "/" }),
  metadataBase: new URL(URL_SITE),
  manifest: "/manifest.webmanifest",
  authors: [{ name: c.pessoa.nome, url: URL_SITE }],
  creator: c.pessoa.nome,
  icons: { icon: [{ url: "/icone.svg", type: "image/svg+xml" }], apple: "/apple-touch-icon.png" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: TEMAS[0].cores.fundo, colorScheme: "dark light" };

export default function Layout({ children }: { children: ReactNode }) {
  const secoes = secoesAtivas(c).map(({ id, rotulo, numero }) => ({ id, rotulo, numero }));
  return (
    <html lang="pt-BR" className={classesFontes} suppressHydrationWarning>
      <head>
        {/* Arquivo externo e síncrono: define o tema antes da pintura, sem script inline. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/tema.js" />
      </head>
      <body>
        <a className="pular" href="#conteudo">
          {c.ui.pularConteudo}
        </a>
        <Moldura secoes={secoes} ui={c.ui} />
        <Barra nome={c.pessoa.nome} secoes={secoes} ui={c.ui} />
        {/* Só a troca de rota anima. Sem isto, cada chunk carregado depois dispararia uma transição e engoliria cliques. */}
        <ViewTransition default="none" update={{ rota: "auto", default: "none" }}>
          <main id="conteudo">{children}</main>
        </ViewTransition>
      </body>
    </html>
  );
}
