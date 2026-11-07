# 12 — Roteiro

Detalhe de cada fase e seus critérios de pronto. **O acompanhamento do que está feito fica em [ROADMAP.md](../ROADMAP.md).** Nada vai ao ar sem o titular.

Cada fase termina com `pnpm verificar && pnpm build && pnpm test && pnpm test:e2e`, capturas em 390, 768 e 1440 px olhadas de verdade, e ROADMAP e documentos atualizados no mesmo passo.

## Redesign

Pedido do titular em 06/11/2026 ([briefing](00-briefing.md#pedido-de-redesign-06112026)): refazer do zero tudo o que é design. As fases R0 a R8 substituem o que era visual nas fases originais e reaproveitam o que elas construíram em dados, relógio, níveis de qualidade, CSP, deploy e testes.

| Fase | Nome | Bloqueio do titular |
|---|---|---|
| R0 | Documentação do redesign | Ler e aprovar `04` e `05` |
| R1 | Design system em código | Ver `/sistema` local |
| R2 | Base da cena compartilhada | — |
| R3 | Protótipos A e B | **Escolher a cena** (feito: A) |
| R4 | Seções no DOM | Rever localmente |
| P | Preparação para produção | Rever localmente e recriar o repositório |
| R5 | Cena completa e storyboard | — |
| R6 | Recursos | — |
| R7 | Textos e compartilhamento | Aprovar os textos marcados "(a aprovar)" em `02` |
| R8 | Refinamento | Teste em aparelho real |

### R0 a R3 (concluídas)

- **R0:** [04](04-direcao-criativa.md) e [05](05-design-system.md) reescritos e aprovados; [06](06-motion-e-webgl.md) e [07](07-recursos-interativos.md) com cena, storyboard e recursos novos.
- **R1:** três temas gerados de uma fonte, Mona Sans e JetBrains Mono, tokens, moldura com dados reais, dados derivados com testes e `/sistema`.
- **R2:** atlas e shader novos, travamento por máscara, registro da sessão e limites de luminância por tema.
- **R3:** as duas cenas foram prototipadas, e o titular escolheu "Tudo é código" em 07/11/2026. A cena B, o Blender e o seletor de avaliação foram removidos ([decisão 81](decisoes.md)).

### R4: Seções no DOM

1. Seções com as formas de [04](04-direcao-criativa.md#tom-visual-por-seção): ficha com hexdump, traceroute, régua de horas, degraus de competências, tabela de certificados e contato.
2. `Barra`, Índice, `/cv`, `/seguranca`, 404 e offline com o design novo.
3. Capturas em 390, 768 e 1440 px.

**Pronto quando:** o site inteiro funciona sem WebGL e sem JavaScript, e as capturas passam na revisão do titular.

### P: Preparação para produção (07/11/2026)

Pedido do titular depois de rever a R4. Detalhe nas decisões 96 a 105.

1. Barra só com a navegação e três ações: chuva, terminal e tema. Saem o som e o botão Currículo (a página `/cv` fica).
2. Moldura sem a faixa de cima. A Régua sai; a barra de rolagem nativa fica fina e neutra.
3. O nome volta ao topo na página inicial. Amostras de tema mostram o fundo do próprio tema. Fósforo visível, mas bloqueado até o CTF terminar.
4. Trilhas de placa com grade de ocupação: sem cruzamento nem sobreposição, traço fino. Teste de geometria.
5. Chuva a 40% da velocidade original. Véu do hero sem a faixa escura na passagem para Sobre.
6. Cidade do titular fora do site e do JSON-LD.
7. Desempenho: JavaScript inicial menor, dados da moldura carregados depois, service worker com pré-cache só da primeira tela, cache HTTP de ícones e imagem de compartilhamento.
8. SEO: canônico em todas as páginas, cartões de compartilhamento próprios, imagem OG, ícones, JSON-LD de pessoa e site.
9. Repositório: sem arquivos órfãos, dependências mortas nem menções ao processo de desenvolvimento; documentação atualizada.

**Pronto quando:** testes passando, capturas revistas, e o titular recria o repositório e tira o `noindex` do vhost.

### R5: Cena completa e storyboard

1. Forma de cada seção na cena escolhida.
2. Cada linha do [storyboard](06-motion-e-webgl.md#storyboard-da-rolagem), uma seção por vez.
3. Decodificação de títulos, largura do nome, microinterações e transições de rota.
4. Movimento reduzido validado em cada passo.

**Pronto quando:** todas as linhas do storyboard funcionam nos níveis de qualidade, dentro dos orçamentos.

### R6: Recursos

1. Terminal com os comandos novos e o prompt novo.
2. CTF: `selos` → `flags` (`src/ctf/flags.ts`, `gerar-flags.ts`, cabeçalho `X-Flag`).
3. Registro da sessão completo e boot log. Easter eggs.

**Pronto quando:** todos os recursos de [07](07-recursos-interativos.md) funcionam, com teclado, leitor de tela e movimento reduzido.

### R7: Textos e compartilhamento

1. Revisar os textos marcados "(a aprovar)" em [02](02-conteudo.md) e obter a aprovação do titular.
2. `verificar-conteudo`: barrar termos do conceito antigo no texto público.

### R8: Refinamento

1. Auditoria de interface, de acessibilidade, de boas práticas de React e de animação, e teste com dados extremos.
2. JS inicial em até 130 KB.
3. Lista manual de acessibilidade e [teste sem palavras](11-qualidade.md#teste-sem-palavras).
4. Rubrica de qualidade.

**Pronto quando:** os [critérios de pronto](11-qualidade.md#critérios-de-pronto-para-lançar) passam, exceto os que dependem das fases 9 a 12.

## Fases originais

As fases 1 a 6 da primeira versão estão concluídas ou foram substituídas pelo redesign. Delas ficaram o conteúdo validado por Zod, o verificador de conteúdo, os certificados gerados do catálogo, `/cv`, `/seguranca`, 404 e offline, o relógio único, os níveis de qualidade, a CSP por hash, o deploy em contêiner e os testes. As fases a seguir continuam valendo.

## Fase 7: Conteúdo e SEO

1. Revisar os textos na página real e obter aprovação do titular para [02](02-conteudo.md) e as regras de `/seguranca`.
2. Gerar o PDF e conferir: uma coluna, sem telefone, sem projetos, texto extraível.
3. Testar todos os links de certificado e conferir as páginas de validação.
4. Auditoria de SEO sobre o build. Metadados, JSON-LD, sitemap, OG e `humans.txt` já foram feitos na fase P.

**Pronto quando:** textos aprovados, links conferidos e auditoria sem pendência crítica.

## Fase 8: Refinamento

1. Auditoria e polimento da interface.
2. Diretrizes de interface web, com as regras atuais.
3. Revisão de boas práticas de React.
4. Revisão de segurança, Gitleaks, Trivy, `pnpm audit`, zizmor.
5. Lista de acessibilidade manual ([11](11-qualidade.md#acessibilidade)).
6. Testes nos navegadores e aparelhos.
7. Teste de 10 segundos com 5 pessoas.
8. Avaliação pela rubrica e correções.

**Pronto quando:** [critérios de pronto](11-qualidade.md#critérios-de-pronto-para-lançar) passam.

## Fase 9: Idiomas

1. Traduzir `src/conteudo/` para inglês, espanhol, alemão e francês.
2. Gerar rotas, `hreflang`, sitemap, imagens de compartilhamento e PDF por idioma.
3. Testar fontes com os caracteres de cada idioma, como `ß`, `ñ` e `œ`.
4. Passar o verificador de conteúdo em todos os idiomas.

**Pronto quando:** todas as rotas funcionam em cada idioma, sem texto em pt-BR esquecido.

## Fase 10: Blindagem

1. Cabeçalhos e CSP finais, revisados rota por rota, em modo de bloqueio.
2. Armadilhas e easter eggs para quem tenta explorar ([07](07-recursos-interativos.md#armadilhas-para-quem-tenta-explorar)).
3. Revisão de cadeia de suprimentos: Gitleaks, Trivy, `pnpm audit`, zizmor.
4. Revisão de segurança e testes dirigidos em ambiente local.
5. Lista de ajustes do VPS para o titular, como `server_tokens off`.
6. Sessão explicando ao titular cada controle, para ele saber responder em entrevista.

**Pronto quando:** nota A+ no Observatory em teste local possível, sem violações de CSP e com o titular entendendo cada controle.

## Fase 11: Lançamento

**O titular faz** ([passo a passo](10-deploy-e-operacao.md#primeiro-deploy))

1. Revisar o site rodando localmente.
2. Recriar o repositório com histórico limpo e deixá-lo privado ([10](10-deploy-e-operacao.md#repositório-limpo)).
3. Deploy com `deploy/atualizar.sh`.
4. Remover o `X-Robots-Tag: noindex` do vhost.
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
| WebGPU | Reavaliar por trimestre |
| Revisar `security.txt` | A cada 6 meses |
| Revisar conteúdo | A cada trimestre, com o `plano_desenvolvimento.md` |
| Atualizar dependências | Mensalmente, com o atraso mínimo de versões |
| Registrar na base do currículo | O que o titular aprendeu e sabe explicar deste projeto |
