# Instruções para agentes

Portfólio de Warley Ferraz Almeida. Escreva em português do Brasil. Comece pelo [README](README.md) e pelo [ROADMAP](ROADMAP.md), que diz onde estamos. **Atualize o ROADMAP e a documentação no mesmo passo em que mudar o código.**

## Regra principal: veracidade

O visual não tem limites. O texto tem.

- Só publique fatos de `../curriculo` e com o peso de evidência dado lá. Regras em [docs/01-veracidade-e-fontes.md](docs/01-veracidade-e-fontes.md).
- Segurança e DevOps são formação e projetos, sem cargo. Nunca sugira experiência profissional em SOC, pentest ou red team.
- Sem níveis de habilidade, métricas, clientes, depoimentos ou dados inventados, inclusive em terminal, CTF e efeitos visuais.
- Efeito visual nunca vira competência do titular.
- `../curriculo` é somente leitura. Fato novo entra lá primeiro, pelo titular.

## Privacidade

- Nunca copie nada de `../curriculo/certificados/` para o site: os PDFs têm CPF e RG.
- O telefone fica fora de HTML, JSON-LD, PDF, sitemap e terminal. Só no chunk de revelação ao clicar ([07](docs/07-recursos-interativos.md#revelação-do-whatsapp)).
- Não publique IP, porta nem outros sistemas do VPS.
- Nomes de projetos ficam de fora até `obrasAtivas: true` ([13](docs/13-projetos-futuros.md)). O Byakugan não é citado nem sem nome.
- O titular prefere não focar em linguagem religiosa: a religiosidade fica no visual. Texto novo usa linguagem neutra.

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
- Regras do sagrado em [docs/04](docs/04-direcao-criativa.md#regras-do-sagrado): a cruz só nos dois lugares definidos, sem figuras sagradas, sem símbolos invertidos, nada de logos ou personagens de terceiros.
- Sem etiqueta acima de título, cards iguais, gradiente em texto, seta em botão, monoespaçada decorativa.
- Quando as skills discordarem, siga a ordem de [docs/14](docs/14-skills-e-stack.md#quando-as-skills-discordam).

## Como trabalhar

1. Leia os documentos da fase e carregue as skills indicadas em [docs/12](docs/12-roteiro.md). Marque o progresso no [ROADMAP](ROADMAP.md).
2. Se mudar uma decisão, atualize o documento e `docs/decisoes.md`.
3. Antes de dizer que terminou: `pnpm verificar && pnpm build && pnpm test && pnpm test:e2e`.
4. Em mudança visual, veja capturas em 390, 768 e 1440 px, sem confiar só em métricas.
5. Relate o que foi testado e o que não foi. Item em `/seguranca` só depois de testado em produção.
6. Versões de pacotes e APIs mudam: confira a documentação atual antes de usar. Versões de 05/11/2026 estão em [docs/08](docs/08-arquitetura-tecnica.md#stack).
