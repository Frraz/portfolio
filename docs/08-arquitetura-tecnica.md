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
| Componentes | `@base-ui/react`, `shadcn` | 1.9.0, 4.23.0 | Sem visual padrão |
| Validação | `zod` | 4.6.7 | Todo conteúdo |
| Timelines | `gsap`, `@gsap/react` | 3.15.1, 2.1.2 | Licença padrão "no charge", uso comercial permitido enquanto o usuário final não pagar pelo acesso. Plugins inclusos no pacote |
| Microinterações | `motion` | 14.9.1 | Só componentes de interface |
| Rolagem | `lenis` | 1.3.27 | Ligado ao ticker do GSAP |
| 3D | `three` | 0.187.0 | Com `@types/three` |
| React 3D | `@react-three/fiber` | 9.8.2 | `frameloop="never"` |
| Utilitários | `@react-three/drei` | 10.7.9 | Importações pontuais |
| Pós-processamento | `@react-three/postprocessing`, `postprocessing` | 3.2.2, 6.39.6 | Só WebGL |
| Assets 3D | Blender, `@gltf-transform/cli`, `gltfjsx` | 4.5.1, 6.5.3 | Só em desenvolvimento |
| Vetores animados | `lottie-web` (build `lottie_light`) | 5.13.0 | MIT. Sem `eval` nem WASM. JSON gerado por script |
| Ícones | `lucide-react` + SVGs próprios | 1.68.0 | Importações pontuais |
| CMS (**para o final**) | `sanity`, `@sanity/client` | 6.22.0, 8.14.1 | Não instalado. Decisão do titular |
| Analytics (**para o final**) | `posthog-js` | 1.446.0 | Não instalado. Decisão do titular |
| Erros (**para o final**) | `@sentry/browser` | 11.10.0 | Não instalado. Decisão do titular |
| Catálogo | `storybook`, `@storybook/nextjs-vite` | 10.6.5 | Só em desenvolvimento |
| E2E | `@playwright/test`, `@axe-core/playwright` | 1.64.1, 4.14.0 | |
| Unidade | `vitest` | 5.1.0 | |
| Auditoria de web | `@lhci/cli` | 0.16.0 | No CI |
| Pacotes | `pnpm` via corepack | 12.16.1 | Node 24 no Docker |

## Estrutura de pastas

