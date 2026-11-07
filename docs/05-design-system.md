# 05 — Design system

Tokens, tipografia, moldura e componentes do conceito Sinal. Fonte única para `src/temas/` e para `/sistema`. Hierarquia de tokens: primitivo → semântico → componente, como na skill `ui-ux-pro-max:design-system`.

**Situação:** especificação do redesign de 06/11/2026, a aprovar pelo titular antes do código (Fase R0). Os valores abaixo já passam no cálculo de contraste. `scripts/verificar-contraste.ts` confirma no build.

## Os três temas

Valores em hexadecimal, com OKLCH calculado. O CSS usa OKLCH, e o shader recebe os mesmos valores em RGB linear, gerados por `scripts/gerar-temas.ts`.

### Papéis

| Papel | Uso | Regra |
|---|---|---|
| `fundo` | Página | Nunca preto puro, para a cabeça da chuva ter de onde se destacar |
| `superficie` | Blocos de conteúdo, terminal, painéis | Um degrau acima do fundo |
| `superficie-2` | Linha ativa, hover de lista, faixa do HUD | Dois degraus |
| `tinta` | Texto principal | |
| `tinta-2` | Texto secundário, dados do HUD | Nunca abaixo disso para texto |
| `sinal` | Interface: foco, links, ação principal, seleção, item ativo | Texto em tamanho normal permitido |
| `forma` | Linhas e formas gráficas: réguas, fibra, régua de formação, trilhas | Só gráfico ou texto grande |
| `forma-fundo` | Preenchimento de formas | Só preenchimento |
| `tinta-dado` | Datas, horas, cargas e outros dados reais soltos no texto | Tom da rampa do tema, com luminância igual ou maior que `tinta-2` no tema escuro (menor no claro), para valer o mesmo teto de luz da chuva ([decisão 89](decisoes.md)) |
| `alerta` | Estados de erro e aviso | Nunca decorativo. Âmbar, para não se confundir com o vermelho da identidade |
| `chuva` / `chuva-cabeca` | Cauda e cabeça das colunas da chuva | Só no shader |

### Rubro (padrão)

| Papel | Hex | OKLCH |
|---|---|---|
| `fundo` | `#050203` | `oklch(9.5% 0.012 354.3)` |
| `superficie` | `#110608` | `oklch(14.1% 0.022 6.4)` |
| `superficie-2` | `#1C0A0E` | `oklch(17.5% 0.032 6.8)` |
| `tinta` | `#F2E7E5` | `oklch(93.6% 0.012 29.9)` |
| `tinta-2` | `#B49896` | `oklch(70.4% 0.034 22.8)` |
| `sinal` | `#FF3646` | `oklch(65.3% 0.233 23.1)` |
| `forma` | `#C40F2C` | `oklch(52.2% 0.204 22.5)` |
| `forma-fundo` | `#5E0712` | `oklch(31.0% 0.117 22.3)` |
| `alerta` | `#FFB547` | `oklch(82.4% 0.149 73.3)` |
| `chuva` | `#E01E30` | `oklch(58.1% 0.222 24.3)` |
| `chuva-cabeca` | `#FFE2DC` | `oklch(93.5% 0.033 31.6)` |

### Claro

| Papel | Hex | OKLCH |
|---|---|---|
| `fundo` | `#F5F0EF` | `oklch(95.9% 0.006 31.1)` |
| `superficie` | `#FFFFFF` | `oklch(100% 0 0)` |
| `superficie-2` | `#EDE3E2` | `oklch(92.3% 0.011 24.3)` |
| `tinta` | `#14080A` | `oklch(15.4% 0.022 8.6)` |
| `tinta-2` | `#5A3F41` | `oklch(39.9% 0.038 14.0)` |
| `sinal` | `#A0001A` | `oklch(44.5% 0.180 24.2)` |
| `forma` | `#C40F2C` | `oklch(52.2% 0.204 22.5)` |
| `forma-fundo` | `#F2D4D6` | `oklch(89.5% 0.034 13.2)` |
| `alerta` | `#8A4B00` | `oklch(47.9% 0.112 59.9)` |
| `chuva` | `#14080A` a 8% | `oklch(15.4% 0.022 8.6 / 0.08)` |
| `chuva-cabeca` | `#A0001A` a 25% | `oklch(44.5% 0.180 24.2 / 0.25)` |

### Fósforo (escondido)

