# 08 — Arquitetura técnica

Como o site é construído. Versões consultadas no npm em 05/11/2026. Na instalação, use a versão atual compatível e registre o que mudar em [decisoes.md](decisoes.md).

## Visão geral

```text
  Conteúdo                Design                 Experiência
  ┌───────────────┐      ┌──────────────┐       ┌───────────────┐
  │ src/conteudo  │      │ Tokens CSS   │       │ GSAP, Lenis   │
  │ pt-BR, en...  │      │ Tailwind v4  │       │ Motion        │
  │  ↓ Zod        │      │ Base UI      │       │ R3F, Three    │
  │               │      └──────┬───────┘       └───────┬───────┘
  └──────┬────────┘             │                       │
         └──────────────┬───────┴───────────────────────┘
                        ▼
              Next.js 16 · output: "export"
                        ▼
      Pós-build: CSP, SBOM, compressão, verificação
                        ▼
      Contêiner nginx sem privilégios → nginx do host
```

**Propriedade central:** tudo é gerado antes do deploy. Em execução, o servidor só entrega arquivos.

## Stack

| Categoria | Pacote | Versão consultada | Observação |
|---|---|---|---|
| Framework | `next` | 16.4.5 | `output: "export"`, App Router |
| Interface | `react`, `react-dom` | 19.3.1 | R3F exige `<19.4` |
| Linguagem | `typescript` | 5 | `strict`. A versão 7 ainda não é suportada pelo `typescript-eslint` |
| CSS | `tailwindcss` | 4.3.4 | Tokens com `@theme` |
| Componentes | `@base-ui/react` | 1.9.0 | Menus e Índice, sem visual padrão |
| Validação | `zod` | 4.6.7 | Todo conteúdo |
| Timelines | `gsap`, `@gsap/react` | 3.15.1, 2.1.2 | Licença padrão "no charge", uso comercial permitido enquanto o usuário final não pagar pelo acesso. Plugins inclusos no pacote |
| Microinterações | `motion` | 14.9.1 | Só componentes de interface |
| Rolagem | `lenis` | 1.3.27 | Ligado ao ticker do GSAP |
| 3D | `three` | 0.187.0 | Com `@types/three` |
| React 3D | `@react-three/fiber` | 9.8.2 | `frameloop="never"` |
| Pós-processamento | `@react-three/postprocessing`, `postprocessing` | 3.2.2, 6.39.6 | Só WebGL |
| Ícones | `lucide-react` + SVGs próprios | 1.68.0 | Lucide só nos menus, que carregam depois. Barra e contato usam `src/componentes/Icones.tsx` |
| Fontes | `@fontsource-variable/mona-sans`, `@fontsource-variable/jetbrains-mono` | 5.3.0 | Só em desenvolvimento: `copiar-fontes.ts` gera o subconjunto WOFF2 auto-hospedado em `src/fontes/`. OFL 1.1. Martian Mono e Noto Sans JP ficam só no gerador do atlas da chuva |
| CMS (**para o final**) | `sanity`, `@sanity/client` | 6.22.0, 8.14.1 | Não instalado. Decisão do titular |
| Analytics (**para o final**) | `posthog-js` | 1.446.0 | Não instalado. Decisão do titular |
| Erros (**para o final**) | `@sentry/browser` | 11.10.0 | Não instalado. Decisão do titular |
| E2E | `@playwright/test`, `@axe-core/playwright` | 1.64.1, 4.14.0 | |
| Unidade | `vitest` | 5.1.0 | |
| Auditoria de web | `@lhci/cli` | 0.16.0 | No CI |
| Pacotes | `pnpm` via corepack | 12.16.1 | Node 24 no Docker |

## Estrutura de pastas

