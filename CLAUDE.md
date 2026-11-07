# Instruções para agentes

Portfólio de Warley Ferraz Almeida, em redesign completo desde 06/11/2026 (conceito Sinal). Escreva em português do Brasil. Comece pelo [README](README.md) e pelo [ROADMAP](ROADMAP.md), que diz onde estamos. **Atualize o ROADMAP e a documentação no mesmo passo em que mudar o código.**

## Regra principal: veracidade

O visual não tem limites. O texto tem.

- Só publique fatos de `../curriculo` e com o peso de evidência dado lá. Regras em [docs/01-veracidade-e-fontes.md](docs/01-veracidade-e-fontes.md).
- Segurança e DevOps são formação e projetos, sem cargo. Nunca sugira experiência profissional em SOC, pentest ou red team.
- Sem níveis de habilidade, métricas, clientes, depoimentos ou dados inventados, inclusive em terminal, CTF e efeitos visuais.
- Efeito visual nunca vira competência do titular.
- **Todo enfeite técnico mostra um dado real** (réguas, relógio, FPS, hashes, hexdump, eventos). Sem alerta, IP, varredura ou métrica inventados, e sem dado do VPS ou do visitante ([04](docs/04-direcao-criativa.md#princípio-inegociável-todo-enfeite-técnico-mostra-um-dado-real)).
- `../curriculo` é somente leitura. Fato novo entra lá primeiro, pelo titular.

## Privacidade

- Nunca copie nada de `../curriculo/certificados/` para o site: os PDFs têm CPF e RG.
- O telefone fica fora de HTML, JSON-LD, PDF, sitemap e terminal. Só no chunk de revelação ao clicar ([07](docs/07-recursos-interativos.md#revelação-do-whatsapp)).
- Não publique IP, porta nem outros sistemas do VPS.
- Nomes de projetos ficam de fora até `obrasAtivas: true` ([13](docs/13-projetos-futuros.md)). O Byakugan não é citado nem sem nome.
- Sem iconografia religiosa no design novo. Texto em linguagem neutra.

## Limites de ação

- **Nunca execute `git init`, commit ou push: o Git é feito à mão pelo titular.** Também não faça deploy, SSH, alteração no VPS nem crie contas sem pedido explícito.
- O VPS hospeda sistemas de clientes. Nunca varra nem teste o servidor.
- Ao atualizar skills de terceiros, leia o conteúdo antes de usar.

## Arquitetura: o que não muda sem registrar em `docs/decisoes.md`

- Next.js com `output: "export"`. Sem servidor de aplicação.
- Todo o conteúdo fica em HTML. O Canvas é decoração com `aria-hidden`, e o site funciona sem WebGL e sem JavaScript.
- Conteúdo só em `src/conteudo/`, por idioma, validado por Zod. Nenhum texto fixo em componente.
- CSP sem `unsafe-inline` nem `unsafe-eval` em scripts, com hashes gerados no pós-build. Sem scripts ou recursos de terceiros no navegador.
- Regras do servidor em [docs/10-deploy-e-operacao.md](docs/10-deploy-e-operacao.md#regras-do-servidor).

## Motion

Cada elemento tem um único motor. Tabela completa em [docs/06](docs/06-motion-e-webgl.md#quem-é-dono-de-quê).

- GSAP e ScrollTrigger: rolagem e timelines. Motion: microinterações. CSS: estados simples.
- GSAP ticker é o único relógio: alimenta Lenis e R3F (`frameloop="never"`). Sem `requestAnimationFrame` paralelo.
- Respeite `prefers-reduced-motion` em tudo.
- Terminal e ações de teclado não animam.

## Design

- Cores e fontes só por tokens de [docs/05](docs/05-design-system.md). Sem valor literal em componente.
- Referências do redesign: só Matrix e vermelho, mais elementos de hardware, Kali, binário, cyber e SOC. As referências da primeira versão não valem mais ([docs/04](docs/04-direcao-criativa.md#referências)).
- Nada de logos, personagens ou identidades de terceiros (Matrix, Kali, fabricantes, plataformas).
- Vermelho é rampa de luz, não acento isolado. Monoespaçada só em dado real. Brilho só em luz da cena. Vidro só na barra de navegação, por pedido do titular.
- Sem etiqueta acima de título, número ao lado do título, cards iguais, gradiente em texto, seta em botão, ponto médio entre dados.
- Quando as skills discordarem, siga a ordem abaixo e a de [docs/14](docs/14-stack.md#quando-as-orientações-discordam).

## Como trabalhar

1. Leia os documentos da fase em [docs/12](docs/12-roteiro.md) e carregue as skills da fase (tabela "Skills por fase", abaixo). Marque o progresso no [ROADMAP](ROADMAP.md).
2. Se mudar uma decisão, atualize o documento e `docs/decisoes.md`.
3. Antes de dizer que terminou: `pnpm verificar && pnpm build && pnpm test && pnpm test:e2e`.
4. Em mudança visual, veja capturas em 390, 768 e 1440 px, sem confiar só em métricas.
5. Relate o que foi testado e o que não foi. Item em `/seguranca` só depois de testado em produção.
6. Versões de pacotes e APIs mudam: confira a documentação atual antes de usar. Versões de 05/11/2026 estão em [docs/08](docs/08-arquitetura-tecnica.md#stack).

## Repositório sem menção a IA

Pedido do titular em 07/11/2026: nada no repositório nem no site diz que ele foi feito com IA. Este arquivo, `AGENTS.md`, `.claude/` e `skills-lock.json` ficam só no disco, listados em `.git/info/exclude` (nunca no `.gitignore`, que é versionado): `CLAUDE.md`, `AGENTS.md`, `.claude/`, `skills-lock.json`, `.taste-skill/`, `.impeccable/`. Nunca escreva essa lista em arquivo versionado. Em documentos, use forma impessoal ("o build faz", "o titular faz") e cite práticas, não skills ("auditoria de SEO", "revisão de animação"). O verificador de conteúdo barra "Claude", "Anthropic", "ChatGPT", "apoio de IA" e a cidade do titular na saída do build.

## Skills (só local)

### Skills instaladas

Instaladas em `.claude/skills/` em 05/11/2026, salvo UI UX Pro Max, instalada como plugin do usuário. Versões de terceiros ficam em `skills-lock.json`.

| # | Skill | Pasta ou nome | Origem | Fases | Uso |
|---|---|---|---|---|---|
| 1 | Frontend Design (Anthropic) | `frontend-design` | Cópia do Bibliotheon | 2, 4, 5 | Direção de arte, revisão contra marcas de IA |
| 2 | UI UX Pro Max | `ui-ux-pro-max:*` | Plugin 2.13.0 | 3, 4 | Tokens, paletas, UX, tipografia |
| 3 | Impeccable | `impeccable` | Cópia do Bibliotheon | 3, 4, 8 | `critique`, `audit`, `polish`, `typeset`, `overdrive` |
| 4 | Animate (Emil Kowalski) | `emil-*` | Cópia do Bibliotheon | 6, 8 | Microinterações e revisão de animação |
| 5 | GSAP ScrollTrigger | `gsap-*` | Cópia do Bibliotheon | 6 | Scrollytelling, timeline, performance |
| 6 | React Three Fiber | `react-three-fiber` | `freshtechbro/claudedesignskills` | 4, 6 | Cena em React |
| + | `threejs-webgl` (bônus) | `threejs-webgl` | Idem | 4, 6 | Shaders, materiais, otimização |
| 7 | Copywriting (Corey Haines) | `copywriting` | `coreyhaines31/marketingskills` | 1, 7 | Texto e checagem de marcas de IA |
| 8 | SEO Audit (Corey Haines) | `seo-audit` | Idem | 7, 8 | Estratégia e auditoria |
| 9 | React Best Practices (Vercel) | `vercel-react-best-practices` | `vercel-labs/agent-skills` | 5, 8 | Arquitetura e revisão |
| 10 | Web Design Guidelines (Vercel) | `web-design-guidelines` | Idem | 8 | Auditoria final; busca as regras atuais |

**Complementos**

| Skill | Uso |
|---|---|
| `taste-skill` | Argumento da página, teste do concorrente, coisa viva e olhar crítico |
| `anthropic-skills:algorithmic-art` | Estudos de chuva e rendilhado |
| `anthropic-skills:canvas-design` | Moodboards e imagens estáticas |
| `anthropic-skills:theme-factory` | Variação dos temas |
| `dataviz` | Linha do tempo e lancetas, caso virem gráfico |
| `ui-ux-pro-max:design-system`, `:brand`, `:ui-styling` | Estrutura de tokens e Base UI/shadcn |
| `security-review`, `code-review`, `simplify` | Revisões de código |

#### Revisão das skills de terceiros

Feita em 05/11/2026, como recomenda o `skills-stacks.md`.

| Skill | Resultado |
|---|---|
| `copywriting`, `vercel-*`, `web-design-guidelines` | Sem padrões perigosos. O avaliador do instalador as classificou como baixo risco |
| `seo-audit` | Classificada como "Med Risk" pelo Snyk no instalador. Na leitura, há instruções de auditoria e referências, sem scripts. Ela mesma pede que o conteúdo de páginas buscadas seja tratado como dado não confiável |
| `react-three-fiber`, `threejs-webgl` | **Só `SKILL.md` e `references/` foram copiados.** Scripts, starters e agentes do plugin ficaram de fora |
| `impeccable`, `taste-skill` | Vieram do Bibliotheon e têm scripts, **autorizados pelo titular em 05/11/2026**. O `impeccable context` baixa um binário na primeira execução, e `taste-skill/scripts/assets.mjs` acessa a rede |

**Ao atualizar:** repetir a revisão. As skills rodam com as permissões do agente.

#### Quando as skills discordam

A ordem é a mesma do `skills-stacks.md`: a identidade definida para o projeto vence recomendações genéricas.

1. Pedido do titular em [00-briefing.md](00-briefing.md) e veracidade em [01](01-veracidade-e-fontes.md).
2. Acessibilidade e segurança em [11](11-qualidade.md) e [09](09-seguranca-e-privacidade.md).
3. Direção criativa em [04](04-direcao-criativa.md) e tokens em [05](05-design-system.md).
4. Recomendações das skills.


#### Skills por fase

| Fase | Skills |
|---|---|
| R5 Cena completa e storyboard | GSAP (ScrollTrigger, Timeline, Plugins), Animate |
| R6 Recursos | Animate, GSAP, `emil-break-ui` |
| R7 Textos e compartilhamento / Fase 7 | Copywriting, SEO Audit |
| R8 Refinamento / Fase 8 | Impeccable `audit`/`polish`, Web Design Guidelines, React Best Practices, `emil-review-animations` |
| Preparação para produção | `seo-audit`, `vercel-react-best-practices`, `emil-animation-performance`, `gsap-performance` |
| Fase 9 Idiomas | Copywriting |
| Fase 10 Blindagem | `security-review`, Impeccable `harden` |