Liberado pelo comando `matrix` no terminal ou pelo CTF completo ([07](07-recursos-interativos.md#ctf-de-flags)).

| Papel | Hex | OKLCH |
|---|---|---|
| `fundo` | `#010401` | `oklch(9.6% 0.020 143.8)` |
| `superficie` | `#04100A` | `oklch(15.8% 0.023 163.1)` |
| `superficie-2` | `#082016` | `oklch(22.1% 0.036 163.5)` |
| `tinta` | `#D4F7DF` | `oklch(94.5% 0.048 155.4)` |
| `tinta-2` | `#86C99E` | `oklch(77.9% 0.092 155.5)` |
| `sinal` | `#3DFF7E` | `oklch(88.0% 0.228 149.3)` |
| `forma` | `#1FB85A` | `oklch(68.7% 0.180 150.1)` |
| `forma-fundo` | `#0B3A1E` | `oklch(30.9% 0.070 152.8)` |
| `alerta` | `#FFB547` | `oklch(82.4% 0.149 73.3)` |
| `chuva` | `#2BFF6E` | `oklch(87.5% 0.245 147.8)` |
| `chuva-cabeca` | `#E8FFF0` | `oklch(97.9% 0.031 157.2)` |

## Contraste calculado (WCAG 2.2)

Fórmula de luminância relativa, calculada em 06/11/2026. Mínimo: 4,5:1 para texto e 3:1 para gráfico. `forma` é só gráfico.

| Tema | tinta / fundo | tinta / sup-2 | tinta-2 / fundo | tinta-2 / sup-2 | sinal / fundo | sinal / sup-2 | alerta / fundo | alerta / sup-2 | forma / fundo |
|---|---|---|---|---|---|---|---|---|---|
| Rubro | 17,06 | 15,77 | 7,74 | 7,16 | 5,77 | 5,34 | 11,76 | 10,87 | 3,40 |
| Claro | 17,40 | 15,61 | 8,37 | 7,51 | 7,41 | 6,65 | 6,02 | 5,41 | 5,39 |
| Fósforo | 17,83 | 14,79 | 10,66 | 8,84 | 15,51 | 12,86 | 11,73 | 9,73 | 7,91 |

Todos passam. O pior caso é `sinal` sobre `superficie-2` no Rubro (5,34), ainda acima de 4,5.

## Tipografia

Duas famílias, como pede a skill `taste-skill`. Licença, eixos e subconjuntos conferidos na API do Fontsource em 06/11/2026. Ambas OFL 1.1, auto-hospedadas em WOFF2 com subconjunto.

| Papel | Fonte | Eixos | Subconjuntos | Uso |
|---|---|---|---|---|
| Display e leitura | **Mona Sans** | `wght` 200–900, `wdth` 75–125, itálico | latin, latin-ext | Nome, títulos, corpo, botões |
| Dados | **JetBrains Mono** | `wght` 100–800 | latin, latin-ext, cirílico | Hora, hash, código, comando, offset, terminal ([decisão 87](decisoes.md)) |
| Atlas da chuva | Martian Mono e Noto Sans JP | Pré-renderizadas | — | Só no atlas do shader. Nunca baixadas como webfont |

**Motivo da escolha:** o eixo de largura da Mona Sans é a assinatura tipográfica do site. O nome nasce condensado ao sair da chuva e se expande até a largura final. A mesma família, em largura normal, faz a leitura. Para os dados, a JetBrains Mono substituiu a Martian Mono em 07/11/2026: a Martian, larga e quadrada, somada à Mona Sans esticada, deixava o conjunto pesado demais ([decisões 87 e 88](decisoes.md)). Monaspace Neon foi considerada e descartada: no Fontsource é estática e só `latin` ([decisão 60](decisoes.md)).

**Regras**

- O H1 ocupa no máximo duas linhas em qualquer largura, testado em 360 px ("Warley Ferraz / Almeida").
- Títulos em `wdth` 100–112 e `wght` 600–740 (tokens `--larg-*` e `--peso-*`), com `tracking` entre −0,012 e −0,03 em, nunca abaixo de −0,04. Hierarquia também por cor: título em `tinta`, introdução e corpo secundário em `tinta-2`, dado em `tinta-dado`.
- Leitura em `wdth` 100 e `wght` 400, com 17 px ou mais no celular e 18 px ou mais no desktop. Medida de 62 a 72 caracteres. Entrelinha 1,55.
- Monoespaçada **só em dado real**, nunca em rótulo, título ou botão.
- Rótulos em caixa baixa e alta, nunca em caixa alta espaçada.
- Datas, horas, horas de curso e códigos com `font-variant-numeric: tabular-nums`. Zero com barra (`slashed-zero`), para distinguir de O.
- Títulos com `text-wrap: balance`. Parágrafos com `text-pretty`.
- Palavras técnicas, marcas e comandos com `translate="no"`.
- Preload só da Mona Sans normal, em `latin`. `font-display: swap` com `size-adjust` para evitar deslocamento.
- Conferir `ã`, `ç`, `é`, `ß`, `ñ` e `œ` nas capturas, para os idiomas futuros.

### Escala fluida

Dois tamanhos fazem o trabalho visível: um muito grande e um pequeno. A razão entre o nome e o corpo passa de 8.

| Token | Mínimo (360 px) | Máximo (1600 px) | Largura | Uso |
|---|---|---|---|---|
| `--t-nome` | 56 px | 176 px | `wdth` 112, `wght` 740 | H1, só no hero |
| `--t-h2` | 40 px | 96 px | `wdth` 104, `wght` 660 | Títulos de seção |
| `--t-h3` | 22 px | 30 px | `wdth` 100, `wght` 600 | Subtítulos |
| `--t-lead` | 19 px | 24 px | `wdth` 100 | Frase de apoio |
| `--t-corpo` | 17 px | 19 px | `wdth` 100 | Leitura |
| `--t-legenda` | 14 px | 15 px | `wdth` 100 | Legendas |
| `--t-dado` | 12 px | 13 px | JetBrains Mono | Dados do HUD, hexdump, códigos |

Tudo em `clamp()`, com `rem`, para respeitar o zoom.

## Espaço e grid

**Escala base 4:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256 px.

**Grid:** 12 colunas de até 1440 px no desktop, 8 no tablet e 4 no celular. O conteúdo fica nas colunas 1–7 e a forma da seção nas colunas 8–12. Margens externas iguais. A moldura ocupa uma faixa fixa de 24 px (desktop) ou 12 px (celular) em volta do viewport, e o conteúdo respeita essa faixa.

**Seções:** altura mínima de 100 svh quando fixadas. Espaço acima do título maior que abaixo. Safe areas respeitadas com `env(safe-area-inset-*)`.

## Moldura de instrumento (HUD)

Peça fixa no viewport, em DOM. Os dados são `aria-hidden` quando duplicam informação da página, e o relógio e a seção atual também estão no fluxo para quem usa leitor de tela. **Todo valor da moldura é real** ([04](04-direcao-criativa.md#princípio-inegociável-todo-enfeite-técnico-mostra-um-dado-real)).

| Canto | Conteúdo | Atualização |
|---|---|---|
| Superior esquerdo | `warley.ferzion.com.br` e estado da cena (`cena: carregando`, `ativa`, `estática`) | Ao mudar de estado |
| Superior direito | Hora de Rondon do Pará, `UTC−3`, com segundos | A cada segundo, pelo ticker do GSAP |
| Inferior esquerdo | Seção atual e rolagem em px, em duas células (`agora` e `y 2418`) | A cada quadro, por ref, sem re-render |
| Inferior direito | FPS, nível de qualidade e tema, em três células (`58 fps`, `alto`, `rubro`) | A cada 500 ms |

**Régua de progresso:** puramente visual, `aria-hidden` e fora da ordem de foco (a navegação real é a barra). Na borda direita, marcações a cada 100 px de documento e um traço maior no início de cada seção, com o rótulo da seção ao passar o mouse. O indicador desce com a rolagem. Clicar em um traço leva à seção, e a navegação real continua na barra. É o único elemento da moldura com interação.

Os valores ficam em células separadas por espaço, sem ponto médio nem barra.

**Cantos:** marcas em L de 12 px nos quatro cantos da moldura, na cor `forma`. Delimitam a área de medida.

**Celular (< 768 px):** só os cantos superiores (identificador e hora), régua de 4 px sem rótulos e o restante recolhido no Índice.

**Movimento reduzido:** os números atualizam, mas sem transição.

## Superfícies e materiais

**Vidro só na navegação** (decisão 82, que restringe a 64). Em todo o resto, a profundidade vem de **degraus de tom** e da luz da cena.

| Token | Valor | Uso |
|---|---|---|
| `--borda` | 1 px de `forma` a 35% | Tabelas reais, campos, terminal, réguas |
| `--borda-ativa` | 1 px de `sinal` | Item focado ou ativo |
| `--sombra-flutua` | `0 24px 48px -16px oklch(0% 0 0 / .7)` | Só terminal, menus e Índice, que flutuam |
| `--raio-0` | 0 | Dados, tabelas, moldura |
| `--raio-1` | 2 px | Botões, campos |
| `--teto-texto` | Luminância máxima atrás de `tinta-2` | Shader, ver [06](06-motion-e-webgl.md#legibilidade-sobre-a-cena) |

**Brilho:** só na luz emitida pela cena (cabeça da chuva, LEDs, pulsos de fibra), pelo bloom. A interface parada não brilha. No hover, um botão pode ganhar brilho, porque responde a uma ação.

**Texto sobre a cena:** a cena respeita o teto de luminância onde há texto. Se isso não bastar, o bloco ganha `superficie` opaca a 92%, sem desfoque.

## Vidro só na navegação

O titular pediu o "vidro líquido" do iOS 26 na barra de navegação. O pacote nativo `expo-glass-effect` só existe em iOS e exige `expo` e `react-native`, então não serve a um site web. A versão web é CSS ([decisão 82](decisoes.md)):

- **Cápsula** (`.vidro`): fundo de `tinta` a 7%, `backdrop-filter: blur(12px) saturate(1.8) brightness(1.12)`, realce especular de 1 px no canto superior esquerdo e sombra de 1 px no oposto (`inset box-shadow`), brilho interno e sombra externa (a barra flutua).
- **Lente:** um segundo vidro, mais claro, desliza até o link da seção atual (`.barra-links::before`, por variáveis `--lente-x` e `--lente-l`, medidas no cliente). Mola de 450 ms.
- **Onde:** a cápsula dos links e a das ações (`Currículo`, chuva, som, terminal, tema). Outras partes só entram se o titular pedir.
- **Tema Claro:** fundo de `superficie` a 55% e realce branco.
- **Sem suporte a `backdrop-filter`:** fundo de `superficie` a 94%, sem desfoque.
- **Desempenho:** o desfoque é refeito a cada quadro da chuva, mas em duas áreas pequenas (cerca de 640 × 44 e 290 × 44 px). Não se aplica a painéis grandes.
- **Refração de borda: testada e descartada.** Um `feDisplacementMap` com mapa embutido (a CSP aceita `data:` em imagens) funciona só em Chromium e, sobre a chuva escura, quase não se distingue do vidro simples. Custava um filtro SVG a mais por quadro ([decisão 82](decisoes.md)).

## Elementos gráficos

SVGs e textos gerados por script a partir de dados, com `aria-hidden`. Cada um tem origem conferível.

| Elemento | Gerador | Dado de origem | Uso |
|---|---|---|---|
| **Trilhas de placa** | `scripts/gerar-trilhas.ts` | Semente fixa por seção. Traços em 45°, vias e pads, sem componente de marca | Fundo de seções; ligam blocos de conteúdo à moldura |
| **Hexdump** | No build, em `src/conteudo/derivados.ts` | UTF-8 do parágrafo de Sobre | Sobre, terminal `hexdump` |
| **Faixa binária** | No build | Hash do commit | Rodapé |
| **Código de barras** | No build | Hash do commit | `/seguranca` |
| **Fingerprint** | No build | SHA-256 do registro de cada certificado (nome, emissor, data, código) | Certificados |
| **Traceroute** | Componente | As dez experiências, em ordem | Trajetória |
| **Degraus** | Componente | Os quatro grupos de evidência, com o peso no tamanho e no tom do texto ([decisão 91](decisoes.md)) | Competências |
| **Coelho branco** | Traço contínuo original | — | Só no CTF |

**Ícones:** Lucide com traço de 1,5 px, importação direta. Sem emoji nem caracteres Unicode como ícone. Sem logos de terceiros.

## Tokens de movimento

Detalhados em [06](06-motion-e-webgl.md).

| Token | Valor | Uso |
|---|---|---|
| `--ease-saida` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas |
| `--ease-troca` | `cubic-bezier(0.65, 0, 0.35, 1)` | Movimento dentro da tela |
| `--ease-sinal` | `steps(8, end)` | Decodificação e carregamento de barras, que andam em degraus como um instrumento |
| `--dur-toque` | 90 ms | Pressionar |
| `--dur-hover` | 160 ms | Hover, foco |
| `--dur-ui` | 240 ms | Menus, painéis |
| `--dur-decodifica` | 600 ms | Títulos decodificados, uma vez |
| `--dur-cena` | 900 ms | Transição de rota e de tema |
| Mola de painel | `stiffness 400, damping 32` | Motion for React |

## Componentes

Base UI para comportamento acessível, com visual próprio. O shadcn/ui serve de ponto de partida para o código, sem a aparência padrão.

| Componente | Base | Estados obrigatórios | Notas |
|---|---|---|---|
| `Botao` | `button`/`a` | Hover, foco, pressionado, desativado, carregando | Principal em `sinal` sólido com texto `fundo`. Secundário só com `--borda`. Escala 0,97 ao pressionar. Sem seta |
| `Link` | `a` | Hover, foco, visitado | Sublinhado que se preenche da esquerda para a direita, como barra de progresso |
| `Secao` | `section` | Com e sem cena | Título, forma da seção e trilhas. Posição derivada da ordem, mostrada só na régua |
| `Moldura` | `div` fixo | Completa, celular, estática | [Moldura de instrumento](#moldura-de-instrumento-hud) |
| `Regua` | `nav` secundária | Atual, hover, foco | Duplica uma navegação real |
| `BootLog` | `ol` com `aria-hidden` | Em andamento, concluído | Passos reais com tempos medidos. Some 4 s após concluir |
| `Hexdump` | `pre` com `aria-hidden` | Linha ativa | Offset, bytes e ASCII. Real |
| `Traceroute` | `ol` | Salto atual, passado, futuro | Lista real, mesmo se animada |
| `BlocosCarga` | `ul` | Concluído, em andamento | Área proporcional às horas reais |
| `AneisEvidencia` | `section` com listas | Por anel, filtrado | Os itens continuam sendo listas |
| `TabelaCertificados` | `table` | Com e sem validação | Link externo com `rel="noopener noreferrer"` |
| `Handshake` | `ol` com `aria-hidden` | Etapas | Decora as ações reais de contato |
| `RegistroSessao` | `aside` com `role="log"` | Recolhido, aberto, vazio | Eventos reais da visita ([07](07-recursos-interativos.md#registro-da-sessão)) |
| `FiltroUrl` | Base UI Toggle Group | Selecionado, foco | Sincroniza com a URL |
| `TrocadorTema` | Base UI Menu | Tema atual, bloqueado | Fósforo aparece como bloqueado até ser liberado |
| `Terminal` | Base UI Dialog | Aberto, vazio, erro | Abre sem animação |
| `RevelarWhatsapp` | `button` → `a` | Oculto, revelado | Foco passa para o link |
| `BotaoSom` | `button` | Ligado, desligado, indisponível | `aria-pressed` |
| `BotaoChuva` | `button` | Pausada, ligada | `Pausar chuva`, com `aria-pressed` |
| `ModoDireto` | `a` para `/cv` | Sempre visível | Atalho de quem tem pressa |

**Estados globais obrigatórios:** foco visível com contorno de 2 px em `sinal` e deslocamento de 3 px em todo interativo; seleção de texto em `sinal` com texto `fundo`; cursor de texto em `sinal`; barra de rolagem fina em `forma` sobre `fundo`; `color-scheme` e `theme-color` por tema; alvos de toque de 44 px ou mais.

## Tailwind e tokens

Tailwind v4, com tokens em `@theme`. Temas trocam por `data-tema` na tag `html`, com um script bloqueante mínimo e de hash fixo na CSP (`public/tema.js`), para evitar flash.

```css
@theme {
  --color-fundo: var(--fundo);
  --color-superficie: var(--superficie);
  --color-superficie-2: var(--superficie-2);
  --color-tinta: var(--tinta);
  --color-tinta-2: var(--tinta-2);
  --color-sinal: var(--sinal);
  --color-forma: var(--forma);
  --color-forma-fundo: var(--forma-fundo);
  --color-alerta: var(--alerta);
  --font-texto: "Mona Sans", system-ui, sans-serif;
  --font-dado: "JetBrains Mono", ui-monospace, monospace;
}
```

Regra: componente nenhum usa cor ou fonte literal. Valor novo entra primeiro neste documento.