```text
portfolio/
├── README.md, ROADMAP.md
├── docs/
├── src/
│   ├── app/
│   │   ├── (pt)/            # pt-BR, sem prefixo. Cada idioma terá sua raiz
│   │   │   ├── layout.tsx, page.tsx
│   │   │   └── cv/, seguranca/, sistema/, offline/
│   │   ├── global-not-found.tsx
│   │   └── globais.css, secoes.css, fontes.ts
│   ├── site.ts              # Endereço público e metadados por página (canônico, OG, Twitter)
│   ├── conteudo/
│   │   ├── esquema.ts       # Zod
│   │   ├── derivados.ts     # Hexdump, fingerprints, tempo decorrido, calculados no build
│   │   ├── verificacao.ts   # Regras do verificador de conteúdo
│   │   ├── pt-BR.ts         # Fonte da verdade, idioma principal
│   │   ├── gerado/          # Certificados, gerados do catálogo
│   │   └── index.ts         # Leitura por idioma
│   ├── secoes/              # Inicio, Sobre, Agora, ..., Contato, Rodape
│   ├── componentes/         # Barra, menus, ícones, moldura/ (cantos e boot log), graficos/ (trilhas, hexdump)
│   ├── gl/
│   │   ├── Palco.tsx, CarregadorCena.tsx, Experiencia.tsx
│   │   ├── chuva/           # shader, máscara de travamento, dados do atlas
│   │   ├── forma/           # Formas 3D lidas como máscara pela chuva
│   │   ├── trilha.ts        # Rolagem lida a cada quadro
│   │   └── qualidade.ts     # Níveis e controlador
│   ├── movimento/           # Relógio, rolagem programática, storyboard, estado, registro da sessão, easter eggs
│   ├── terminal/, ctf/
│   ├── fontes/              # WOFF2 auto-hospedados
│   └── temas/               # Os três temas e o CSS gerado
├── public/
│   ├── gl/atlas.png         # Atlas de glifos da chuva
│   ├── og/                  # Imagem de compartilhamento
│   ├── icone.svg, icone-192.png, icone-512.png, apple-touch-icon.png
│   └── tema.js              # Aplica o tema antes da pintura
├── scripts/
│   ├── verificar-conteudo.ts, verificar-contraste.ts
│   ├── gerar-temas.ts, gerar-atlas.ts, gerar-certificados.py, copiar-fontes.ts, gerar-selos.ts
│   ├── gerar-trilhas.ts, trilhas/placa.ts   # Placas de circuito com grade de ocupação
│   ├── gerar-og.ts          # Imagem de compartilhamento e ícones
│   ├── servir.ts, capturas.ts, cena-fotos.ts   # Servidor que imita o nginx; capturas para revisão
│   ├── sw-modelo.js
│   └── pos-build.ts         # CSP, security.txt, robots, sitemap, manifesto, humans, SBOM, gzip
├── deploy/
│   ├── Dockerfile, docker-compose.prod.yml
│   ├── nginx-container.conf, cabecalhos.conf, nginx-host.conf
│   └── atualizar.sh
├── tests/                   # unidade/ (Vitest) e e2e/ (Playwright)
└── next.config.ts
```

## Configuração do Next.js

```ts
const config: NextConfig = {
  output: "export",
  trailingSlash: false,
  poweredByHeader: false,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  experimental: { globalNotFound: true },
};
```

**Limites do modo estático, aceitos de propósito**

