/**
 * Barra o que não pode ir a público. Roda antes do build e, com --saida, sobre os arquivos gerados.
 * Regras: docs/01-veracidade-e-fontes.md
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { Conteudo } from "../src/conteudo/esquema.ts";
import { ptBR } from "../src/conteudo/pt-BR.ts";
import { buscarProblemas } from "../src/conteudo/verificacao.ts";

function carregarEnvLocal() {
  if (process.env.WHATSAPP_NUMERO || !existsSync(".env.local")) return;
  for (const l of readFileSync(".env.local", "utf8").split("\n")) {
    const m = l.match(/^WHATSAPP_NUMERO=(.*)$/);
    if (m) process.env.WHATSAPP_NUMERO = m[1].trim();
  }
}
carregarEnvLocal();
const NUMERO = process.env.WHATSAPP_NUMERO ?? "";

const validacao = Conteudo.safeParse(ptBR);
if (!validacao.success) {
  console.error("✗ Conteúdo fora do esquema:\n" + validacao.error.message);
  process.exit(1);
}

const problemas: string[] = buscarProblemas(JSON.stringify(ptBR), "conteúdo pt-BR", { numero: NUMERO, ativas: ptBR.obrasAtivas });

if (process.argv.includes("--saida")) {
  const percorrer = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const p = join(dir, n);
      return statSync(p).isDirectory() ? percorrer(p) : [p];
    });
  for (const arquivo of percorrer("out")) {
    if (arquivo.endsWith(".pdf") && !arquivo.endsWith("curriculo-warley-ferraz-almeida.pdf")) problemas.push(`PDF inesperado em ${arquivo}`);
    if (!/\.(html|js|css|json|txt|xml|webmanifest|map|svg)$/.test(arquivo)) continue;
    // O texto das regras do verificador não vai ao site, então tudo aqui é conteúdo público.
    problemas.push(...buscarProblemas(readFileSync(arquivo, "utf8"), arquivo, { numero: NUMERO, ativas: ptBR.obrasAtivas, estrito: false }));
  }
}

if (problemas.length) {
  console.error(`✗ Verificação de conteúdo: ${problemas.length} problema(s)`);
  for (const p of problemas) console.error("  - " + p);
  process.exit(1);
}
console.log("✓ Conteúdo: esquema válido, sem termos proibidos, PII ou telefone.");
