# Sinal

Documentação do portfólio de Warley Ferraz Almeida, que será publicado em [warley.ferzion.com.br](https://warley.ferzion.com.br).

**Estado:** em redesign completo, desde 06/11/2026. Veja o [ROADMAP](ROADMAP.md). O nome do conceito é provisório.

## A ideia

**O ruído vira sinal.** A tela é uma chuva de código vermelha, e ao rolar esse ruído se organiza em formas com sentido: o nome, a fibra de uma rede GPON se dividindo, o traceroute da carreira até o NOC, o handshake do contato. É o que o titular faz no trabalho: achar o sinal no meio de milhares de métricas e linhas de log.

Uma moldura de instrumento cerca a página com dados reais (hora, rolagem, FPS, hash do build), porque aqui todo enfeite técnico mostra algo verdadeiro. O visual mira referência de design em 2027. O texto diz a verdade: um Analista de Redes N2 que está começando em cibersegurança.

## Onde achar o quê

| Se você quer... | Leia |
|---|---|
| Entender o pedido e o objetivo | [00 — Briefing](docs/00-briefing.md) |
| Saber o que pode ser publicado | [01 — Veracidade e fontes](docs/01-veracidade-e-fontes.md) |
| Ler os textos do site | [02 — Conteúdo](docs/02-conteudo.md) |
| Ver rotas, navegação e fluxos | [03 — UX e navegação](docs/03-ux-e-navegacao.md) |
| Entender o conceito Sinal e as referências | [04 — Direção criativa](docs/04-direcao-criativa.md) |
| Consultar cores, fontes e componentes | [05 — Design system](docs/05-design-system.md) |
| Implementar chuva, formas das seções e animações | [06 — Motion e WebGL](docs/06-motion-e-webgl.md) |
| Implementar terminal, CTF e registro da sessão | [07 — Recursos interativos](docs/07-recursos-interativos.md) |
| Ver a stack e a estrutura do código | [08 — Arquitetura técnica](docs/08-arquitetura-tecnica.md) |
| Conferir CSP, contêiner e LGPD | [09 — Segurança e privacidade](docs/09-seguranca-e-privacidade.md) |
| Colocar no ar e atualizar | [10 — Deploy e operação](docs/10-deploy-e-operacao.md) |
| Saber as metas e os testes | [11 — Qualidade](docs/11-qualidade.md) |
| Seguir as fases do trabalho | [12 — Roteiro](docs/12-roteiro.md) |
| Adicionar projetos no futuro | [13 — Projetos futuros](docs/13-projetos-futuros.md) |
| Ver as 10 skills e a cobertura da stack | [14 — Skills e stack](docs/14-skills-e-stack.md) |
| Entender por que algo foi decidido | [Decisões](docs/decisoes.md) |
| Ver o que depende do titular | [Pendências](docs/pendencias.md) |

**Arquivos de referência do titular:** [skills-stacks.md](skills-stacks.md) e [skills-stacks2.md](skills-stacks2.md). [referenciasdeestilo.md](referenciasdeestilo.md) é histórico da primeira versão e não orienta mais o design.

## Próximo passo

Siga o [ROADMAP](ROADMAP.md).

## Stack

Next.js 16, React 19, TypeScript, Tailwind v4, Base UI, GSAP com ScrollTrigger, Motion, Lenis, Three.js, React Three Fiber, Drei, Postprocessing, Lottie, Storybook, Playwright e Vitest. O site é estático e fica em contêiner nginx sem privilégios, no VPS próprio.

## Fontes de dados

Os fatos profissionais vêm de `../curriculo`, somente leitura. Nada é publicado sem estar lá.
