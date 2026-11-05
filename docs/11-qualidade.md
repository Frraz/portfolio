# 11 — Qualidade

Como saber se está bom. As fases só avançam quando seus critérios passam.

## Orçamentos

Medidos em aparelho real de faixa intermediária, em 4G, além das medições de laboratório.

### Core Web Vitals

| Métrica | Meta | Observação |
|---|---|---|
| LCP | ≤ 2,5 s | O H1 em texto é o elemento do LCP |
| INP | ≤ 200 ms | Testar durante a chuva |
| CLS | ≤ 0,1 | Nada muda de lugar quando a cena entra |

Com pouco tráfego, o relatório CrUX do Google não terá dados deste site. Por isso, usamos Lighthouse no CI e medição em aparelho real, e o PostHog pode registrar valores reais, se ligado.

### Pesos

| Item | Limite (gzip) |
|---|---|
| HTML inicial | 40 KB |
| CSS | 40 KB |
| JS inicial, antes da cena | 130 KB. **Medido em 05/11/2026: 179 KB, acima da meta.** A reduzir na Fase 8 |
| Fontes com preload | 80 KB |
| Motion e GSAP, depois da pintura | 70 KB |
| Bibliotecas 3D, depois da pintura | 380 KB |
| Assets do hero | 1,5 MB |
| Total da primeira visita, no nível alto | 4 MB |
| Total da primeira visita, no nível baixo | 1,5 MB |

`pnpm build` falha se o JS inicial passar do limite. O Lighthouse CI confere as demais metas.

### Lighthouse

| Categoria | Meta em `/` (celular) | Meta em `/cv` |
|---|---|---|
| Performance | ≥ 85 | ≥ 95 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 |

Em Performance na página inicial, o INP e o LCP reais pesam mais que a nota.

## Acessibilidade

Meta: WCAG 2.2 AA. A automação só pega parte dos problemas, então o teste manual é obrigatório.

**Automático:** axe em todas as rotas e temas, sem violações graves. Contraste com `verificar-contraste`.

**Manual, antes de cada lançamento**