```text
portfolio/
├── README.md, CLAUDE.md, skills-lock.json
├── docs/
├── .claude/skills/          # As 10 skills e complementos
├── src/
│   ├── app/
│   │   ├── (pt)/            # pt-BR, sem prefixo. Cada idioma terá sua raiz
│   │   │   ├── layout.tsx, page.tsx
│   │   │   ├── cv/, seguranca/, sistema/, offline/
│   │   ├── global-not-found.tsx
│   │   ├── globais.css, fontes.ts
│   ├── conteudo/
│   │   ├── esquema.ts       # Zod
│   │   ├── pt-BR.ts         # Fonte da verdade, idioma principal
│   │   ├── en.ts, es.ts, de.ts, fr.ts
│   │   ├── gerado/          # Certificados, gerados do catálogo
│   │   └── index.ts         # Leitura por idioma
│   ├── secoes/              # Inicio, Sobre, Agora, ..., Contato, Obras
│   ├── componentes/         # ui/ (Base UI), ornamentos/
│   ├── gl/
│   │   ├── Palco.tsx, CarregadorCena.tsx, Experiencia.tsx
│   │   ├── chuva/           # Shader da chuva e da rosácea
│   │   ├── nave/            # Nave, lancetas, relicário, atmosfera, caminho da câmera
│   │   ├── trilha.ts        # Rolagem lida a cada quadro
│   │   └── qualidade.ts     # Níveis e controlador
│   ├── movimento/           # Relógio, storyboard, estado compartilhado, easter eggs
│   ├── terminal/, ctf/, som/
│   └── temas/               # Tokens e os temas
├── public/
│   ├── gl/                  # Atlas, modelos e gl/selos/ (Lottie)
│   ├── fontes/, og/
│   ├── curriculo-warley-ferraz-almeida.pdf
│   └── .well-known/security.txt
├── scripts/
│   ├── verificar-conteudo.ts, verificar-contraste.ts
│   ├── gerar-temas.ts, gerar-atlas.ts, gerar-certificados.py, copiar-fontes.ts
│   ├── servir.ts, capturas.ts   # Servidor que imita o nginx; capturas para revisão
│   ├── gerar-selos.ts, gerar-lottie.ts, sw-modelo.js, cena-fotos.ts
│   ├── gerar-og.ts, gerar-pdf.ts  # Fase 7
│   ├── pos-build.ts         # CSP, security.txt, robots, sitemap, SBOM, gzip
│   └── blender/             # comum.py, nave.py, lancetas.py, relicario.py, construir.sh
├── deploy/
│   ├── Dockerfile, docker-compose.prod.yml
│   ├── nginx-container.conf, nginx-host.conf
│   └── atualizar.sh
├── .storybook/, tests/
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
- **Sem conta:** o titular edita `src/conteudo/` à mão ou por uma sessão de agente, e nada mais muda.
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

**Gerados à parte e versionados no Git:** atlas, certificados, GLB, imagens OG e PDF. Dependem de Blender e Playwright, então rodam em `pnpm assets` na máquina de desenvolvimento, e o build do servidor não os recria. O CI confere a data do conteúdo para avisar se ficaram defasados.

## Verificação de conteúdo

`scripts/verificar-conteudo.ts` falha o build quando encontra:

- Conteúdo fora do esquema.
- Termo proibido ([lista](01-veracidade-e-fontes.md#palavras-que-não-podem-aparecer-como-afirmação)), fora das frases permitidas.
- Padrão de CPF (`\d{3}\.\d{3}\.\d{3}-\d{2}`) e de RG.
- O telefone em qualquer formato, com e sem DDD, pontuação ou prefixo 55. O verificador lê o número de `WHATSAPP_NUMERO`, para o próprio script não o expor.
- Nomes de projetos, com `obrasAtivas: false`.
- PDF em `public/` que não seja o currículo.
- Datas ou credenciais que divirjam de `../curriculo`, quando essa pasta existe na máquina.

Tem testes próprios, com casos que precisam falhar.

## Desempenho

Plano da skill React Best Practices aplicado a este projeto.

- **HTML estático primeiro:** Server Components em tudo que puder ser estático. Componentes de cliente são ilhas: navegação, filtros, terminal, trocador e Canvas.
- **Chunks por rota e recurso:** `next/dynamic` com `ssr: false` para cena, terminal, CTF, som, Divisor e Lottie.
- **Sem barrel files:** importações diretas de Lucide, Drei e GSAP. `optimizePackageImports` onde couber.
- **Pré-carga por intenção:** o terminal baixa ao passar o mouse ou focar o botão.
- **Fontes:** subconjunto e `preload` só das duas essenciais.
- **Imagens:** dimensões explícitas, `loading="lazy"` abaixo da dobra.
- **Listas longas:** certificados são poucos, então não há virtualização. `content-visibility: auto` nas seções.
- **Estado de rolagem:** refs, para evitar re-render por quadro.

## Service worker e PWA

Service worker próprio, gerado no pós-build a partir de `scripts/sw-modelo.js`, com a lista de arquivos com hash e a versão do build, sem dependência extra. O manifesto e `icone.svg` saem do mesmo passo.

| Recurso | Estratégia |
|---|---|
| `/_next/static/*`, `/gl/*`, fontes | Cache-first |
| HTML | Network-first, com fallback para `/offline` |
| `/cv` | Pré-carregado, disponível sem rede |
| Proxies de analytics e erros | Nunca em cache |

**Trava de segurança:** um `sw.js` novo, sem cache, é sempre possível de publicar, com `skipWaiting`, para desfazer um service worker defeituoso. O próprio `sw.js` é servido com `no-cache`.

`manifest.webmanifest` com nome, cores do tema e ícones gerados.

## Analytics e erros (para o final)

**Não instalados.** PostHog mede o uso do site, e Sentry avisa quando o site quebra no navegador de um visitante. Anotados aqui, caso o titular queira. Se forem usados, só carregam quando a variável correspondente existir no build.

| Variável | Efeito |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | Liga PostHog pelo caminho `/_v/` |
| `NEXT_PUBLIC_SENTRY_DSN` | Liga Sentry com `tunnel: "/_e"` |
| `SITE_URL` | Canonical, sitemap e OG. Definida no build |
| `WHATSAPP_NUMERO` | Número da revelação ao clicar. Fica só no `.env`. Sem ela, o botão não aparece |

**PostHog:** `persistence: "memory"`, `disable_session_recording: true`, `autocapture: false`, IP descartado no projeto. A opção `cookieless_mode` deve ser conferida na documentação da versão instalada. **Eventos:** `cv_aberto`, `pdf_baixado`, `contato_clicado`, `whatsapp_revelado`, `tema_trocado`, `selo_encontrado`, `divisor_concluido`.

**Sentry:** `sendDefaultPii: false`, `tracesSampleRate: 0`, `replaysSessionSampleRate: 0`. Carregado depois de ocioso, sem entrar no bundle inicial.

## Storybook

Só em desenvolvimento e fora do `out/`. Cobre componentes de `componentes/ui`, ornamentos e seções em versão estática. É usado para regressão visual em Playwright. O `/sistema` público usa os tokens reais do site, e a dependência não vai para produção.

## Internacionalização

pt-BR é o idioma principal e vive nas rotas sem prefixo. Todo texto vive em `src/conteudo/`, nunca fixo em componente, para os demais idiomas entrarem sem refatoração: `/en`, `/es`, `/de`, `/fr`, com `hreflang` e `lang` corretos.

**Tradução:** feita sobre os mesmos dados e passando pelo mesmo verificador. Nomes de cargos e cursos mantêm o original onde a tradução mudaria o sentido.

## Testes

Plano completo em [11-qualidade.md](11-qualidade.md#testes).
