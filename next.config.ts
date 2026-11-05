import type { NextConfig } from "next";

// O número nunca fica em texto puro no bundle: é embaralhado aqui e só o chunk da revelação o conhece.
const numero = process.env.WHATSAPP_NUMERO ?? "";
const CHAVE = "rendilhado";
const embaralhado = Buffer.from([...numero].map((c, i) => c.charCodeAt(0) ^ CHAVE.charCodeAt(i % CHAVE.length))).toString("base64");

// Site 100% estático: sem servidor de aplicação. Decisão 8 em docs/decisoes.md.
const config: NextConfig = {
  output: "export",
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: { unoptimized: true },
  experimental: { globalNotFound: true },
  env: {
    SITE_URL: process.env.SITE_URL ?? "http://localhost:3000",
    WHATSAPP_ATIVO: numero ? "sim" : "",
    WHATSAPP_E: embaralhado,
  },
};
export default config;
