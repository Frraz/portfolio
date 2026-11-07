/**
 * Comandos do terminal: funções puras sobre o conteúdo, cobertas por testes.
 * Nunca imitam invasão, listam arquivos falsos do servidor ou mostram dados do visitante. Regras em docs/07.
 */
import type { ConteudoSite } from "@/conteudo/esquema";
import { periodo } from "@/formatos";
import { conferirSelo, registrarSelo, selosObtidos, TOTAL_SELOS } from "@/ctf/progresso";

export type Efeito =
  | { tipo: "limpar" }
  | { tipo: "fechar" }
  | { tipo: "abrir"; rota: string }
  | { tipo: "baixar"; arquivo: string }
  | { tipo: "tema"; id: string; temporario?: boolean }
  | { tipo: "chuva"; pausada: boolean };

export type Resposta = { linhas: string[]; efeito?: Efeito };

export type Contexto = {
  c: ConteudoSite;
  /** Temas disponíveis para o visitante agora. */
  temas: string[];
  /** Lê um cabeçalho real de HEAD /. Injetado para poder ser testado sem rede. */
  cabecalhos: () => Promise<Headers | null>;
  temPdf: () => Promise<boolean>;
  arquivoPdf: string;
};

const CABECALHOS = ["content-security-policy", "x-content-type-options", "referrer-policy", "permissions-policy", "cross-origin-opener-policy", "strict-transport-security", "x-selo"];

const trocar = (t: string, v: string) => t.replace("{x}", v);

export const NOMES = ["ajuda", "help", "quemsou", "whoami", "sobre", "agora", "trajetoria", "formacao", "competencias", "certificados", "contato", "cv", "pdf", "tema", "chuva", "seguranca", "cabecalhos", "selos", "selo", "ls", "limpar", "clear", "sair", "exit"];

