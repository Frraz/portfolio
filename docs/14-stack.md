# 14 — Stack

O que entrou no projeto, o que ficou de fora e por quê. As versões ficam em [08](08-arquitetura-tecnica.md#stack) e no `package.json`.

## Cobertura da stack

| Item | Situação | Onde |
|---|---|---|
| Next.js (App Router), exportação estática | Entra | [08](08-arquitetura-tecnica.md) |
| React + TypeScript estrito | Entra | [08](08-arquitetura-tecnica.md) |
| Tailwind CSS v4 | Entra | [05](05-design-system.md#tailwind-e-tokens) |
| Base UI | Entra, nos menus e no Índice | [05](05-design-system.md#componentes) |
| GSAP + ScrollTrigger | Entra | [06](06-motion-e-webgl.md) |
| Motion for React | Entra, em microinterações | [06](06-motion-e-webgl.md#quem-é-dono-de-quê) |
| Lenis | Entra | [06](06-motion-e-webgl.md#ligação-do-relógio) |
| Three.js + React Three Fiber | Entra | [06](06-motion-e-webgl.md#arquitetura-da-cena) |
| React Postprocessing | Entra | [06](06-motion-e-webgl.md#pós-processamento) |
| Lucide + SVGs | Lucide só nos menus, que carregam depois. Na barra e no contato, ícones em SVG próprio, para não pesar no JavaScript inicial | [05](05-design-system.md#elementos-gráficos) |
| Zod | Entra, na validação do conteúdo | [08](08-arquitetura-tecnica.md) |
| Playwright, Vitest, axe | Entram | [11](11-qualidade.md#testes) |
| Drei | **Fora desde 07/11/2026:** nenhum componente usava | [decisões](decisoes.md) |
| Lottie | **Fora desde 07/11/2026:** só desenhava os sigilos do conceito antigo. O aviso de selo virou CSS | [decisões](decisoes.md) |
| Storybook | **Fora desde 07/11/2026:** não havia nenhuma história depois do redesign | [decisões](decisoes.md) |
| Blender | **Fora desde 07/11/2026:** só servia aos modelos da cena B, descartada ([decisão 81](decisoes.md)) | [decisões](decisoes.md) |
| Spline, Rive | **Fora:** exigem editores visuais e não acrescentam ao conceito | [decisões](decisoes.md) |
| Sanity, PostHog, Sentry | **Para o final**, por decisão do titular: externos ao portfólio | [08](08-arquitetura-tecnica.md#sanity-para-o-final) |
| Vercel | **Fora:** o titular tem domínio e VPS próprios | [10](10-deploy-e-operacao.md) |
| WebGPU/TSL | Fora do lançamento, decidido em protótipo | [06](06-motion-e-webgl.md#renderizador) |

## Cobertura dos recursos

| Recurso | Aplicação |
|---|---|
| Hero 3D, fallback para aparelhos modestos | Cena "Tudo é código" e [níveis de qualidade](06-motion-e-webgl.md#níveis-de-qualidade) |
| Vidro | Só na barra de navegação, por pedido do titular ([decisão 82](decisoes.md)) |
| Scrollytelling, textos revelados | [Storyboard](06-motion-e-webgl.md#storyboard-da-rolagem) |
| Shaders e fundos dinâmicos | Chuva e travamento de glifos |
| Tipografia variável e escalas fluidas | [Tipografia](05-design-system.md#tipografia): eixo de largura da Mona Sans animado no nome |
| Microinterações com física de mola | [Microinterações](06-motion-e-webgl.md#microinterações) |
| Transições de página | [Transições de rota](06-motion-e-webgl.md#transições-de-rota) |
| Elementos de hardware, Kali, binário, cyber e SOC (pedido de 06/11/2026) | Trilhas de placa, terminal, hexdump, faixa binária, registro da sessão ([07](07-recursos-interativos.md)) |
| Dark/light como sistema completo | Rubro, Claro e Fósforo (este, prêmio do CTF) |
| Responsivo, com atenção ao celular | [Responsividade](03-ux-e-navegacao.md#responsividade) |
| Cursores contextuais, som ambiente | Fora, a pedido do titular |

## Quando as orientações discordam

A identidade definida para o projeto vence recomendações genéricas de design.

1. Pedido do titular em [00-briefing.md](00-briefing.md) e veracidade em [01](01-veracidade-e-fontes.md).
2. Acessibilidade e segurança em [11](11-qualidade.md) e [09](09-seguranca-e-privacidade.md).
3. Direção criativa em [04](04-direcao-criativa.md) e tokens em [05](05-design-system.md).
4. Recomendações gerais de design e de código.

**Conflitos já decididos**

| Conflito | Decisão |
|---|---|
| Recomendações gerais evitam monoespaçada fora de código, réguas, linhas finas e brilho | O pedido do titular por elementos de tecnologia vem primeiro. Esses elementos só entram quando **medem ou mostram um dado real** ([princípio](04-direcao-criativa.md#princípio-inegociável-todo-enfeite-técnico-mostra-um-dado-real)). Mono só em dado real. Brilho só em luz emitida pela cena. Sem grade decorativa ([decisão 57](decisoes.md)) |
| Numeração de índice ao lado do título | Não entra. Só o traceroute numera, porque os saltos são uma sequência real |
| Fundo quase preto com um acento vermelho é um padrão comum | O vermelho é pedido do titular. Vira uma rampa tonal inteira de luz, e não um acento isolado ([04](04-direcao-criativa.md#luz-vermelha-de-operação)) |
| Vidro e desfoque | Só na navegação, por pedido do titular ([decisão 82](decisoes.md)) |
| No máximo duas famílias tipográficas | Aceito: Mona Sans e JetBrains Mono (decisão 87) |
| Pouco movimento versus "bastantes elementos e recursos" | Riqueza na camada de instrumento e um momento autoral por seção. Nunca dois momentos grandes na mesma tela |
| Title Case e evitar primeira pessoa | Não se aplicam a um portfólio pessoal em português |

## Requisitos de qualidade

| Requisito | Onde |
|---|---|
| Core Web Vitals, WCAG 2.2 AA, `prefers-reduced-motion` | [11](11-qualidade.md) |
| SEO, HTML semântico, dados estruturados | [11](11-qualidade.md#seo) |
| Resiliência a falhas de WebGL, JS e conexão | [03](03-ux-e-navegacao.md), [06](06-motion-e-webgl.md) |
| Conteúdo original, sem depoimentos ou números inventados | [01](01-veracidade-e-fontes.md) |
| Não copiar identidades de marcas | [04](04-direcao-criativa.md) |
| Não colocar a interface em Canvas | [06](06-motion-e-webgl.md#arquitetura-da-cena) |
| Documentar decisões | [decisoes.md](decisoes.md) |

## Instalação

```bash
corepack enable
pnpm install
pnpm dev
```

Os scripts de geração (`pnpm temas`, `fontes`, `atlas`, `trilhas`, `og`, `selos`, `certificados`) rodam à mão e o resultado fica versionado. Conferir a compatibilidade de `react` com `@react-three/fiber` antes de qualquer atualização.
