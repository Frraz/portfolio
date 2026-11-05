import { describe, expect, it } from "vitest";
import { secoesAtivas } from "@/conteudo";
import { Conteudo } from "@/conteudo/esquema";
import { ptBR } from "@/conteudo/pt-BR";
import { TEMAS } from "@/temas/temas";
import { contraste } from "@/temas/cor";
import { fracaoDecorrida, periodo } from "@/formatos";

describe("conteúdo", () => {
  it("segue o esquema", () => {
    expect(Conteudo.safeParse(ptBR).success).toBe(true);
  });
  it("tem oito seções sem Obras, com Contato em 7", () => {
    const s = secoesAtivas(ptBR);
    expect(s).toHaveLength(8);
    expect(s.at(-1)).toMatchObject({ id: "contato", numero: 7 });
    expect(s.find((x) => x.id === "obras")).toBeUndefined();
  });
  it("ao publicar um projeto, Obras vira a nona seção e renumera Contato", () => {
    const projeto = { slug: "a", nome: "A", resumo: "r", contexto: "c", situacao: "demonstracao" as const, demoUrl: null, stack: [], destaques: [], capa: null, publicado: true };
    const s = secoesAtivas({ ...ptBR, obrasAtivas: true, projetos: [projeto] });
    expect(s).toHaveLength(9);
    expect(s.at(-1)).toMatchObject({ id: "contato", numero: 8 });
  });
  it("Obras ativa sem projeto publicado continua oculta", () => {
    expect(secoesAtivas({ ...ptBR, obrasAtivas: true })).toHaveLength(8);
  });
  it("nada de PDF ou dado pessoal nos certificados", () => {
    expect(ptBR.certificados.itens).toHaveLength(36);
    expect(JSON.stringify(ptBR.certificados.itens)).not.toMatch(/\.pdf|cursos\//);
  });
});

describe("formatos", () => {
  it("formata período", () => {
    expect(periodo("2026-08", null)).toBe("08/2026 – atual");
    expect(periodo("2020-09", "2021-07")).toBe("09/2020 – 07/2021");
  });
  it("mede o tempo decorrido sem passar de 0 a 1", () => {
    expect(fracaoDecorrida("2026-02", "2028-02", new Date("2027-02-01"))).toBeCloseTo(0.5, 1);
    expect(fracaoDecorrida("2026-02", "2028-02", new Date("2020-01-01"))).toBe(0);
    expect(fracaoDecorrida("2026-02", "2028-02", new Date("2030-01-01"))).toBe(1);
  });
});

describe("temas", () => {
  it.each(TEMAS.map((t) => [t.id, t] as const))("%s tem texto em AA", (_, t) => {
    expect(contraste(t.cores.tinta, t.cores.fundo)).toBeGreaterThanOrEqual(4.5);
    expect(contraste(t.cores.tinta2, t.cores.superficie)).toBeGreaterThanOrEqual(4.5);
  });
});
