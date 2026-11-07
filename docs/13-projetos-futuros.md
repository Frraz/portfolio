# 13 — Projetos futuros

Como ativar a seção "Obras" e adicionar projetos com demo, sem refatorar. Hoje ela está oculta, por pedido do titular.

## Como a seção está preparada

| Parte | Situação hoje |
|---|---|
| Esquema `Projeto` em `src/conteudo/esquema.ts` | Pronto |
| Componente `src/secoes/Obras.tsx` | Construído e coberto no Storybook, com dados de exemplo só no catálogo |
| Rotas `/obras/[slug]` | Geradas apenas para projetos publicados |
| Numeração de seções | Derivada dos dados |
| Navegação, sitemap, terminal e índice | Incluem "Obras" automaticamente quando ela está ativa |
| Verificador de conteúdo | Bloqueia nomes de projetos enquanto eles não estiverem publicados |

**Efeito na navegação:** ao ativar "Obras", a régua da moldura ganha um traço a mais e a seção entra antes de Contato, sem mudar nada à mão.

## Adicionar um projeto

1. **Revise a base.** Confirme o projeto em `../curriculo/curriculo_mestre.md`, seção Situação e evidências.
2. **Adicione ao conteúdo,** em `src/conteudo/pt-BR.ts`, e depois aos demais idiomas:

```jsonc
{
  "slug": "nome-do-projeto",
  "nome": "Nome",
  "resumo": "Uma frase sobre o que é.",
  "contexto": "Para quem foi feito e o que fiz nele.",
  "situacao": "demonstracao",            // producao | demonstracao | desenvolvimento | academico
  "demoUrl": "https://...",
  "stack": ["Python", "Django"],
  "destaques": ["Fato conferível 1", "Fato conferível 2"],
  "capa": "/obras/nome-do-projeto.avif",
  "publicado": true
}
```

3. **Ative a seção:** `"obrasAtivas": true`.
4. **Libere o nome** na lista de bloqueio do verificador.
5. **Rode a verificação:** `pnpm verificar && pnpm build`.
6. **Publique** com o fluxo de [10-deploy-e-operacao.md](10-deploy-e-operacao.md).

## Visual planejado

**A definir quando a seção for ativada**, dentro do conceito Sinal ([04](04-direcao-criativa.md)). Proposta inicial: cada projeto como um **serviço implantado**, com a stack real, o estado conferido no dia (`em produção`, `demonstração`) e a captura da tela. A demo aparece como imagem, e `Abrir demonstração` é um link externo. O estado nunca é inventado: vem da conferência registrada na base.

- **Composição:** cada obra tem proporção própria, sem carrossel de cards iguais.
- **Página do projeto:** `/obras/[slug]`, com contexto, o que fiz, stack, destaques e link da demo.
- **Sem iframe:** a CSP continua com `frame-src 'none'`. A demo abre em nova aba. Isso preserva a segurança e o desempenho, e evita expor outros sistemas do VPS no site.
- **Capa:** captura real, em AVIF, sem dados de clientes.

## Regras de conteúdo

Herdadas da base do currículo. Valem para qualquer texto de projeto:

| Regra | Detalhe |
|---|---|
| Projetos não são empregos | Nunca aparecem em Trajetória |
| Sem contagens infladas | "Seis vendas" não vira "seis clientes ativos" |
| Situação real | Conferir o sistema antes de dizer "em produção". O Rebanho respondeu HTTP 502 em 02/11/2026, segundo a base |
| Sem dados de clientes | Nomes, marcas, CPF e capturas com dados reais ficam de fora |
| Demonstração | Precisa usar dados fictícios. Conferir antes de publicar o link |
| Repositórios | A base diz: no GitHub, cite só o perfil. Se o titular quiser links individuais, a regra muda primeiro lá |
| Apoio de IA | Tudo precisa ser explicável em entrevista |
| Ferzion | Projeto descontinuado. O nome existe só no domínio |
| Testes | "820 testes" são funções encontradas, e não cobertura |

## Candidatos

Situação da base em 02/11/2026. A escolha e a ordem são do titular.

| Projeto | Por que entraria | Antes de publicar |
|---|---|---|
| **Byakugan** | **Fora por decisão do titular.** Só entra se ele mudar de ideia | Não citar, nem sem nome |
| **Rebanho360** | Melhor evidência de deploy, backup e rollback | Confirmar cliente e data de venda |
| **ConfTech** | Em produção e vendido | Conferir demonstração, sem dados do cliente |
| **Rebanho** | Em produção | Conferir o serviço |
| **RH** | Em produção | Cálculos sem validação de conformidade: não prometer exatidão legal |
| **Romaneios** | Em produção | Sem repositório local para confirmar a stack |
| **Bibliotheon** | Site público, no mesmo servidor | Confirmar se quer vinculá-lo à carreira |

## Depois de ativar

- Atualizar o texto do rodapé e de Sobre, se a frase "os projetos em si ainda não estão publicados" não valer mais.
- Revisar [02-conteudo.md](02-conteudo.md) e a nota da fileira 2 de Competências.
- Testar `/obras/[slug]` em todos os temas, e rodar a auditoria de links.
- Registrar a ativação em [decisoes.md](decisoes.md).
