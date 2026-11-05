# 14 — Skills e stack

Matriz de tudo o que está nos pedidos do titular ([skills-stacks.md](../skills-stacks.md), [skills-stacks2.md](../skills-stacks2.md) e o [prompt original](00-briefing.md#o-prompt-original)), com seu destino neste projeto.

## As 10 skills

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

### Revisão das skills de terceiros

Feita em 05/11/2026, como recomenda o `skills-stacks.md`.

| Skill | Resultado |
|---|---|
| `copywriting`, `vercel-*`, `web-design-guidelines` | Sem padrões perigosos. O avaliador do instalador as classificou como baixo risco |
| `seo-audit` | Classificada como "Med Risk" pelo Snyk no instalador. Na leitura, há instruções de auditoria e referências, sem scripts. Ela mesma pede que o conteúdo de páginas buscadas seja tratado como dado não confiável |
| `react-three-fiber`, `threejs-webgl` | **Só `SKILL.md` e `references/` foram copiados.** Scripts, starters e agentes do plugin ficaram de fora |
| `impeccable`, `taste-skill` | Vieram do Bibliotheon e têm scripts, **autorizados pelo titular em 05/11/2026**. O `impeccable context` baixa um binário na primeira execução, e `taste-skill/scripts/assets.mjs` acessa a rede |

**Ao atualizar:** repetir a revisão. As skills rodam com as permissões do agente.

### Quando as skills discordam

A ordem é a mesma do `skills-stacks.md`: a identidade definida para o projeto vence recomendações genéricas.

1. Pedido do titular em [00-briefing.md](00-briefing.md) e veracidade em [01](01-veracidade-e-fontes.md).
2. Acessibilidade e segurança em [11](11-qualidade.md) e [09](09-seguranca-e-privacidade.md).
3. Direção criativa em [04](04-direcao-criativa.md) e tokens em [05](05-design-system.md).
4. Recomendações das skills.

**Conflitos já decididos**

| Conflito | Decisão |
|---|---|
| Impeccable e Frontend Design rejeitam números de seção | Mantidos, com função narrativa, na margem |
| `taste-skill` proíbe etiquetas e ornamentos | Etiquetas eliminadas. Ornamentos são parte do mundo gótico pedido pelo titular |
| Frontend Design e Impeccable alertam contra preto com verde neon | Mantido por pedido expresso, com o verde tratado como luz e o ouro como acento de interface |
| Impeccable rejeita vidro decorativo | Vidro só como painel de vitral |
| Web Interface Guidelines pedem Title Case e evitar primeira pessoa | Não se aplicam a um portfólio pessoal em português |
| `taste-skill` tira direção de um sorteio de layouts | Só como inspiração de composição. A direção já foi escolhida pelo titular |
| Skills pedem "só animar quando necessário"; o titular quer tudo | Inventário máximo, com um momento autoral por seção |

## Cobertura da stack

Cada item do `skills-stacks.md`, seção 3.2.

| Item da lista | Situação | Onde |
|---|---|---|
| Next.js (App Router) | Entra | [08](08-arquitetura-tecnica.md) |
| React + TypeScript | Entra | [08](08-arquitetura-tecnica.md) |
| Tailwind CSS v4 | Entra | [05](05-design-system.md#tailwind-e-tokens) |
| shadcn/ui + Radix ou Base UI | Entra, com Base UI, igual ao Bibliotheon | [05](05-design-system.md#componentes) |
| GSAP + ScrollTrigger | Entra | [06](06-motion-e-webgl.md) |
| Motion for React | Entra | [06](06-motion-e-webgl.md#quem-é-dono-de-quê) |
| Lenis | Entra | [06](06-motion-e-webgl.md#ligação-do-relógio) |
| Three.js + React Three Fiber | Entra | [06](06-motion-e-webgl.md#arquitetura-da-cena) |
| Drei | Entra | [08](08-arquitetura-tecnica.md#stack) |
| React Postprocessing | Entra | [06](06-motion-e-webgl.md#pós-processamento) |
| Blender | Entra, por script | [06](06-motion-e-webgl.md#pipeline-de-assets) |
| Spline | **Fora:** alternativa ao Blender, segundo a própria lista | [decisoes](decisoes.md) |
| Rive ou Lottie | Lottie. Rive fica de fora, pois exige um editor visual que o agente não opera | [decisoes](decisoes.md) |
| Lucide + SVGs | Entra | [05](05-design-system.md#ornamentos) |
| Sanity | **Para o final**, por decisão do titular: externo ao portfólio | [08](08-arquitetura-tecnica.md#sanity-para-o-final) |
| PostHog | **Para o final**, por decisão do titular | [08](08-arquitetura-tecnica.md#analytics-e-erros-para-o-final) |
| Sentry | **Para o final**, por decisão do titular | [08](08-arquitetura-tecnica.md#analytics-e-erros-para-o-final) |
| Playwright | Entra | [11](11-qualidade.md#testes) |
| Storybook | Entra, só em desenvolvimento | [08](08-arquitetura-tecnica.md#storybook) |
| Vercel | **Fora:** o titular deu domínio e IP próprios | [10](10-deploy-e-operacao.md) |
| Acréscimo: WebGPU/TSL | Opcional, decidido em protótipo | [06](06-motion-e-webgl.md#renderizador) |

## Cobertura dos recursos

Itens do `skills-stacks.md` (seção 6) e do `skills-stacks2.md` (seção 4).

| Recurso | Aplicação |
|---|---|
| Hero 3D cinematográfico, PBR, câmera, cursor | Rosácea e nave |
| Fallback para aparelhos modestos | [Níveis de qualidade](06-motion-e-webgl.md#níveis-de-qualidade) |
| Glassmorphism refinado | [Vidro de vitral](05-design-system.md#transparências-vidro-de-vitral) |
| Scrollytelling, textos revelados, seções fixadas | [Storyboard](06-motion-e-webgl.md#storyboard-da-rolagem) |
| Shaders, fundos dinâmicos, partículas | Chuva e Atmosfera |
| Aurora e gradientes fluidos | Névoa e raios coloridos do vitral, que são sua versão neste mundo |
| Tipografia variável e escalas fluidas | [Tipografia](05-design-system.md#tipografia) |
| Microinterações com física de mola | [Microinterações](06-motion-e-webgl.md#microinterações) |
| Transições de página | [Transições de rota](06-motion-e-webgl.md#transições-de-rota) |
| Ícones animados e detalhes vetoriais | Lottie e DrawSVG |
| Hover magnético pontual | 3 botões |
| Cursores contextuais | Cursor-vela |
| Sticky storytelling, seções editoriais, assimetria | Trajetória, Sobre |
| Dark/light como sistema completo | Temas, com Pergaminho |
| Responsivo, com atenção ao celular | [Responsividade](03-ux-e-navegacao.md#responsividade) |

## Requisitos de qualidade dos documentos do titular

| Requisito | Onde |
|---|---|
| Core Web Vitals, WCAG 2.2 AA, `prefers-reduced-motion` | [11](11-qualidade.md) |
| SEO, HTML semântico, dados estruturados | [11](11-qualidade.md#seo) |
| Resiliência a falhas de WebGL, JS e conexão | [03](03-ux-e-navegacao.md), [06](06-motion-e-webgl.md) |
| Conteúdo original, sem depoimentos ou números inventados | [01](01-veracidade-e-fontes.md) |
| Não copiar identidades de marcas | [04](04-direcao-criativa.md) |
| Não colocar toda a interface em Canvas | [06](06-motion-e-webgl.md#arquitetura-da-cena) |
| Documentar decisões | [decisoes.md](decisoes.md) |
| Processo de 8 fases | [12](12-roteiro.md) |

## Instalação no início do desenvolvimento

```bash
# Ferramentas
corepack enable && corepack prepare pnpm@latest --activate

# Aplicação (na própria pasta do portfólio)
pnpm create next-app@latest . --ts --tailwind --app --src-dir --use-pnpm --disable-git

# Motion e animação
pnpm add gsap @gsap/react motion lenis lottie-web

# 3D
pnpm add three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing detect-gpu
pnpm add -D @types/three @gltf-transform/cli gltfjsx

# Interface e conteúdo
pnpm add @base-ui/react lucide-react zod
pnpm dlx shadcn@latest init

# Qualidade
pnpm add -D vitest @playwright/test @axe-core/playwright @lhci/cli storybook @storybook/nextjs-vite
```

`--disable-git` porque o Git é do titular. Sanity, PostHog e Sentry não são instalados agora. Os documentos já estão nesta pasta, e o `create-next-app` pode recusar uma pasta não vazia. Nesse caso, gerar em pasta temporária e copiar. Conferir a compatibilidade de `react` com `@react-three/fiber` (hoje `<19.4`) antes de qualquer atualização.

**Blender:** o tarball oficial de blender.org dispensa `sudo`, e os scripts rodam em modo `--background`.
