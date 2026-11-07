# Roadmap

Onde estamos e o que falta. É atualizado junto com o código. O detalhe e os critérios de cada fase estão em [docs/12-roteiro.md](docs/12-roteiro.md).

**Legenda:** `[x]` feito e verificado · `[~]` em andamento ou parcial · `[ ]` a fazer

**Quem faz o quê:** o agente desenvolve e testa localmente. O titular faz Git, deploy, certificado e tudo que usa `sudo`.

## Como rodar localmente

```bash
pnpm install
pnpm dev          # desenvolvimento, em http://localhost:3000
pnpm build        # build de produção, com CSP e verificações
pnpm start        # serve o build em http://localhost:3000, com a CSP real
pnpm test:tudo    # lint, tipos, testes de unidade e E2E
pnpm modelos      # gera os modelos 3D (exige Blender em ~/.local/opt)
```

## Redesign

Em 06/11/2026, o titular avaliou a primeira versão no ar e pediu para refazer do zero tudo o que é design. O conceito Nave Digital foi descartado, e entra o conceito **Sinal** ([04](docs/04-direcao-criativa.md)). Dados, stack, infraestrutura, deploy e testes continuam. Detalhe das fases em [docs/12](docs/12-roteiro.md#redesign).

| Fase | Nome | Estado |
|---|---|---|
| R0 | Documentação do redesign | **Concluída. Aguardando o titular aprovar `04` e `05`** |
| R1 | Design system em código | **Em andamento. Aguardando o titular ver `/sistema`** |
| R2 | Base da cena compartilhada | **Concluída** |
| R3 | Protótipos A e B | **Concluída. Cena A escolhida em 07/11/2026; a B foi removida** |
| R4 | Seções no DOM | **Em andamento. Seções refeitas e revisadas em 07/11/2026 (tipografia, Formação, Competências, Contato, rodapé). Aguardando o titular rever** |
| R5 | Cena completa e storyboard | A fazer |
| R6 | Recursos | A fazer |
| R7 | Textos e compartilhamento | A fazer |
| R8 | Refinamento | A fazer |

### R0: Documentação do redesign

- [x] Pedido de redesign registrado no briefing, com as palavras do titular
- [x] Direção criativa nova: conceito Sinal, princípio do dado real, referências, duas cenas e três temas
- [x] Design system novo: temas Rubro, Claro e Fósforo com contraste calculado, Mona Sans e Martian Mono conferidas no Fontsource, moldura de instrumento, elementos gráficos e componentes
- [x] Motion e WebGL: chuva nova, cenas A e B, storyboard, microinterações
- [x] Recursos: simulação GPON, terminal, CTF de flags, registro da sessão, boot log, cursor-sonda, som
- [x] Ajustes em UX, conteúdo (trechos "a aprovar"), arquitetura, segurança, qualidade, projetos futuros, skills, decisões 56 a 72, pendências, README e `CLAUDE.md`
- [x] Aprovação do titular para `04` e `05` e para o nome "Sinal" (06/11/2026)

### R1: Design system em código

- [x] Três temas (Rubro, Claro, Fósforo) em `src/temas/temas.ts`, com `gerado.css` e contraste verificado no build
- [x] Fontes Mona Sans e Martian Mono, com eixos de largura e peso. As góticas saíram
- [x] Tokens e base de `globais.css`: escala fluida, larguras, movimento, bordas. Aliases provisórios para as seções antigas, que somem na R4
- [x] Dados derivados (`src/conteudo/derivados.ts`, com testes) e gerador de trilhas de placa
- [x] Moldura de instrumento com dados reais (hora UTC−3, rolagem, seção, FPS, nível, tema), régua visual e boot log
- [x] Registro da sessão (`src/movimento/registro.ts`), base do painel de eventos da R6
- [x] `/sistema` reescrito, com os três temas, tabela de contraste, escala, botões, trilhas e hexdump
- [x] Teto de luz da cena por tema e testes E2E adaptados aos temas novos
- [ ] Componentes de base no Storybook (adiado: as histórias antigas dependem de ornamentos que saem na R4)
- [ ] **O titular vê `/sistema` rodando localmente**

### R2: Base da cena compartilhada

- [x] Atlas novo: 109 glifos (hex, binário, 40 katakana, 22 símbolos de código e 11 traços de caixa desenhados à mão)
- [x] Shader da chuva reescrito, sem rosácea: três camadas, paleta por tema, sonda do cursor, frase escondida e flag 8
- [x] Travamento por máscara: contorno em traços de caixa, miolo em hex, aplicado ao nome do hero
- [x] Moldura ligada à cena: estado e nível de qualidade reais, eventos de carregamento no registro da sessão
- [x] Cena antiga removida (nave, lancetas, relicário, modelos e scripts do Blender). `scripts/blender/comum.py` fica para a R3
- [x] Teto de luz por tema e limites de luminância recalculados
- [x] Ganho da chuva compensado pela luminância do tema
- [x] Testes E2E completos com a cena nova (57 passando). A flag 6 do CTF passou para os metadados do SVG das trilhas
- [ ] Medição em aparelho real (passa para a R3, junto com as cenas A e B)

### R3: Protótipos A e B

- [x] As duas cenas prototipadas e comparadas. O titular escolheu a **A, "Tudo é código"**
- [x] Cena B, Blender, modelos, seletor, `?cena=`, comando `cena` e `pnpm avaliar` removidos ([decisão 81](docs/decisoes.md))
- [ ] Teste sem palavras com 5 pessoas e medição em aparelho real (passam para a R8)

### R4: Seções no DOM (07/11/2026)

- [x] `Secao` nova, sem margem de manuscrito, sem número ao lado do título e com trilhas de placa ao fundo
- [x] Sobre: ficha (cargo, local, estudo formal, tempo no cargo) e hexdump real. O "W" solto e o "N" iluminado saíram
- [x] Agora: a árvore vem da chuva; a simulação GPON ficou em quadrados e LEDs, sem a mini rosácea (removida na revisão abaixo)
- [x] Trajetória: traceroute de dez saltos, com um pacote que anda com a rolagem
- [x] Formação: blocos de carga horária real (2.600 h e 420 h) e o curso em andamento pelo tempo decorrido de hoje
- [x] Competências: anéis de evidência, com um arco por item (trocados por degraus na revisão abaixo). Certificados: tabela com SHA-256 do registro
- [x] Rodapé com hash do build e faixa de bits
- [x] Barra de navegação em vidro líquido, com lente que desliza até a seção atual ([decisão 82](docs/decisoes.md))
- [x] Chuva a 60% da velocidade; sonda do cursor removida
- [x] Storyboard reescrito: nome que se expande, títulos decodificados, traceroute, blocos e anéis
- [ ] `/cv`, `/seguranca`, 404 e offline com o design novo
- [ ] Índice (menu de telas estreitas) revisado
- [x] Refração de borda do vidro testada e descartada (só Chromium, quase imperceptível)

#### Revisão do titular (07/11/2026, decisões 87 a 95)

- [x] Bug: comentário quebrado em `globais.css` descartava a `.barra::before`, e o conteúdo aparecia atrás da barra e dos cantos da moldura
- [x] Bug: a ficha de Sobre grudava por cima de "O que procuro". Agora o `sticky` termina em `.sobre-topo`
- [x] Bug: o véu do hero virava um retângulo escuro atrás do cargo. Agora é um degradê longo, com sombra que acompanha as letras
- [x] Canto inferior da moldura com esmaecimento, para o texto não passar por baixo dos dados
- [x] Tipografia: JetBrains Mono no lugar da Martian Mono, títulos menos largos e menos pesados, hierarquia por cor (`tinta-2` e o papel novo `tinta-dado`)
- [x] Agora: simulação GPON removida. A árvore 3D da chuva fica, só em tela larga
- [x] Trilhas refeitas como placa real (barramentos, 45° em leque, componentes e vias), só em Início, Trajetória e Certificados
- [x] Formação em régua comum de horas e régua de tempo para o curso em andamento, sem cartões
- [x] Competências em degraus tipográficos, sem anéis
- [x] Contato com canais em linhas e copiar ao lado do e-mail. Rodapé com assinatura, páginas, build numa linha e faixa de bits como fio
- [x] Formas da chuva de Agora e Contato fora das telas estreitas
- [x] Capturas em 360, 390, 768 e 1440 px, temas Rubro e Claro (`scripts/capturas.ts` agora inclui 768 px)
- [x] Nome do hero limitado a 11,2vw: "Warley Ferraz" cabia cortado em 390 px. Barra cabe em 360 px
- [x] Testes: 56 de unidade e 52 E2E passando (os 5 da simulação GPON saíram). Os testes do terminal repetem o atalho até a barra hidratar, porque falhavam sob carga
- [ ] **O titular revê o resultado localmente**

## Visão geral das fases originais

As fases 2, 3, 4 e 6 foram substituídas pelo redesign no que é visual. O que elas construíram em dados, relógio, níveis de qualidade, CSP, deploy e testes é reaproveitado. As fases 7 a 12 continuam depois do R8.

| Fase | Nome | Estado |
|---|---|---|
| 1 | Discovery | Concluída |
| 2 | Direção criativa | Substituída pelo R0 |
| 3 | Design system | Concluída, substituída pela R1 |
| 4 | Prototipagem e prova de fogo | Substituída pelas R2 e R3 |
| 5 | Implementação das páginas | Concluída. Seções serão refeitas na R4 |
| 6 | Motion e 3D | Substituída pelas R5 e R6 |
| 7 | Conteúdo e SEO | A fazer |
| 8 | Refinamento | A fazer |
| 9 | Idiomas | A fazer |
| 10 | Blindagem | A fazer |
| 11 | Lançamento | O titular faz, com o passo a passo pronto |
| 12 | Externos, se quiser | Só anotado |

## Fase 3: Design system (substituída no visual)

- [x] Projeto Next.js 16 com TypeScript estrito, Tailwind v4 e pnpm, sem Git
- [x] `.gitignore` e `.env.local` com `WHATSAPP_NUMERO`
- [x] Temas gerados de uma única fonte, com verificação de contraste automática
- [x] Fontes auto-hospedadas, com acentos conferidos nas capturas
- [x] Ornamentos: rosácea, cruz e árvore GPON
- [x] Componentes de base
- [x] Rota `/sistema` (versão inicial)
- [x] Storybook, com build verificado

## Fase 4: Prototipagem e prova de fogo (substituída no visual)

- [x] Atlas de glifos com SDF: 160 glifos, com latim, katakana, grego e glagolítico
- [x] Shader da chuva, com 3 camadas, interação com o cursor e o nome soletrado
- [x] Rosácea, vitral em peças, cruz de três barras, raios de luz e poeira
- [x] Pós-processamento e níveis de qualidade, com controlador de quadros
- [x] Relógio único (GSAP, Lenis, R3F)
- [x] Decisão sobre WebGPU: fora do lançamento
- [x] Hero em contêiner local com CSP estrita, sem violações
- [ ] ~~Medição em aparelho real~~. Passa para a R3, com as cenas novas

## Fase 5: Implementação das páginas

- [x] Esquema Zod e conteúdo pt-BR
- [x] Certificados gerados do catálogo (36)
- [x] Verificador de conteúdo, com testes
- [x] Seções estáticas da página inicial
- [x] `/cv`, `/seguranca`, 404 e offline
- [x] Navegação, Índice, filtros na URL, trocador de temas
- [x] Revelação do WhatsApp e copiar e-mail
- [x] Pós-build: CSP por rota, security.txt, robots, sitemap, SBOM, gzip
- [x] Dockerfile, compose, nginx e `atualizar.sh`. Imagem testada com as restrições de produção. `atualizar.sh` ainda não foi executado
- [x] Testes: 35 de unidade e 34 E2E, incluindo cabeçalhos, axe, legibilidade e sem JavaScript

## Fase 6: Motion e 3D (substituída no visual)

- [x] Relógio único fora da cena: Lenis e ScrollTrigger funcionam também sem WebGL
- [x] Scripts do Blender: nave, colunas, lancetas e relicário, com luz assada e quantização
- [x] Nave 3D em R3F, caminho da câmera por seção, atmosfera e relicário
- [x] Storyboard: Início, Sobre, Agora, Trajetória, Formação, Competências, Certificados, Contato
- [x] O Divisor, com clique, teclado, anúncio em leitor de tela e estado na sessão
- [x] Tela branca e cursor-vela
- [x] Microinterações: hover magnético, link de ouro, selo inclinado, filtros com Motion, Índice com mola, número decodificado
- [x] Transições de rota e de tema, com View Transitions
- [x] Terminal, com todos os comandos e dados reais
- [x] CTF dos nove selos, com sigilos em Lottie, coelho e tema Selado
- [x] Som ambiente procedural
- [x] Service worker, manifesto e página offline
- [x] Movimento reduzido validado em testes
- [x] Testes: 53 de unidade e 64 E2E, mais a imagem do contêiner com as restrições de produção
- [ ] ~~Som e fluidez em aparelho real~~. Passa para a R3 (cena) e a R6 (som novo)
- [x] Revisão com `gsap-performance` e `emil-animation-performance`: desfoque sobre o canvas, variável herdada, alocação por quadro e leitura de layout corrigidos

## Fase 7: Conteúdo e SEO

- [ ] Revisão dos textos na página real
- [ ] Metadados, JSON-LD, sitemap, robots, humans
- [ ] Imagens de compartilhamento
- [ ] PDF público sem telefone
- [ ] Links de certificados testados (e conferir que não expõem CPF)
- [ ] Auditoria `seo-audit`

## Fase 8: Refinamento

- [ ] Reduzir o JS inicial: 179 KB medidos, meta de 130 KB
- [ ] `impeccable audit` e `polish`
- [ ] `web-design-guidelines` e `vercel-react-best-practices`
- [ ] Lista manual de acessibilidade
- [ ] Testes em navegadores e aparelhos
- [ ] Rubrica de qualidade

## Fase 9: Idiomas

- [ ] Rotas e `hreflang`
- [ ] Inglês
- [ ] Espanhol
- [ ] Alemão
- [ ] Francês

## Fase 10: Blindagem

- [ ] CSP e cabeçalhos finais, rota por rota. Fixar o digest da imagem e ativar `minimumReleaseAge`
- [ ] Armadilhas e easter eggs para quem tenta explorar
- [ ] Gitleaks, Trivy, `pnpm audit`, zizmor
- [ ] `security-review` e testes locais
- [ ] Lista de ajustes do VPS para o titular
- [ ] Sessão explicando cada controle ao titular

## Fase 11: Lançamento (titular)

- [ ] Revisar o site localmente
- [x] `git init`, commits e push
- [x] Certificado e vhost
- [x] Primeiro deploy, de acompanhamento, em 05/11/2026. No ar, com `noindex`
- [ ] Deixar o repositório privado: ele ainda está público
- [ ] `sudo certbot renew --dry-run`
- [ ] Primeira execução de `deploy/atualizar.sh`
- [ ] Remover `X-Robots-Tag: noindex` do vhost, para o Google poder indexar
- [ ] Testar em produção e publicar o texto final de `/seguranca`
- [ ] Search Console

## Registro

| Data | O que mudou |
|---|---|
| 05/11/2026 | Documentação concluída e pendências respondidas pelo titular. Início do desenvolvimento |
| 05/11/2026 | Fases 3 e 5 concluídas. Fase 4 aguarda avaliação em aparelho real. Próximo: Fase 6 |
| 05/11/2026 | Site no ar em warley.ferzion.com.br para acompanhamento. Conferido como visitante: sem erros de console nem recursos de terceiros |
| 05/11/2026 | Compose com nome de projeto próprio e `noindex` no vhost, antes do primeiro deploy de acompanhamento |
| 05/11/2026 | Fase 6 implementada: nave 3D, storyboard, Divisor, terminal, CTF, som e service worker. Faltam revisão de animação e avaliação em aparelho real |
| 06/11/2026 | Titular reprova o design da primeira versão e pede redesign completo. R0 concluída: documentação do conceito Sinal. Aguarda aprovação de `04` e `05` |
| 06/11/2026 | R0 aprovada pelo titular. R1 implementada: temas, fontes, tokens, moldura com dados reais, derivados e `/sistema`. Pendentes: Storybook e a avaliação do titular |
| 06/11/2026 | R2 implementada: atlas e shader novos, travamento por máscara, cena antiga removida |
| 06/11/2026 | R3 implementada: cenas A e B para avaliação, com `pnpm avaliar`. Aguarda a escolha do titular |
| 07/11/2026 | Titular escolhe a cena A e pede: sem W solto, sem efeito de cursor, Formação nova, chuva mais lenta e vidro líquido na navegação. Cena B removida; seções refeitas |
