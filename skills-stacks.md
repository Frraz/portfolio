# Skills & Stacks — Projeto Web Premium 2027

> Guia de referência para desenvolver com Claude Code uma experiência web de alto padrão, com UI/UX autoral, animações, motion design, 3D, WebGL, transparências, copywriting, SEO, acessibilidade e performance.
>
> **Objetivo:** criar um projeto visualmente memorável, profissional, elegante, escalável e pronto para produção — aspirando à qualidade criativa de referências como Awwwards, Apple, Active Theory, Linear e Vercel, **sem copiar suas identidades**.

---

## Sumário

1. [Visão e princípios](#1-visão-e-princípios)
2. [As 10 skills para Claude Code](#2-as-10-skills-para-claude-code)
3. [Stack tecnológica recomendada](#3-stack-tecnológica-recomendada)
4. [Instalação das skills](#4-instalação-das-skills)
5. [Inicialização do projeto](#5-inicialização-do-projeto)
6. [Recursos visuais e experiências](#6-recursos-visuais-e-experiências)
7. [Metas de qualidade](#7-metas-de-qualidade)
8. [Processo de desenvolvimento](#8-processo-de-desenvolvimento)
9. [Prompt mestre para Claude Code](#9-prompt-mestre-para-claude-code)
10. [Recomendação final e referências](#10-recomendação-final-e-referências)

---

## 1. Visão e princípios

A intenção é combinar:

- **Direção de arte autoral:** visual sofisticado, tipografia expressiva, layouts que não pareçam templates genéricos.
- **UI/UX premium:** hierarquia, acessibilidade, consistência, responsividade e excelente usabilidade.
- **Motion e storytelling:** transições suaves, microinterações e animações sincronizadas à rolagem.
- **3D e WebGL:** cenas tridimensionais, fundos reativos, shaders e materiais realistas quando agregarem valor.
- **Copywriting e SEO:** comunicação clara, páginas indexáveis e conteúdo orientado a conversão.
- **Engenharia de produção:** desempenho, testes, manutenção, escalabilidade e observabilidade.

**Diretriz central:** não colocar todos os efeitos possíveis em cada tela. Utilizar o conjunto de recursos como uma biblioteca criativa e escolher cuidadosamente o que melhora a experiência e a narrativa de cada seção.

## 2. As 10 skills para Claude Code

As recomendações abaixo formam um fluxo complementar: concepção visual, sistema de design, refinamento, animações, 3D, comunicação, SEO e qualidade de engenharia.


### 2.1 Frontend Design — Anthropic

- Ponto de partida para interfaces com identidade visual própria.
- Apoio em tipografia, layouts, composição, estética e escolhas visuais menos genéricas.
- Usar na fase de **conceituação e primeira implementação**.

**Link:** https://github.com/anthropics/skills/tree/main/skills/frontend-design

### 2.2 UI UX Pro Max — NextLevelBuilder

- Referências de estilos, paletas, tipografia e padrões de interface.
- Apoia decisões de layout e estrutura de design systems.
- Usar antes de construir componentes, para consolidar **tokens e linguagem visual**.

**Link:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

### 2.3 Impeccable — Paul Bakaus

- Crítica e refinamento de hierarquia, alinhamento, espaçamento, cores e consistência.
- Útil para encontrar detalhes que fazem diferença no acabamento profissional.
- Usar nas **rodadas de polimento e auditoria visual**.

**Link:** https://github.com/pbakaus/impeccable

### 2.4 Animate — Emil Kowalski

- Microinterações, transições naturais, spring physics, gestos, feedback visual e curvas de aceleração.
- Aplicações: botões, menus, cards, modais e transições de componentes.
- Usar para **motion discreto e responsivo ao estado da interface**.

**Link:** https://github.com/emilkowalski/skills/blob/main/skills/animate/SKILL.md

### 2.5 GSAP ScrollTrigger — Claude Design Skillstack

- Animações sincronizadas à rolagem, parallax, revelação de textos, seções fixadas e sequências coordenadas.
- Adequada para landing pages narrativas e experiências cinematográficas.
- Usar para **timelines complexas e scrollytelling**.

**Link:** https://github.com/freshtechbro/claudedesignskills

### 2.6 React Three Fiber — Claude Design Skillstack

- Integração entre React e cenas 3D com Three.js.
- Fundos tridimensionais, objetos responsivos ao cursor, câmeras animadas, materiais, iluminação e partículas.
- Combinar, quando necessário, com a skill adicional **`threejs-webgl`** do mesmo marketplace.
- Usar para **experiências 3D pontuais**, evitando sobrecarregar toda a página.

**Link:** https://github.com/freshtechbro/claudedesignskills/blob/main/MARKETPLACE.md

### 2.7 Copywriting — Corey Haines

- Escrita de títulos, subtítulos, CTAs, proposta de valor e estrutura argumentativa.
- Útil para transformar sofisticação visual em entendimento e conversão.
- Usar na fase de **conteúdo e planejamento de conversão**.

**Link:** https://github.com/coreyhaines31/marketingskills/tree/main/skills/copywriting

### 2.8 SEO Audit — Corey Haines

- Revisão de indexação, rastreamento, metadados, estrutura de títulos, links e conteúdo.
- Ajuda a equilibrar experiências visuais complexas com legibilidade para mecanismos de busca.
- Usar antes da publicação e em **auditorias recorrentes**.

**Link:** https://github.com/coreyhaines31/marketingskills/tree/main/skills/seo-audit

### 2.9 React Best Practices — Vercel

- Diretrizes de performance e implementação React/Next.js.
- Ajuda com carregamento, bundles, renderização e busca de dados.
- Usar durante **implementação e code review**.

**Link:** https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices

### 2.10 Web Design Guidelines — Vercel

- Revisão de boas práticas para interfaces web.
- Abrange usabilidade, formulários, navegação, foco, animações e outros aspectos de UX.
- Usar como **auditoria antes de produção**.

**Link:** https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines

> **Atenção:** as skills são orientações para agentes, não bibliotecas que adicionam automaticamente recursos ao site. Elas podem divergir entre si; a direção criativa e as decisões arquiteturais do projeto sempre devem prevalecer. Verifique a documentação e os comandos atuais dos repositórios antes da instalação.

## 3. Stack tecnológica recomendada

### 3.1 Arquitetura principal

```text
                    Next.js + React + TypeScript
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
      Tailwind + shadcn/ui   GSAP + Motion    R3F + Three.js
         Design System       Animações           WebGL/3D
             │                 │                  │
             └─────────────────┼──────────────────┘
                               │
                   Sanity + Analytics + Vercel
                    Conteúdo + Medição + Deploy
```

**Escolha central:** Next.js para páginas e estrutura, Tailwind e shadcn/ui para o sistema visual, Motion para microinterações, GSAP para timelines e ScrollTrigger, React Three Fiber para 3D.

### 3.2 Stack completa por categoria

| Categoria | Tecnologia | Finalidade | Link |
|---|---|---|---|
| Framework | **Next.js (App Router)** | Renderização, roteamento e SEO | https://nextjs.org |
| Interface | **React + TypeScript** | UI robusta e tipada | https://react.dev |
| CSS | **Tailwind CSS v4** | Tokens e estilização | https://tailwindcss.com |
| Componentes | **shadcn/ui + Radix ou Base UI** | Primitivos e componentes acessíveis | https://ui.shadcn.com |
| Motion complexo | **GSAP + ScrollTrigger** | Timelines e scrollytelling | https://gsap.com |
| Microinterações | **Motion for React** | Gestos e transições de componentes | https://motion.dev |
| Rolagem opcional | **Lenis** | Suavização/sincronização de scroll | https://lenis.dev |
| Renderização 3D | **Three.js + React Three Fiber** | WebGL e cenas interativas | https://r3f.docs.pmnd.rs |
| Utilitários 3D | **Drei** | Helpers para React Three Fiber | https://github.com/pmndrs/drei |
| Pós-processamento | **React Postprocessing** | Efeitos visuais avançados | https://github.com/pmndrs/react-postprocessing |
| Modelagem 3D | **Blender** | Produção de modelos e materiais | https://www.blender.org |
| 3D visual rápido | **Spline (opcional)** | Protótipos e cenas 3D | https://spline.design |
| Vetores animados | **Rive ou Lottie** | Animações leves de interface | https://rive.app |
| Ícones | **Lucide + SVGs personalizados** | Iconografia consistente | https://lucide.dev |
| CMS | **Sanity** | Gestão de conteúdo | https://www.sanity.io |
| Analytics | **PostHog** | Eventos, funis e produto | https://posthog.com |
| Observabilidade | **Sentry** | Erros e monitoramento | https://sentry.io |
| Testes E2E | **Playwright** | Testes de navegação e comportamento | https://playwright.dev |
| Documentação UI | **Storybook** | Catálogo de componentes | https://storybook.js.org |
| Hospedagem | **Vercel** | Deploy e distribuição | https://vercel.com |

### 3.3 Estratégia de uso das tecnologias

- **GSAP:** timelines complexas, efeitos de scroll e narrativas cinematográficas.
- **Motion:** transições e microinterações de componentes React.
- **Three.js/R3F:** 3D autoral de alto impacto, carregado preferencialmente sob demanda.
- **Lenis:** opcional; introduzir somente quando houver benefício perceptível e integração bem testada.
- **Blender / Spline:** escolher conforme o fluxo de criação — não são ambos obrigatórios.
- **Sanity / PostHog / Sentry:** adicionar conforme as necessidades reais de conteúdo, mensuração e operações.

**Não instalar tudo indiscriminadamente.** Priorizar uma arquitetura modular em que efeitos e ferramentas possam ser adicionados ou removidos sem comprometer o projeto.

## 4. Instalação das skills

### 4.1 Design, motion, copywriting, SEO e frontend

Execute na pasta do projeto, com Node.js/npm disponíveis:

```bash
# 1. Anthropic — Frontend Design
npx skills add anthropics/skills --skill frontend-design -a claude-code

# 2. UI UX Pro Max
npx ui-ux-pro-max-cli init --ai claude

# 3. Impeccable
npx impeccable install

# 4. Emil Kowalski — Animate
npx skills add emilkowalski/skills --skill animate -a claude-code

# 7 e 8. Copywriting e SEO
npx skills add coreyhaines31/marketingskills --skill copywriting seo-audit -a claude-code

# 9 e 10. Vercel — React e Web Design
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices web-design-guidelines -a claude-code
```

### 4.2 GSAP e Three.js via marketplace do Claude Code

Dentro de uma sessão interativa do **Claude Code**, executar:

```text
/plugin marketplace add freshtechbro/claudedesignskills

/plugin install gsap-scrolltrigger
/plugin install react-three-fiber

# Bônus: aprofundamento em Three.js e WebGL
/plugin install threejs-webgl
```

**Observação:** comandos de marketplace/plugins e de instaladores externos dependem das versões e convenções atuais dos projetos. Confira o README e os identificadores das skills; certos plugins podem exigir identificação com o marketplace ou passos de seleção adicionais. Analise os scripts e permissões antes de executar código de terceiros.

## 5. Inicialização do projeto

### 5.1 Criar uma aplicação Next.js

```bash
# Criar aplicação com opções padrão modernas
pnpm create next-app@latest studio-2027 --yes

cd studio-2027

# Motion e animações
pnpm add gsap @gsap/react motion lenis

# Motor 3D e pós-processamento
pnpm add three @react-three/fiber @react-three/drei @react-three/postprocessing

# Ícones
pnpm add lucide-react

# Tipagens
pnpm add -D @types/three

# Base de componentes
pnpm dlx shadcn@latest init

# Ambiente de desenvolvimento
pnpm dev
```

### 5.2 Cuidados após a criação

1. Validar versões compatíveis de Next.js, React, R3F, Drei e pós-processamento.
2. Definir tipografia, grid, cores, raios, transparências e motion tokens antes de construir páginas.
3. Organizar componentes visuais, cenas 3D e conteúdo de forma independente.
4. Configurar testes, lint, formatação, medições e preview deploys.
5. Testar o site em dispositivos reais e em diferentes condições de desempenho.

## 6. Recursos visuais e experiências

### 6.1 Hero 3D cinematográfico

- Modelos 3D originais, iluminação controlada e materiais PBR.
- Movimento de câmera, parallax espacial e interação com cursor.
- Fallback estático ou versão leve para dispositivos modestos.

### 6.2 Glassmorphism refinado

- Vidro translúcido, blur moderado, bordas sutis e sensação de profundidade.
- Controle rigoroso de contraste e legibilidade.
- Evitar camadas de blur excessivas que prejudicam performance.

### 6.3 Scrollytelling

- Narrativas em seções com animações guiadas pelo scroll.
- Textos revelados progressivamente, cenas conectadas e elementos *pinned*.
- Regras claras de continuidade e navegação independente da animação.

### 6.4 Shaders e fundos dinâmicos

- Auroras, gradientes fluidos, partículas e reações suaves ao movimento.
- Renderização ajustada ao dispositivo e ao estado da página.
- Preferir soluções CSS/SVG quando o WebGL não for essencial.

### 6.5 Outros recursos premium

- Tipografia variável e responsiva com escalas fluidas.
- Microinterações com spring physics e easing consistente.
- Transições de páginas discretas e bem coordenadas.
- Menus, cards e botões com feedback refinado.
- Ícones animados e detalhes vetoriais personalizados.
- Hover magnético pontual e cursores contextuais apenas quando úteis.
- Sticky storytelling, seções editoriais e composições assimétricas.
- Alternância dark/light tratada como sistema visual completo.
- Transparências, sombras, iluminação e sobreposições com parcimônia.
- Design responsivo com atenção especial a mobile.

**Critério de escolha:** cada animação deve contribuir para orientação, feedback, hierarquia ou narrativa — nunca apenas aumentar a quantidade de efeitos.

## 7. Metas de qualidade

### 7.1 Core Web Vitals

| Métrica | Meta | O que mede |
|---|---|---|
| **LCP** | **≤ 2,5 s** | Carregamento do conteúdo principal |
| **INP** | **≤ 200 ms** | Responsividade às interações |
| **CLS** | **≤ 0,1** | Estabilidade visual |

Os valores correspondem a limites de classificação **“bom”** do Google, considerados no percentil 75 dos dados de usuários reais.

Referência: https://web.dev/articles/vitals

### 7.2 Critérios adicionais

- **Acessibilidade:** perseguir WCAG 2.2 nível AA; navegação por teclado e foco visível.
- **Preferências de movimento:** respeitar `prefers-reduced-motion`, com experiência útil sem animações intensas.
- **SEO:** HTML semântico, metadados, URLs consistentes, sitemap e dados estruturados quando aplicáveis.
- **Responsividade:** validar mouse, touch, diferentes densidades de tela, orientação e tamanhos.
- **Resiliência:** alternativas para falhas de WebGL, desativação de JavaScript quando viável e conexões lentas.
- **3D:** carregamento sob demanda, otimização de texturas/modelos e controle de consumo de GPU.
- **Testes:** E2E, testes visuais, inspeção de console, métricas e testes em dispositivos reais.
- **Conteúdo:** textos originais, claros e confiáveis; não inventar depoimentos, clientes ou números.

## 8. Processo de desenvolvimento

| Fase | Entregas principais | Skills/ferramentas prioritárias |
|---|---|---|
| 1. **Discovery** | Objetivos, público, proposta de valor e arquitetura de conteúdo | Copywriting, UI UX Pro Max |
| 2. **Direção criativa** | Três conceitos visuais distintos e escolha fundamentada | Frontend Design, UI UX Pro Max |
| 3. **Design system** | Tokens, tipografia, espaçamento, grid, cores, efeitos e motion | UI UX Pro Max, Impeccable |
| 4. **Prototipagem** | Layouts de alta fidelidade e validação de hierarquia | Frontend Design, Impeccable |
| 5. **Implementação** | Componentes, páginas, arquitetura e testes | React Best Practices |
| 6. **Motion e 3D** | Microinterações, timelines, fundos e cenas autorais | Animate, GSAP ScrollTrigger, React Three Fiber |
| 7. **Conteúdo e SEO** | Textos, títulos, CTAs, metadados e auditorias | Copywriting, SEO Audit |
| 8. **Refinamento** | Auditoria de UX, performance, responsividade e acessibilidade | Impeccable, Web Design Guidelines, React Best Practices |

**Regra operacional:** aprovar a direção visual antes de avançar para a implementação pesada. Definir critérios de aceite por fase. Evitar que múltiplas skills alterem padrões visuais de forma contraditória.

## 9. Prompt mestre para Claude Code

Copie o texto a seguir em uma nova sessão do Claude Code depois de instalar e conferir as skills.

```text
Atue como uma equipe sênior multidisciplinar formada por:

- Creative Director
- Principal UI/UX Designer
- Design Systems Engineer
- Senior Frontend Engineer
- Creative Developer (WebGL / Three.js)
- Motion Designer
- Technical SEO Specialist
- Conversion Copywriter
- Accessibility & Performance Engineer

OBJETIVO

Desenvolver uma experiência web de referência para 2027,
com qualidade comparável aos melhores projetos reconhecidos
por Awwwards, combinando originalidade, sofisticação,
interatividade e excelente engenharia frontend.

STACK PRINCIPAL

Next.js, React, TypeScript, Tailwind CSS,
shadcn/ui, GSAP, ScrollTrigger, Motion,
Three.js, React Three Fiber, Drei e Lenis.

PROCESSO OBRIGATÓRIO

FASE 1 — DISCOVERY
Entender produto, público-alvo, proposta de valor,
conteúdo, objetivos de conversão e diferenciais.

FASE 2 — DIREÇÃO CRIATIVA
Apresentar 3 conceitos visuais realmente distintos.
Definir uma direção principal e justificar as decisões.
Não começar a implementação antes da direção escolhida.

FASE 3 — DESIGN SYSTEM
Definir tokens de cores, tipografia, espaçamento,
grid, transparências, elevação, motion e responsividade.

FASE 4 — PROTOTIPAGEM
Desenvolver layouts de alta fidelidade e validar
hierarquia, composição, legibilidade e navegação.

FASE 5 — IMPLEMENTAÇÃO
Construir componentes reutilizáveis com código
organizado, tipado, testável e acessível.

FASE 6 — MOTION E 3D
Implementar animações cinematográficas com propósito,
microinterações, transições, WebGL e cenas 3D autorais.
Usar uma estratégia coordenada para evitar conflitos
entre motores de animação.

FASE 7 — COPYWRITING E SEO
Criar conteúdo original e persuasivo, metadados,
estrutura semântica, dados estruturados quando
aplicáveis e arquitetura indexável.

FASE 8 — REFINAMENTO
Executar auditorias de UI/UX, responsividade,
acessibilidade, animações e performance.
Corrigir problemas com base em testes visuais reais.

REGRAS DE QUALIDADE

- Evitar layouts e textos genéricos de IA.
- Não copiar a identidade visual de outras marcas.
- Evitar animações excessivas ou sem propósito.
- Não colocar toda a interface dentro de um Canvas 3D.
- Respeitar preferências de movimento reduzido.
- Preservar carregamento rápido e SEO.
- Oferecer fallback para dispositivos limitados.
- Não utilizar conteúdo fictício como se fosse real.
- Documentar decisões arquiteturais.
- Priorizar composição visual autoral e consistente.
- Não considerar o projeto finalizado sem testes
  funcionais, visuais e de acessibilidade.

ENTREGA ESPERADA

Uma experiência web visualmente memorável,
funcional, responsiva, escalável e pronta para produção.
```

## 10. Recomendação final e referências

### Conjunto-base prioritário

- **Direção visual:** Frontend Design + UI UX Pro Max + Impeccable.
- **Implementação principal:** Next.js + React + TypeScript + Tailwind + shadcn/ui.
- **Animações:** GSAP + ScrollTrigger para timelines e Motion para microinterações.
- **3D:** Three.js + React Three Fiber + Drei para experiências autorais selecionadas.
- **Conteúdo e descoberta:** Copywriting + SEO Audit.
- **Qualidade:** React Best Practices + Web Design Guidelines + testes reais.

### Escolha de escopo

Antes da direção de arte definitiva, classificar o projeto:

1. **Landing page comercial:** priorizar storytelling, copywriting, CTA, SEO e conversão.
2. **Site institucional de marca:** priorizar identidade, narrativa visual, credibilidade e navegação.
3. **Portfólio interativo:** priorizar originalidade, experimentação, transições e cenografia digital.
4. **Aplicação SaaS:** priorizar usabilidade, design system, acessibilidade, performance e padrões de interação.

A stack pode ser semelhante, mas a intensidade de 3D, animações e a arquitetura de navegação variam conforme o objetivo do produto.

### Links úteis adicionais

- Awwwards: https://www.awwwards.com
- Claude Code: https://code.claude.com/docs
- Skills.sh: https://skills.sh
- GSAP: https://gsap.com
- Motion: https://motion.dev
- React Three Fiber: https://r3f.docs.pmnd.rs
- Next.js: https://nextjs.org
- Web Vitals: https://web.dev/articles/vitals
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

---

*Documento de planejamento. As tecnologias, comandos e repositórios podem mudar até 2027; valide as versões e a compatibilidade antes de iniciar a implementação em produção.*