- [ ] Teclado: chegar a tudo com `Tab`, em ordem lógica, com foco sempre visível e nunca coberto.
- [ ] Leitor de tela: NVDA ou Orca no desktop e VoiceOver no iPhone, percorrendo a página.
- [ ] Zoom de 200% e fonte do navegador em 200%, sem cortar conteúdo.
- [ ] Movimento reduzido: todas as linhas da [tabela](06-motion-e-webgl.md#movimento-reduzido).
- [ ] Sem CSS e sem JavaScript: a página é lida em ordem.
- [ ] Alto contraste do sistema e `forced-colors`.
- [ ] Sem flashes acima de 3 por segundo, inclusive na tela branca.
- [ ] Controle para pausar a chuva, visível.
- [ ] Letra gótica: 5 pessoas leem o nome e os títulos sem hesitar. Se falhar, ajustar o peso ou o tamanho.

## SEO

Aplicação da skill SEO Audit ao site. Palavras-chave reais, sem repetição artificial (OB).

**Busca-alvo:** o próprio nome, e combinações como `analista de redes NOC Pará`, `analista NOC remoto` e `analista de redes GPON`. Ranquear para termos gerais não é meta realista: o objetivo é que quem procura o nome encontre o site e o entenda.

| Item | Regra |
|---|---|
| Rastreamento | `robots.txt` permissivo, sitemap com as 3 rotas indexáveis e o PDF |
| Renderização | Conteúdo em HTML estático, testado com JavaScript desligado |
| Títulos | Um `h1` por rota, ordem correta, títulos únicos |
| Metadados | Título ≤ 60 caracteres, descrição ≤ 155, texto em [02](02-conteudo.md#seo) |
| Canonical | Sempre com `https://warley.ferzion.com.br` sem barra final |
| Dados estruturados | JSON-LD `Person` estático na página inicial. Testar no Rich Results Test |
| Compartilhamento | OG 1200×630 por rota, em `/og/`, com o nome legível no WhatsApp |
| Idioma | `lang` correto por rota e `hreflang` entre versões, com pt-BR como `x-default` |
| Links | `/`, `/cv` e `/seguranca` se interligam. LinkedIn e GitHub apontam de volta |
| 404 | Status real 404, servido pelo nginx |
| Search Console | Titular cadastra e envia o sitemap |

**Descoberta:** o link do site no LinkedIn e no GitHub, colocado pelo titular, ajuda quem busca o nome a encontrá-lo.

## Testes

| Tipo | Ferramenta | O que cobre |
|---|---|---|
| Unidade | Vitest | Esquemas, numeração de seções, comandos do terminal, verificação de selos, verificador de conteúdo |
| Conteúdo | `verificar-conteudo` | Termos, telefone, PII, nomes de projeto, datas |
| Contraste | `verificar-contraste` | Todos os pares de todos os temas |
| E2E | Playwright | Fluxos do recrutador, navegação, filtros na URL, terminal, CTF, revelação de WhatsApp, PDF |
| Cabeçalhos | Playwright com a imagem real do Docker | CSP, HSTS e demais cabeçalhos em cada rota; sem violações de CSP no console |
| Acessibilidade | axe + Playwright | Todas as rotas nos 5 temas e idiomas |
| Legibilidade sobre a cena | Playwright com quadros fixos | Luminância atrás de cada bloco de texto, em cada tema ([limites](06-motion-e-webgl.md#legibilidade-sobre-a-cena)) |
| Regressão visual | Playwright + Storybook | Componentes e cada seção, em 390 e 1440 px, com a cena em quadro fixo |
| WebGL | Playwright com GPU em software e aparelhos reais | Cena inicia sem erro, perda de contexto, fallback, cada nível de qualidade |
| Desempenho | Lighthouse CI + orçamentos | Rotas principais |
| Links | Script próprio | Validação de todos os certificados e links externos antes de publicar |
| Segurança | Gitleaks, Trivy, `pnpm audit`, zizmor | CI |

**Navegadores:** Chrome, Firefox e Safari, em desktop e celular. Aparelhos reais obrigatórios: um Android intermediário e um iPhone. O titular testa em Firefox no Linux, sem WebGPU.

**CI:** GitHub Actions com permissões mínimas, ações por SHA e todos os itens acima. Sem deploy automático: a publicação é um comando do titular.

## Verificação visual

As skills Impeccable e `taste-skill` insistem em olhar o resultado. A cada fase visual:

1. Tirar capturas em 390, 768 e 1440 px, em todos os temas relevantes.
2. Olhar as imagens, e não só medir.
3. Corrigir em lote e olhar de novo.
4. Passar pela auditoria de Web Interface Guidelines (Vercel), buscando a versão atual das regras antes de cada auditoria.

**Adaptações às Web Interface Guidelines:** as regras de "Title Case" e "evite primeira pessoa" não se aplicam, porque o site é em português e é um portfólio pessoal. O restante vale.

**Itens do piso de qualidade da skill Impeccable:**

- Corpo com 65–75 caracteres; `tracking` nunca abaixo de −0,04 em.
- Hover, foco, pressionado, desativado, carregando, erro, vazio.
- Seleção, cursor de digitação, barra de rolagem, foco e numerais na paleta.
- Toda exigência do briefing fácil de achar em segundos.

## Rubrica de premiação

Pesos das [Awwwards](https://awwwards.com/about-evaluation): design 40%, usabilidade 30%, criatividade 20%, conteúdo 10%. Pontuar de 0 a 10. **Meta: média 8 ou mais em cada eixo**, avaliada por alguém que não construiu a tela, antes da inscrição. A nota é ferramenta interna e não indica prêmio.

| Eixo | Pergunta | Evidência |
|---|---|---|
| **Design (40%)** | A composição é memorável? Tipografia e cor têm voz própria? O acabamento se mantém em cada seção, inclusive no rodapé? | Capturas em todas as seções, comparadas com sites premiados recentes |
| **Usabilidade (30%)** | Acha-se tudo em segundos? Funciona no celular, sem WebGL, por teclado e com pouca banda? | Métricas, testes de 10 segundos, Lighthouse |
| **Criatividade (20%)** | A ideia pertence a este titular? Passa no teste do concorrente: outra pessoa de TI poderia usar o mesmo site? O Divisor faz sentido? | Avaliador explica a ideia sem ajuda |
| **Conteúdo (10%)** | O texto é específico e verdadeiro? O visitante sabe o próximo passo? | Revisão pelas regras de [02](02-conteudo.md) e [01](01-veracidade-e-fontes.md) |

**Inscrições:** deixadas de lado por enquanto, por decisão do titular. A rubrica continua orientando a qualidade.

## Critérios de pronto para lançar

- [ ] Todas as metas acima atendidas, com as exceções registradas em [decisoes.md](decisoes.md).
- [ ] Textos aprovados pelo titular.
- [ ] Pendências que bloqueiam resolvidas ([pendencias.md](pendencias.md)).
- [ ] Testes em aparelho real.
- [ ] Links de certificados conferidos.
- [ ] `/seguranca` só com o que foi testado em produção.
- [ ] Teste do recrutador com 5 pessoas.
- [ ] O titular explica em voz alta cada controle de `/seguranca`.
