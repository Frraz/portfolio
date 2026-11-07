// @vitest-environment node
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ptBR } from "@/conteudo/pt-BR";
import { Conteudo } from "@/conteudo/esquema";
import { SELOS } from "@/ctf/selos";
import hashes from "@/ctf/hashes.gerado.json";
import { completar, executar, type Contexto } from "@/terminal/comandos";

const c = Conteudo.parse(ptBR);
const memoria = new Map<string, string>();
vi.stubGlobal("localStorage", { getItem: (k: string) => memoria.get(k) ?? null, setItem: (k: string, v: string) => memoria.set(k, v) });
vi.stubGlobal("dispatchEvent", () => true);
vi.stubGlobal("CustomEvent", class { constructor(public type: string, public init?: unknown) {} });

const ctx: Contexto = { c, temas: ["rubro", "claro"], cabecalhos: async () => new Headers({ "content-security-policy": "default-src 'none'; script-src 'self'", "x-selo": "X" }), temPdf: async () => false, arquivoPdf: "/x.pdf" };

describe("terminal", () => {
  beforeEach(() => memoria.clear());

  it("ajuda lista os comandos sem inventar nada", async () => {
    const r = await executar("ajuda", ctx);
    expect(r.linhas.join("\n")).toContain("cabecalhos");
  });
  it("quemsou usa o cargo real e diz o curso em andamento", async () => {
    const r = await executar("whoami", ctx);
    expect(r.linhas).toContain(`${c.agora.cargo}, ${c.agora.empresa}`);
    expect(r.linhas.join(" ")).toContain("FIAP");
  });
  it("não publica o telefone: contato manda para a seção", async () => {
    const r = await executar("contato", ctx);
    expect(r.linhas.join(" ")).not.toMatch(/\d{5}-?\d{4}/);
    expect(r.linhas).toContain(c.terminal.whatsapp);
  });
  it.each([["sudo rm -rf /", "sudo"], ["rm -rf /", "rm"], ["nmap 10.0.0.1", "nmap"]] as const)("%s responde sem imitar ataque", async (entrada, chave) => {
    expect((await executar(entrada, ctx)).linhas).toEqual([c.terminal[chave]]);
  });
  it("comando desconhecido é escapado pelo chamador e curto", async () => {
    const r = await executar("x".repeat(500), ctx);
    expect(r.linhas[0].length).toBeLessThan(160);
  });
  it("script mostra a diretiva real", async () => {
    const r = await executar("<script>alert(1)</script>", ctx);
    expect(r.linhas[0]).toContain("script-src 'self'");
  });
  it("filtro de competências recusa área inválida", async () => {
    expect((await executar("competencias banana", ctx)).linhas[0]).toContain("área desconhecida");
    expect((await executar("competencias seguranca", ctx)).linhas.join(" ")).toContain("Burp Suite");
  });
  it("tema fósforo só abre depois de liberado", async () => {
    expect((await executar("tema fosforo", ctx)).linhas).toEqual([c.terminal.temaBloqueado]);
    expect((await executar("tema fosforo", { ...ctx, temas: [...ctx.temas, "fosforo"] })).efeito).toEqual({ tipo: "tema", id: "fosforo" });
  });
  it("completa nomes únicos", () => {
    expect(completar("cab")).toBe("cabecalhos");
    expect(completar("s")).toBeNull();
  });
  it("cabecalhos mostra os valores recebidos", async () => {
    const r = await executar("cabecalhos", ctx);
    expect(r.linhas.join("\n")).toContain("x-selo: X");
    expect(r.linhas.join("\n")).toContain(`strict-transport-security: ${c.terminal.semCabecalho}`);
  });
});

describe("selos", () => {
  beforeEach(() => memoria.clear());

  it("o bundle só guarda hashes corretos", () => {
    expect(hashes).toEqual(SELOS.map((s) => createHash("sha256").update(s).digest("hex")));
  });
  it("cada selo está no lugar prometido", () => {
    expect(readFileSync("deploy/cabecalhos.conf", "utf8")).toContain(`X-Selo "${SELOS[3]}"`);
    expect(readFileSync("src/app/globais.css", "utf8")).toContain(Buffer.from(SELOS[5]).toString("base64"));
    expect(readFileSync("src/movimento/ovos.ts", "utf8")).toContain(SELOS[1]);
    expect(c.terminal.lsTudo.join(" ")).toContain(SELOS[8]);
    expect(readFileSync("src/gl/chuva/shader.ts", "utf8")).toContain("LUMEN");
    expect(SELOS[7]).toBe("LUMEN");
  });
  it("confere, conta e não repete", async () => {
    expect((await executar("selo errado", ctx)).linhas).toEqual([c.ctf.invalido]);
    expect((await executar(`selo ${SELOS[2].toLowerCase()}`, ctx)).linhas[0]).toContain("selo 2 confirmado");
    expect((await executar(`selo ${SELOS[2]}`, ctx)).linhas).toEqual([c.ctf.repetido]);
  });
  it("os nove selos liberam a recompensa, sem afirmar competência", async () => {
    let ultima = { linhas: [] as string[] };
    for (const s of SELOS) ultima = await executar(`selo ${s}`, ctx);
    expect(ultima.linhas.join(" ")).toContain("não prova nada");
  });
});
