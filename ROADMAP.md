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

## Visão geral

| Fase | Nome | Estado |
|---|---|---|
| 1 | Discovery | Concluída |
| 2 | Direção criativa | Concluída |
| 3 | Design system | Concluída |
| 4 | Prototipagem e prova de fogo | **Aguardando o titular ver em aparelho real** |
| 5 | Implementação das páginas | Concluída |
| 6 | Motion e 3D | **Em andamento** |
| 7 | Conteúdo e SEO | A fazer |
| 8 | Refinamento | A fazer |
| 9 | Idiomas | A fazer |
| 10 | Blindagem | A fazer |
| 11 | Lançamento | O titular faz, com o passo a passo pronto |
| 12 | Externos, se quiser | Só anotado |

## Fase 3: Design system

- [x] Projeto Next.js 16 com TypeScript estrito, Tailwind v4 e pnpm, sem Git
- [x] `.gitignore` e `.env.local` com `WHATSAPP_NUMERO`
- [x] Temas gerados de uma única fonte, com verificação de contraste automática
- [x] Fontes auto-hospedadas, com acentos conferidos nas capturas
- [x] Ornamentos: rosácea, cruz e árvore GPON
- [x] Componentes de base
- [x] Rota `/sistema` (versão inicial)
- [x] Storybook, com build verificado

## Fase 4: Prototipagem e prova de fogo

- [x] Atlas de glifos com SDF: 160 glifos, com latim, katakana, grego e glagolítico
- [x] Shader da chuva, com 3 camadas, interação com o cursor e o nome soletrado
- [x] Rosácea, vitral em peças, cruz de três barras, raios de luz e poeira
- [x] Pós-processamento e níveis de qualidade, com controlador de quadros
- [x] Relógio único (GSAP, Lenis, R3F)
- [x] Decisão sobre WebGPU: fora do lançamento
- [x] Hero em contêiner local com CSP estrita, sem violações
- [ ] **Medição em aparelho real.** Só houve renderização por software. O titular roda localmente e avalia no computador e no celular

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

## Fase 6: Motion e 3D

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
- [ ] **Som e fluidez em aparelho real.** O som nunca foi ouvido: só foi compilado. A cena só rodou em software
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
- [ ] `git init`, commits e push
- [ ] Certificado e vhost
- [ ] Primeiro deploy
- [ ] Testar em produção e publicar o texto final de `/seguranca`
- [ ] Search Console

## Registro

| Data | O que mudou |
|---|---|
| 05/11/2026 | Documentação concluída e pendências respondidas pelo titular. Início do desenvolvimento |
| 05/11/2026 | Fases 3 e 5 concluídas. Fase 4 aguarda avaliação em aparelho real. Próximo: Fase 6 |
| 05/11/2026 | Fase 6 implementada: nave 3D, storyboard, Divisor, terminal, CTF, som e service worker. Faltam revisão de animação e avaliação em aparelho real |
