import type { Metadata } from "next";
import "./globais.css";
import { classesFontes } from "./fontes";
import { conteudo } from "@/conteudo";

const c = conteudo("pt-BR");
export const metadata: Metadata = { title: c.estados.naoEncontradaTitulo, robots: { index: false } };

export default function NaoEncontrada() {
  return (
    <html lang="pt-BR" className={classesFontes} suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/tema.js" />
      </head>
      <body>
        <main className="leitura">
          <h1>{c.estados.naoEncontradaTitulo}</h1>
          <p style={{ marginTop: "1rem" }}>{c.estados.naoEncontrada}</p>
          <p style={{ marginTop: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="botao" href="/">
              {c.estados.voltar}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
