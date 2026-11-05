# 12 — Roteiro

Detalhe de cada fase e seus critérios de pronto. **O acompanhamento do que está feito fica em [ROADMAP.md](../ROADMAP.md).** As fases seguem as 8 do `skills-stacks.md`, mais idiomas, blindagem e lançamento. Nada vai ao ar sem o titular.

| Fase | Nome | Principais skills | Bloqueio do titular |
|---|---|---|---|
| 1 | Discovery | Copywriting, UI UX Pro Max | — |
| 2 | Direção criativa | Frontend Design, UI UX Pro Max | Ler `02` e `04` |
| 3 | Design system | UI UX Pro Max, Impeccable | Aprovar a página `/sistema` local |
| 4 | Prototipagem e prova de fogo | Frontend Design, R3F, `threejs-webgl`, Impeccable | Aprovar hero em aparelho real |
| 5 | Implementação | React Best Practices | — |
| 6 | Motion e 3D | Animate, GSAP, R3F | Instalar Blender, se necessário |
| 7 | Conteúdo e SEO | Copywriting, SEO Audit | Aprovar textos |
| 8 | Refinamento | Impeccable, Web Design Guidelines, React Best Practices | Teste em aparelho real |
| 9 | Idiomas | Copywriting | Revisar o que conseguir |
| 10 | Blindagem | `security-review`, Impeccable `harden` | Ajustes com `sudo` no VPS |
| 11 | Lançamento | — | Git, certificado e deploy |
| 12 | Externos, se quiser | — | Decidir sobre Sanity, PostHog, Sentry e Uptime |

## Fase 1: Discovery (concluída)

**Entregas:** [00](00-briefing.md), [01](01-veracidade-e-fontes.md), [02](02-conteudo.md), [03](03-ux-e-navegacao.md).

## Fase 2: Direção criativa (concluída)

**Entregas:** três conceitos apresentados, Nave Digital escolhida e [04](04-direcao-criativa.md).

**Pendente:** leitura do titular sobre nomes poéticos e regras do sagrado.

## Fase 3: Design system

**Tarefas**

