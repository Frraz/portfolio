import { describe, expect, it } from "vitest";
import { buscarProblemas, variantesTelefone } from "@/conteudo/verificacao";

const op = { numero: "5511987654321", ativas: false };

describe("verificador de conteúdo", () => {
  it("aceita texto limpo", () => {
    expect(buscarProblemas("Analista de Redes N2 em NOC. Estudante na FIAP.", "t", op)).toEqual([]);
  });
  it.each([["Trabalhei com Kubernetes"], ["Fundador da empresa"], ["Especialista em redes"], ["sou hacker"], ["SafraLog"], ["Ferzion é minha empresa"], ["100% de satisfação"]])("barra termo proibido: %s", (texto) => {
    expect(buscarProblemas(texto, "t", op).length).toBeGreaterThan(0);
  });
  it.each([["Byakugan"], ["um projeto acadêmico"], ["ConfTech"], ["Rebanho360"]])("barra projeto enquanto Obras está inativa: %s", (texto) => {
    expect(buscarProblemas(texto, "t", op).length).toBeGreaterThan(0);
  });
  it("aceita o domínio do site, mas não o nome da empresa fora dele", () => {
    expect(buscarProblemas("Canonical: https://warley.ferzion.com.br/cv", "t", op)).toEqual([]);
    expect(buscarProblemas("Trabalho na Ferzion em warley.ferzion.com.br", "t", op).length).toBeGreaterThan(0);
  });
  it("libera projeto quando Obras está ativa", () => {
    expect(buscarProblemas("ConfTech", "t", { ...op, ativas: true })).toEqual([]);
  });
  it("barra CPF e pretensão salarial", () => {
    expect(buscarProblemas("CPF 123.456.789-09", "t", op).length).toBeGreaterThan(0);
    expect(buscarProblemas("Pretensão de R$ 2.000", "t", op).length).toBeGreaterThan(0);
  });
  it.each(variantesTelefone("5511987654321"))("barra telefone no formato %s", (v) => {
    expect(buscarProblemas(`contato ${v}`, "t", op).some((p) => p.includes("telefone"))).toBe(true);
  });
  it("fora do modo estrito ainda barra telefone em bundle", () => {
    expect(buscarProblemas("a=5511987654321", "x.js", { ...op, estrito: false }).length).toBeGreaterThan(0);
  });
});
