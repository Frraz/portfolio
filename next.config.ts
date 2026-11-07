import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import type { NextConfig } from "next";

// Identificador do build para o rodapé: o commit atual (só leitura) ou, sem Git, um hash do instante do build.
const agora = new Date();
let versao = "";
try {
  versao = execSync("git rev-parse --short=12 HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
} catch {}
if (!versao) versao = createHash("sha256").update(agora.toISOString()).digest("hex").slice(0, 12);

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
    // Sem SITE_URL, vale o domínio real: nenhuma URL canônica sai apontando para localhost.
    SITE_URL: process.env.SITE_URL || "https://warley.ferzion.com.br",
    WHATSAPP_ATIVO: numero ? "sim" : "",
    WHATSAPP_E: embaralhado,
    BUILD_HASH: versao,
    BUILD_DATA: agora.toISOString().slice(0, 10),
  },
};
export default config;