1. Criar o projeto ([instalação](14-skills-e-stack.md#instalação-no-início-do-desenvolvimento)), com `.gitignore` e sem Git, que é do titular.
2. Copiar os 5 temas para `src/temas/` e ativar `verificar-contraste`.
3. Baixar e criar subconjuntos das fontes. Testar letras acentuadas (`ã`, `ç`, `é`) em Grenze Gotisch e Jacquard 24.
4. Criar `gerar-ornamentos.ts`, com rendilhado, lanceta e selos.
5. Construir os componentes de base, com todos os estados, no Storybook.
6. Criar `/sistema` em versão inicial.
7. Rodar `impeccable critique` sobre `/sistema`.

**Pronto quando:** `/sistema` exibe tudo nos 5 temas, a letra gótica passa no teste de leitura e o contraste automático passa.

## Fase 4: Prototipagem e prova de fogo

O maior risco técnico vem primeiro.

**Tarefas**

1. Criar `gerar-atlas.ts` e o shader da chuva, com as três camadas.
2. Criar a rosácea, primeiro por SDF, com o gerador de rendilhado.
3. Montar pós-processamento e níveis de qualidade.
4. **Avaliar WebGPU/TSL** pelos [critérios](06-motion-e-webgl.md#renderizador), registrando a decisão.
5. Colocar o hero em um contêiner local com **CSP estrita ativa**. Testar `experimental.sri` e `viewTransition` com `output: "export"`.
6. Medir em celular intermediário e em iPhone reais.
7. Prototipar as seções em alta fidelidade, sem motion, com o texto real, em 390 e 1440 px.

**Pronto quando:** o hero roda dentro do orçamento em aparelho real, sem violação de CSP, LCP ≤ 2,5 s e o titular aprova. **Se reprovar, ajustar o documento 06 antes de seguir.**

## Fase 5: Implementação

**Tarefas**

1. Criar esquema Zod, `src/conteudo/pt-BR.ts` e `verificar-conteudo`, com testes.
2. Gerar os certificados a partir do catálogo.
3. Construir as seções estáticas, com HTML semântico, inclusive `Obras` oculta.
4. Criar `/cv`, `/seguranca`, 404 e offline.
5. Criar navegação, Índice, filtros na URL, trocador de temas, revelação de WhatsApp e copiar e-mail.
6. Criar pós-build (CSP, SBOM, gzip), Dockerfile e compose.
7. Rodar E2E de cabeçalhos e axe.

**Pronto quando:** o site inteiro funciona **sem WebGL e sem JavaScript**, passa no verificador de conteúdo e pode ser lido em celular. A partir daqui, uma versão completa e sem efeitos já pode ser publicada se o titular quiser.

## Fase 6: Motion e 3D

**Tarefas**

1. Criar o relógio global (GSAP, Lenis, R3F).
2. Escrever os scripts do Blender, com nave, colunas, lancetas e relicário. Exportar e otimizar (`pnpm modelos`).
3. Seguir o storyboard, uma seção por vez: Início, Agora, Formação, Trajetória, Competências, Certificados, Sobre e Contato.
4. Criar o Divisor, a tela branca e o cursor-vela.
5. Criar as microinterações e as transições de rota.
6. Criar terminal, CTF, som e service worker.
7. Validar movimento reduzido em cada passo.
8. Rodar `emil-animation-performance` e `gsap-performance`.

**Pronto quando:** todas as linhas do [storyboard](06-motion-e-webgl.md#storyboard-da-rolagem) e dos [recursos](07-recursos-interativos.md) funcionam nos níveis de qualidade, dentro dos orçamentos.

## Fase 7: Conteúdo e SEO

**Tarefas**

1. Revisar os textos com a skill Copywriting, em sua página real.
2. Obter aprovação do titular para [02](02-conteudo.md) e regras de `/seguranca`.
3. Implementar metadados, JSON-LD, sitemap, OG e `humans.txt`.
4. Gerar o PDF e conferir: uma coluna, sem telefone, sem projetos, texto extraível.
5. Testar todos os links de certificado e conferir as páginas de validação.
6. Rodar `seo-audit`.

**Pronto quando:** textos aprovados, links conferidos e `seo-audit` sem pendência crítica.

## Fase 8: Refinamento

**Tarefas**

1. `impeccable audit` e `polish`.
2. `web-design-guidelines`, com as regras atuais.
3. `vercel-react-best-practices` e `simplify`.
4. `security-review`, Gitleaks, Trivy, `pnpm audit`, zizmor.
5. Passar a lista de acessibilidade manual ([11](11-qualidade.md#acessibilidade)).
6. Testar nos navegadores e aparelhos.
7. Fazer o teste de 10 segundos com 5 pessoas.
8. Avaliar pela rubrica e corrigir.

**Pronto quando:** [critérios de pronto](11-qualidade.md#critérios-de-pronto-para-lançar) passam.

## Fase 9: Idiomas

**Tarefas**

1. Traduzir `src/conteudo/` para inglês, espanhol, alemão e francês.
2. Gerar rotas, `hreflang`, sitemap, imagens de compartilhamento e PDF por idioma.
3. Testar fontes com os caracteres de cada idioma, como `ß`, `ñ` e `œ`.
4. Passar o verificador de conteúdo em todos os idiomas.

**Pronto quando:** todas as rotas funcionam em cada idioma, sem texto em pt-BR esquecido.

## Fase 10: Blindagem

**Tarefas**

1. Cabeçalhos e CSP finais, revisados rota por rota, em modo de bloqueio.
2. Armadilhas e easter eggs para quem tenta explorar ([07](07-recursos-interativos.md#armadilhas-para-quem-tenta-explorar)).
3. Revisão de cadeia de suprimentos: Gitleaks, Trivy, `pnpm audit`, zizmor.
4. `security-review` e testes dirigidos em ambiente local.
5. Lista de ajustes do VPS para o titular, como `server_tokens off`.
6. Sessão explicando ao titular cada controle, para ele saber responder em entrevista.

**Pronto quando:** nota A+ no Observatory em teste local possível, sem violações de CSP e com o titular entendendo cada controle.

## Fase 11: Lançamento

**O titular faz** ([passo a passo](10-deploy-e-operacao.md#primeiro-deploy))

1. Revisar o site rodando localmente.
2. `git init`, commits e push.
3. Certificado e vhost.
4. Primeiro deploy.
5. Testar em `https://warley.ferzion.com.br`.
6. Rodar Observatory e SSL Labs. O texto final de `/seguranca` só afirma o que passou.
7. Cadastrar no Search Console e enviar o sitemap.
8. Colocar o link no LinkedIn e no GitHub, quando atualizar o perfil.

## Fase 12: Externos, se quiser

Sanity, PostHog, Sentry e Uptime ficam só anotados. O titular decide no final.

## Depois do lançamento

| Item | Quando |
|---|---|
| Ativar "Obras" | Quando o titular decidir ([13](13-projetos-futuros.md)) |
| WebGPU | Se ficou de fora, reavaliar por trimestre |
| Revisar `security.txt` | A cada 6 meses |
| Revisar conteúdo | A cada trimestre, com o `plano_desenvolvimento.md` |
| Atualizar dependências | Mensalmente, com o atraso mínimo de versões |
| Registrar na base do currículo | O que o titular aprendeu e sabe explicar deste projeto |

## Como executar com Claude Code

Cada fase começa com a leitura de `CLAUDE.md`, deste roteiro e dos documentos citados, e com o carregamento das skills da fase. Ao final: critérios verificados, decisões registradas e relato do que foi e do que não foi testado.
