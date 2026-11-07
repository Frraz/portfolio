import type { Metadata } from "next";
import { conteudo } from "@/conteudo";

/** Endereço público do site. O build de produção recebe `SITE_URL`; sem ela, vale o domínio real, nunca localhost. */
export const URL_SITE = process.env.SITE_URL || "https://warley.ferzion.com.br";

/** Imagem de compartilhamento, gerada por `pnpm og` (scripts/gerar-og.ts). */
export const IMAGEM_OG = { url: "/og/warley-ferraz-almeida.png", width: 1200, height: 630 };

const c = conteudo("pt-BR");

/** Metadados de uma página indexável: título, descrição, endereço canônico e cartões de compartilhamento próprios. */
export function metadadosPagina({ titulo, descricao, caminho }: { titulo: string; descricao: string; caminho: string }): Metadata {
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: caminho === "/" ? "profile" : "website",
      locale: "pt_BR",
      siteName: c.pessoa.nome,
      url: caminho,
      title: titulo,
      description: descricao,
      images: [{ ...IMAGEM_OG, alt: c.seo.imagemAlt }],
    },
    twitter: { card: "summary_large_image", title: titulo, description: descricao, images: [IMAGEM_OG.url] },
  };
}