| O que não existe | Solução |
|---|---|
| Otimização de imagem em execução | AVIF e WebP pré-gerados, com `<picture>` |
| Middleware, cabeçalhos do Next | Cabeçalhos no nginx do contêiner |
| Rotas de API | Proxies do nginx para PostHog e Sentry |
| Nonce em CSP | Hashes por rota ([09](09-seguranca-e-privacidade.md#política-de-conteúdo)) |
| ISR | Novo build a cada mudança |

**Confirmado em 05/11/2026:** hashes por rota funcionam com `output: "export"`, sem violações, inclusive com WebGL. `experimental.sri` não foi necessário.

**A testar na Fase 6:** `viewTransition` com `output: "export"`.

**404:** usa `app/global-not-found.tsx`, porque as rotas ficam no grupo `(pt)`, preparado para ter uma raiz por idioma.

## Modelo de conteúdo

`src/conteudo/esquema.ts` é a fonte das regras. Todo idioma obedece a ele.

```ts
const Evidencia = z.enum(["trabalho", "projetos", "formacao", "estudo"]);
const Area = z.enum(["redes", "linux", "devops", "seguranca", "programacao"]);

const Experiencia = z.object({
  empresa: z.string(), cargo: z.string(),
  inicio: z.string().regex(/^\d{4}-\d{2}$/),
  fim: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
  ti: z.boolean(), descricao: z.string(),
  atividades: z.array(z.string()).default([]),
});

const Competencia = z.object({ nome: z.string(), evidencia: Evidencia, area: Area, nota: z.string().optional() });

const Certificado = z.object({
  nome: z.string(), emissor: z.string(),
  conclusao: z.string(), carga: z.string().nullable(),
  validacaoUrl: z.url().nullable(), codigo: z.string().nullable(),
  area: Area.or(z.literal("outros")), prioridade: z.enum(["A", "B", "C"]),
});

const Projeto = z.object({
  slug: z.string(), nome: z.string(), resumo: z.string(), contexto: z.string(),
  situacao: z.enum(["producao", "demonstracao", "desenvolvimento", "academico"]),
  demoUrl: z.url().nullable(), stack: z.array(z.string()),
  destaques: z.array(z.string()), capa: z.string().nullable(),
  publicado: z.boolean(),
});

const Site = z.object({
  secoes: z.array(z.enum(["inicio","sobre","agora","trajetoria","formacao","competencias","certificados","obras","contato"])),
  obrasAtivas: z.boolean().default(false),
  experiencias: z.array(Experiencia), competencias: z.array(Competencia),
  certificados: z.array(Certificado), projetos: z.array(Projeto).default([]),
  // Textos de cada seção, formação, contatos públicos, SEO
});
```

**Regras:** número de seção é derivado da ordem após filtrar as inativas. `Obras` só aparece com `obrasAtivas: true` e ao menos um projeto publicado. Datas ficam em ISO e são formatadas com `Intl.DateTimeFormat`.

O conteúdo em `src/conteudo/pt-BR.ts` é escrito a partir de [02-conteudo.md](02-conteudo.md). `certificados` é gerado de `catalogo.md` por `scripts/gerar-certificados.py`, e o resultado é versionado. Outros idiomas traduzem textos e mantêm os mesmos dados.

**Ativação futura do Sanity:** um script baixa o conteúdo, valida e escreve os mesmos arquivos. O site nunca chama o Sanity em execução.

## Sanity (para o final)

**Não instalado.** Um CMS é um painel para editar textos sem mexer em código. Anotado aqui, caso o titular queira. Se for usado, será só para edição. **O site nunca faz chamada ao Sanity em execução.**

```text
Editar no Studio → script de download → Zod + verificação → src/conteudo/ → commit → deploy
```

- **Studio:** pacote separado em `sanity/`, publicado no endereço `*.sanity.studio`. As dependências dele não entram no bundle.
- **Esquemas:** espelham os esquemas Zod.
- **Dataset:** o conteúdo é público de qualquer forma; token de leitura não é necessário.
- **Sem conta:** o titular edita `src/conteudo/` à mão, e nada mais muda.
- **Falha:** com Sanity fora do ar, o site continua, e os builds usam os arquivos do repositório.

## Build

`pnpm build` executa em ordem:

| Passo | Script | Resultado |
|---|---|---|
| 1 | `verificar-contraste` | Falha se algum token ficar abaixo de AA |
| 2 | `verificar-conteudo` (entrada) | Valida o conteúdo e termos proibidos |
| 4 | `next build` | Pasta `out/` |
| 6 | `pos-build` | CSP por rota, SBOM, gzip estático |
| 7 | `verificar-conteudo` (saída) | Examina HTML, JS, JSON e PDF gerados |

**Gerados à parte e versionados no Git:** atlas (`pnpm atlas`), trilhas (`pnpm trilhas`), certificados (`pnpm certificados`), imagem de compartilhamento e ícones (`pnpm og`) e PDF. Alguns dependem de Playwright, então rodam na máquina de desenvolvimento, e o build do servidor não os recria.

## Verificação de conteúdo

`scripts/verificar-conteudo.ts` falha o build quando encontra:

- Conteúdo fora do esquema.
- Termo proibido ([lista](01-veracidade-e-fontes.md#palavras-que-não-podem-aparecer-como-afirmação)), fora das frases permitidas.
- Padrão de CPF (`\d{3}\.\d{3}\.\d{3}-\d{2}`) e de RG.
- O telefone em qualquer formato, com e sem DDD, pontuação ou prefixo 55. O verificador lê o número de `WHATSAPP_NUMERO`, para o próprio script não o expor.
- Nomes de projetos, com `obrasAtivas: false`.
- PDF em `public/` que não seja o currículo.
- A cidade do titular e menções às ferramentas usadas para escrever o código, que ficam fora do site.
- O IP do servidor, quando `IP_SERVIDOR` está no `.env.local`. O IP nunca fica no código.
- Datas ou credenciais que divirjam de `../curriculo`, quando essa pasta existe na máquina.

Tem testes próprios, com casos que precisam falhar.

## Desempenho

- **HTML estático primeiro:** Server Components em tudo que puder ser estático. Componentes de cliente são ilhas: barra, filtros, contato, terminal e Canvas.
- **Chunks por recurso:** `next/dynamic` com `ssr: false` para cena, movimento (GSAP, ScrollTrigger e Lenis), dados da moldura, menus (Base UI, Motion e Lucide) e terminal. Cena, movimento e moldura só entram com o navegador ocioso.
- **Nada pesado no módulo inicial:** a barra rola para o topo por `src/movimento/rolagem.ts`, que não importa Lenis nem GSAP; o Lenis se registra ali quando o relógio liga.
- **Ícones próprios** na barra e no contato. Lucide fica nos menus, carregados depois.
- **Fontes:** subconjunto WOFF2; só a Mona Sans tem `preload`.
- **Estado de rolagem:** refs, para evitar re-render por quadro.

### Desempenho de carregamento

Medido em `out/index.html`, somando o gzip dos scripts que um navegador moderno baixa (os `noModule`, de polyfill, ficam de fora):

| Data | JS inicial | O que mudou |
|---|---|---|
| 07/11/2026, antes | 193 KB | GSAP, ScrollTrigger e Lenis entravam pela moldura e pela régua |
| 07/11/2026, depois | 142 KB | Régua removida, dados da moldura adiados, rolagem sem Lenis no módulo inicial, ícones próprios |

Meta da R8: 130 KB. O que resta é quase todo React, React DOM e o runtime do Next.

**Cache:** ver [10](10-deploy-e-operacao.md#nginx-do-contêiner). Arquivos com hash ficam um ano; HTML revalida a cada visita.

## Service worker e PWA

Service worker próprio, gerado no pós-build a partir de `scripts/sw-modelo.js`, com a versão do build, sem dependência extra. É registrado depois do `load`, com o navegador ocioso. O **pré-cache leva só a primeira tela**: as páginas `/`, `/cv` e `/offline`, `tema.js` e os scripts, CSS e fontes que o HTML delas referencia. Three.js, a cena e o resto entram no cache quando a visita os pede. Antes, a instalação baixava todo o `_next/static` (3,3 MB) logo na primeira visita.

| Recurso | Estratégia |
|---|---|
| `/_next/static/*`, `/gl/*`, fontes | Cache-first, guardados quando pedidos |
| HTML | Network-first, com fallback para `/offline` |
| `/cv` | Pré-carregado, disponível sem rede |
| Proxies de analytics e erros | Nunca em cache |

**Trava de segurança:** um `sw.js` novo, sem cache, é sempre possível de publicar, com `skipWaiting`, para desfazer um service worker defeituoso. O próprio `sw.js` é servido com `no-cache`.

`manifest.webmanifest`, gerado no pós-build, com nome, cor do tema Rubro e os ícones de `public/` (SVG, 192 e 512 px). Os ícones e a imagem de compartilhamento saem de `pnpm og`.

O cache se chama `sinal-<versão>`. Na ativação, o service worker apaga as versões anteriores, inclusive as da primeira versão do site (`nave-`).

## Analytics e erros (para o final)

**Não instalados.** PostHog mede o uso do site, e Sentry avisa quando o site quebra no navegador de um visitante. Anotados aqui, caso o titular queira. Se forem usados, só carregam quando a variável correspondente existir no build.

| Variável | Efeito |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | Liga PostHog pelo caminho `/_v/` |
| `NEXT_PUBLIC_SENTRY_DSN` | Liga Sentry com `tunnel: "/_e"` |
| `SITE_URL` | Canonical, sitemap e OG. Definida no build; sem ela, vale `https://warley.ferzion.com.br` |
| `IP_SERVIDOR` | Opcional, só no `.env.local`: o verificador confere que o IP não aparece na saída |
| `WHATSAPP_NUMERO` | Número da revelação ao clicar. Fica só no `.env`. Sem ela, o botão não aparece |

**PostHog:** `persistence: "memory"`, `disable_session_recording: true`, `autocapture: false`, IP descartado no projeto. A opção `cookieless_mode` deve ser conferida na documentação da versão instalada. **Eventos:** `cv_aberto`, `pdf_baixado`, `contato_clicado`, `whatsapp_revelado`, `tema_trocado`, `flag_encontrada`.

**Sentry:** `sendDefaultPii: false`, `tracesSampleRate: 0`, `replaysSessionSampleRate: 0`. Carregado depois de ocioso, sem entrar no bundle inicial.

## Internacionalização

pt-BR é o idioma principal e vive nas rotas sem prefixo. Todo texto vive em `src/conteudo/`, nunca fixo em componente, para os demais idiomas entrarem sem refatoração: `/en`, `/es`, `/de`, `/fr`, com `hreflang` e `lang` corretos.

**Tradução:** feita sobre os mesmos dados e passando pelo mesmo verificador. Nomes de cargos e cursos mantêm o original onde a tradução mudaria o sentido.

## Testes

Plano completo em [11-qualidade.md](11-qualidade.md#testes).
