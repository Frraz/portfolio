import type { Metadata, Viewport } from "next";
import { ViewTransition, type ReactNode } from "react";
import "../globais.css";
import { classesFontes } from "../fontes";
import { Barra } from "@/componentes/Barra";
import { Moldura } from "@/componentes/moldura/Moldura";
import { Regua } from "@/componentes/moldura/Regua";
import { conteudo, secoesAtivas } from "@/conteudo";
import { TEMAS } from "@/temas/temas";

const c = conteudo("pt-BR");
const URL_SITE = process.env.SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  manifest: "/manifest.webmanifest",
  title: c.seo.inicio.titulo,
  description: c.seo.inicio.descricao,
  authors: [{ name: c.pessoa.nome }],
  openGraph: { type: "profile", locale: "pt_BR", siteName: c.pessoa.nome, title: c.seo.inicio.titulo, description: c.seo.inicio.descricao },
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
        <Regua secoes={secoes} rotulo={c.ui.regua} />
        <Barra nome={c.pessoa.nome} secoes={secoes} ui={c.ui} />
        {/* Só a troca de rota anima. Sem isto, cada chunk carregado depois dispararia uma transição e engoliria cliques. */}
        <ViewTransition default="none" update={{ rota: "auto", default: "none" }}>
          <main id="conteudo">{children}</main>
        </ViewTransition>
      </body>
    </html>
  );
}