export async function executar(entrada: string, ctx: Contexto): Promise<Resposta> {
  const bruto = entrada.trim();
  if (!bruto) return { linhas: [] };
  const { c } = ctx;
  const k = c.terminal;
  const [cmd, ...args] = bruto.split(/\s+/);
  const nome = cmd.toLowerCase();
  const arg = args[0]?.toLowerCase();

  if (/<\s*script/i.test(bruto)) {
    const h = await ctx.cabecalhos();
    const diretiva = h?.get("content-security-policy")?.split(";").find((d) => d.trim().startsWith("script-src"))?.trim() ?? "script-src 'self'";
    return { linhas: [trocar(k.script, diretiva)] };
  }
  if (nome === "sudo") return { linhas: [k.sudo] };
  if (nome === "rm") return { linhas: [k.rm] };
  if (nome === "nmap") return { linhas: [k.nmap] };
  if (nome === "matrix") return { linhas: [k.matrix], efeito: { tipo: "tema", id: "fosforo", temporario: true } };

  switch (nome) {
    case "ajuda":
    case "help":
      return { linhas: Object.entries(k.ajuda).map(([n, d]) => `${n.padEnd(24)} ${d}`) };
    case "quemsou":
    case "whoami": {
      const atual = c.formacao.cursos.find((f) => !f.concluido);
      return { linhas: [c.pessoa.nome, `${c.agora.cargo}, ${c.agora.empresa}`, atual ? `${atual.nome}, ${atual.instituicao}` : ""].filter(Boolean) };
    }
    case "sobre":
      return { linhas: [...c.sobre.paragrafos, "", c.sobre.aindaNaoTenhoTitulo, c.sobre.aindaNaoTenho, "", c.sobre.procuroTitulo, c.sobre.procuro] };
    case "agora":
      return { linhas: [`${c.agora.cargo}, ${c.agora.empresa}`, c.agora.periodo, "", ...c.agora.atividades.map((a) => `- ${a}`), "", `${c.agora.ferramentasTitulo}: ${c.agora.ferramentas.join(", ")}`] };
    case "trajetoria":
      return { linhas: c.trajetoria.experiencias.map((e) => `${periodo(e.inicio, e.fim, k.atual).padEnd(20)} ${e.cargo}, ${e.empresa}`) };
    case "formacao":
      return { linhas: c.formacao.cursos.map((f) => `${f.nome}, ${f.instituicao}: ${f.concluido ? k.concluido : `${k.emAndamento} (${k.previsao} ${periodo(f.fim, f.fim).split(" ")[0]})`}`) };
    case "competencias": {
      const areas = Object.keys(c.competencias.filtros).filter((a) => a !== "todas");
      if (arg && !areas.includes(arg)) return { linhas: [trocar(k.areaInvalida, areas.join(", "))] };
      return {
        linhas: c.competencias.grupos.flatMap((g) => {
          const itens = g.itens.filter((i) => !arg || (i.areas as string[]).includes(arg));
          return itens.length ? [`${g.titulo}: ${g.explicacao}`, ...itens.map((i) => `  ${i.nome}`), ""] : [];
        }),
      };
    }
    case "certificados": {
      const areas = Object.keys(c.certificados.filtros).filter((a) => a !== "todas");
      if (arg && !areas.includes(arg)) return { linhas: [trocar(k.areaInvalida, areas.join(", "))] };
      return { linhas: c.certificados.itens.filter((i) => !arg || i.area === arg).map((i) => `${i.nome}, ${i.emissor}: ${i.validacaoUrl ?? k.semValidacao}`) };
    }
    case "contato":
      return { linhas: [c.pessoa.email, c.pessoa.linkedin, c.pessoa.github, k.whatsapp] };
    case "cv":
      return { linhas: [trocar(k.abrindo, "/cv")], efeito: { tipo: "abrir", rota: "/cv" } };
    case "seguranca":
      return { linhas: [trocar(k.abrindo, "/seguranca")], efeito: { tipo: "abrir", rota: "/seguranca" } };
    case "pdf":
      return (await ctx.temPdf()) ? { linhas: [trocar(k.abrindo, ctx.arquivoPdf)], efeito: { tipo: "baixar", arquivo: ctx.arquivoPdf } } : { linhas: [k.semPdf] };
    case "tema":
      if (!arg) return { linhas: [trocar(k.temas, ctx.temas.join(", "))] };
      if (arg === "fosforo" && !ctx.temas.includes("fosforo")) return { linhas: [k.temaBloqueado] };
      if (!ctx.temas.includes(arg)) return { linhas: [trocar(k.temaInvalido, arg)] };
      return { linhas: [trocar(k.temaTrocado, arg)], efeito: { tipo: "tema", id: arg } };
    case "chuva":
      return arg === "ligar" ? { linhas: [k.chuvaLigada], efeito: { tipo: "chuva", pausada: false } } : { linhas: [k.chuvaPausada], efeito: { tipo: "chuva", pausada: true } };
    case "cabecalhos": {
      const h = await ctx.cabecalhos();
      if (!h) return { linhas: [k.cabecalhosErro] };
      return { linhas: CABECALHOS.map((n) => `${n}: ${h.get(n) ?? k.semCabecalho}`) };
    }
    case "selos": {
      const obtidos = selosObtidos();
      return {
        linhas: [
          c.ctf.regra,
          trocar(c.ctf.progresso, String(obtidos.length)).replace("{n}", String(obtidos.length)).replace("{t}", String(TOTAL_SELOS)),
          "",
          ...c.ctf.dicas.map((d, i) => `${obtidos.includes(i) ? "[x]" : "[ ]"} ${i}. ${d.dica}${d.link ? ` ${d.link}` : ""}`),
          ...(obtidos.length === TOTAL_SELOS ? ["", c.ctf.completo] : []),
        ],
      };
    }
    case "selo": {
      if (!args[0]) return { linhas: [c.ctf.uso] };
      const i = await conferirSelo(args.join(" "));
      if (i < 0) return { linhas: [c.ctf.invalido] };
      const { novo, total } = registrarSelo(i);
      if (!novo) return { linhas: [c.ctf.repetido] };
      const linhas = [c.ctf.confirmado.replace("{n}", String(i)).replace("{t}", String(total))];
      if (total === TOTAL_SELOS) linhas.push("", c.ctf.completo, c.ctf.maca);
      return { linhas };
    }
    case "ls":
      return { linhas: args.includes("-a") || args.includes("-la") || args.includes("-al") ? k.lsTudo : k.ls };
    case "limpar":
    case "clear":
      return { linhas: [], efeito: { tipo: "limpar" } };
    case "sair":
    case "exit":
      return { linhas: [], efeito: { tipo: "fechar" } };
    default:
      return { linhas: [trocar(k.naoEncontrado, cmd.slice(0, 60))] };
  }
}

export function completar(parcial: string) {
  const p = parcial.toLowerCase();
  if (!p || p.includes(" ")) return null;
  const achados = NOMES.filter((n) => n.startsWith(p));
  return achados.length === 1 ? achados[0] : null;
}
