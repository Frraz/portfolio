# 05 — Design system

Tokens e componentes da Nave Digital. Fonte única para `src/temas/` e para `/sistema`. Hierarquia de tokens: primitivo → semântico → componente, como na skill `ui-ux-pro-max:design-system`.

## Os cinco temas

Valores em hexadecimal, com OKLCH calculado. O CSS usa OKLCH, e o shader recebe os mesmos valores em RGB linear.

### Ouro (padrão)

| Papel | Hex | OKLCH |
|---|---|---|
| `fundo` | `#030304` | `oklch(9.8% 0.004 285.6)` |
| `superficie` | `#14110C` | `oklch(17.9% 0.011 80.5)` |
| `tinta` | `#EFE8D6` | `oklch(93.2% 0.025 89.2)` |
| `tinta-2` | `#B9AE94` | `oklch(75.3% 0.038 87.8)` |
| `acento` | `#D2A94E` | `oklch(75.4% 0.119 84.8)` |
| `acento-2` | `#52F59A` | `oklch(86.4% 0.186 154.6)` |
| `alerta` | `#F0566A` | `oklch(66.4% 0.189 16.3)` |
| `chuva` | `#52F59A` | `oklch(86.4% 0.186 154.6)` |
| `chuva-cabeca` | `#EFFFF5` | `oklch(98.5% 0.021 158.6)` |

### Fósforo

| Papel | Hex | OKLCH |
|---|---|---|
| `fundo` | `#000300` | `oklch(8.4% 0.029 142.5)` |
| `superficie` | `#07140C` | `oklch(17.6% 0.025 156.3)` |
| `tinta` | `#C9F7DA` | `oklch(93.6% 0.061 157.3)` |
| `tinta-2` | `#7FC79B` | `oklch(77.0% 0.096 156.5)` |
| `acento` | `#3DF58A` | `oklch(85.7% 0.206 152.4)` |
| `acento-2` | `#D2A94E` | `oklch(75.4% 0.119 84.8)` |
| `alerta` | `#FF6B6B` | `oklch(71.2% 0.181 22.8)` |
| `chuva` | `#2FE87F` | `oklch(82.0% 0.203 152.2)` |
| `chuva-cabeca` | `#E6FFF0` | `oklch(97.8% 0.033 159.4)` |

### Rubro

| Papel | Hex | OKLCH |
|---|---|---|
| `fundo` | `#070203` | `oklch(10.1% 0.017 3.4)` |
| `superficie` | `#1A0A0C` | `oklch(17.0% 0.028 12.5)` |
| `tinta` | `#EEE3D8` | `oklch(92.2% 0.019 67.6)` |
| `tinta-2` | `#BFA9A0` | `oklch(75.1% 0.029 43.6)` |
| `acento` | `#F0465A` | `oklch(64.4% 0.205 18.7)` |
| `acento-2` | `#EFE3C8` | `oklch(91.8% 0.038 86.9)` |
| `alerta` | `#FF8A7A` | `oklch(75.8% 0.145 29.0)` |
| `chuva` | `#E8314A` | `oklch(61.0% 0.216 19.8)` |
| `chuva-cabeca` | `#FFE9E4` | `oklch(95.0% 0.025 32.9)` |

### Púrpura

| Papel | Hex | OKLCH |
|---|---|---|
| `fundo` | `#07040D` | `oklch(12.0% 0.024 301.5)` |
| `superficie` | `#170F26` | `oklch(19.2% 0.046 298.0)` |
| `tinta` | `#EEE6F5` | `oklch(93.6% 0.022 309.6)` |
| `tinta-2` | `#B7A8CC` | `oklch(75.6% 0.053 304.1)` |
| `acento` | `#D9B65A` | `oklch(78.9% 0.118 88.7)` |
| `acento-2` | `#B58CFF` | `oklch(72.6% 0.166 298.7)` |
| `alerta` | `#FF7A8A` | `oklch(73.8% 0.162 14.5)` |
| `chuva` | `#9F7BFF` | `oklch(67.8% 0.189 293.3)` |
| `chuva-cabeca` | `#F3ECFF` | `oklch(95.4% 0.026 302.6)` |

### Pergaminho (claro)

| Papel | Hex | OKLCH |
|---|---|---|
| `fundo` | `#F3ECDD` | `oklch(94.5% 0.021 85.9)` |
| `superficie` | `#FFFAF0` | `oklch(98.6% 0.014 84.6)` |
| `tinta` | `#16120C` | `oklch(18.5% 0.013 77.8)` |
| `tinta-2` | `#5A4F3F` | `oklch(43.4% 0.029 77.1)` |
| `acento` | `#7A1420` | `oklch(37.9% 0.135 21.1)` |
| `acento-2` | `#6E5310` | `oklch(45.9% 0.087 84.7)` |
| `alerta` | `#8E1122` | `oklch(41.7% 0.156 21.7)` |
| `chuva` | `#16120C` | `oklch(18.5% 0.013 77.8)` |
| `chuva-cabeca` | `#7A1420` | `oklch(37.9% 0.135 21.1)` |

### Tema Selado

Sexto tema, liberado só por quem encontra os nove selos do CTF ([07](07-recursos-interativos.md#recompensa)). Usa os tokens do tema Ouro, com a rosácea totalmente acesa, e por isso não tem cálculo próprio de contraste.

## Contraste calculado (WCAG 2.2)

Todos os pares calculados pela fórmula de luminância relativa. Mínimo: 4,5:1 para texto e 3:1 para elementos gráficos (`acento-2`, sempre gráfico ou texto grande).

| Tema | tinta / fundo | tinta / sup. | tinta-2 / fundo | tinta-2 / sup. | acento / fundo | acento / sup. | alerta / fundo | alerta / sup. | acento-2 / sup. |
|---|---|---|---|---|---|---|---|---|---|
| Ouro | 16,87 | 15,41 | 9,37 | 8,56 | 9,35 | 8,54 | 6,13 | 5,60 | 13,35 |
| Fósforo | 17,57 | 15,97 | 10,41 | 9,46 | 14,44 | 13,12 | 7,47 | 6,79 | 8,55 |
| Rubro | 16,30 | 15,21 | 9,22 | 8,60 | 5,62 | 5,24 | 9,00 | 8,39 | 15,09 |
| Púrpura | 16,73 | 15,25 | 9,19 | 8,37 | 10,45 | 9,52 | 8,14 | 7,42 | 7,20 |
| Pergaminho | 15,86 | 17,93 | 6,80 | 7,69 | 9,16 | 10,36 | 7,92 | 8,96 | 6,94 |

Todos passam. `scripts/verificar-contraste.ts` repete o cálculo no CI, sempre que um token mudar.

## Tipografia

Licenças e subconjuntos conferidos na API do Fontsource em 05/11/2026. Todas as fontes são OFL 1.1 e auto-hospedadas em WOFF2 com subconjunto.

| Papel | Fonte | Eixos | Uso |
|---|---|---|---|
| Títulos | **Grenze Gotisch** | Variável, peso 100–900 | H1, H2, inicial iluminada. Só em tamanho grande |
| Leitura | **Literata** | Variável, peso 200–900 | Corpo, listas, legendas. Traz grego e cirílico |
| Dados | **JetBrains Mono** | Variável, peso 100–800 | Terminal, datas, credenciais, comandos |
| Numeração | **Jacquard 24** | Peso único, só `latin` | Número da margem e anos da trajetória. Ponte entre gótico e pixel |
| Ornamento | **Monomakh** | Peso único, com cirílico | Faixas ornamentais de `aria-hidden` |
| Atlas da chuva | **Noto Sans JP, Noto Sans Glagolitic, Literata** | Pré-renderizadas | Só no atlas do shader. Nunca são baixadas como webfont |

**Motivo da escolha:** Grenze Gotisch é uma letra gótica variável de leitura possível, com letras acentuadas para o português. Literata foi desenhada para leitura longa em tela e funciona bem em fundo escuro, com peso ajustado para cima.

**Regras**

- O H1 ocupa no máximo duas linhas em qualquer largura, testado em 360 px.
- Letra gótica só de 32 px para cima, sempre em caixa alta e baixa. Caixa alta em letra gótica é ilegível.
- Texto de leitura em 18 px ou mais no desktop e 17 px ou mais no celular. Medida entre 62 e 72 caracteres.
- Em fundo escuro, Literata com peso 420, entrelinha 1,6 e tinta nunca abaixo de `tinta-2`.
- Datas e números em tabela com `font-variant-numeric: tabular-nums`.
- Títulos com `text-wrap: balance`. Parágrafos com `text-pretty`.
- Palavras técnicas, marcas e comandos usam `translate="no"`.
- Preload só de Grenze Gotisch e Literata normal, em subconjunto `latin`. `font-display: swap` com métricas ajustadas (`size-adjust`) para evitar deslocamento.

### Escala fluida

| Token | Mínimo (360 px) | Máximo (1600 px) | Uso |
|---|---|---|---|
| `--t-display` | 56 px | 96 px | H1 |
| `--t-h2` | 44 px | 76 px | Títulos de seção |
| `--t-h3` | 26 px | 36 px | Subtítulos |
| `--t-lead` | 20 px | 26 px | Frase de apoio |
| `--t-corpo` | 17 px | 19 px | Leitura |
| `--t-legenda` | 14 px | 15 px | Legendas |
| `--t-dado` | 13 px | 14 px | Mono |

Tudo em `clamp()`, com `rem` para respeitar o zoom do usuário. O limite de 96 px segue a skill Impeccable, e a exceção é a inicial da tela branca, que é arte.

## Espaço e grid

**Escala base 4:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256 px.

**Grid:** 12 colunas de 1200 px no desktop, 8 no tablet e 4 no celular, mais uma **margem de manuscrito** à esquerda com largura `clamp(0px, 8vw, 128px)`. Abaixo de 768 px, a margem some e o número fica ao lado do título.

**Seções:** altura mínima de 100 svh quando fixadas. Espaço acima do título maior que abaixo. Safe areas respeitadas com `env(safe-area-inset-*)`.

## Elevação e materiais

| Token | Valor | Uso |
|---|---|---|
| `--sombra-pedra` | `0 24px 48px -16px oklch(0% 0 0 / .7)` | Painéis sobre a cena |
| `--brilho-ouro` | `0 0 0 1px` de `acento` a 40% + `0 8px 24px -8px` de `acento` a 25% | Foco, destaque de iconóstase |
| `--raio-lanceta` | Arco ogival por `clip-path` | Janelas de Formação |
| `--raio-0` | 0 | Pedra, dados |
| `--raio-1` | 2 px | Botões, campos |

## Transparências: vidro de vitral

Calculado com a cor mais clara possível atrás do painel (`chuva-cabeca`). **Regra:** a opacidade da superfície precisa manter tinta e tinta-2 acima de 4,5:1 nesse pior caso.

| Tema | Alfa mínimo | Fundo resultante | tinta | tinta-2 |
|---|---|---|---|---|
| Ouro | 0,80 | `#40413B` | 8,43 | 4,69 |
| Fósforo | 0,76 | `#3D4C43` | 7,69 | 4,56 |
| Rubro | 0,78 | `#4C3B3C` | 8,32 | 4,70 |
| Púrpura | 0,80 | `#433B51` | 8,71 | 4,78 |
| Pergaminho | 0,76 | `#C7C2B9` | 10,52 | 4,51 |

**Token único:** `--vidro-alfa: 0.82`, acima do maior mínimo. Com ele, todos os temas passam sem depender de desfoque.

**Regras do vidro**

- Desfoque de 12 a 20 px em até dois painéis visíveis ao mesmo tempo, e nenhum no nível baixo de qualidade.
- Borda de 1 px em `acento` a 30%, com rendilhado fino em SVG apenas nos cantos.
- Refração real só em painéis-chave, feita no WebGL. O DOM mantém o texto.
- `@supports not (backdrop-filter: blur(1px))` usa `superficie` opaca.

## Ornamentos

SVGs próprios, gerados por script a partir de parâmetros e com `aria-hidden`.

| Ornamento | Forma | Uso |
|---|---|---|
| **Rendilhado** | Geometria em `src/ornamentos.ts`, usada pelo SVG e pelo shader | Rosácea, divisores, bordas |
| **Lanceta** | Arco ogival | Formação, máscaras de foto |
| **Selo** | Forma abstrata única por seção, gerada com base no número dela | Margem, CTF |
| **Faixa vyaz** | Padrão decorativo inspirado no ornamento cirílico | Divisores raros. Sem palavras inventadas |
| **Código de barras** | Barras derivadas do hash do build | Rodapé de `/seguranca` |
| **Cruz de três barras** | Traço único e proporções tradicionais | Só nos dois lugares definidos em [04](04-direcao-criativa.md#regras-do-sagrado) |
| **Maçã** | Silhueta simples em `alerta` | Só no CTF |
| **Coelho branco** | Traço contínuo original | Só no CTF |

Ícones de interface: Lucide, com traço de 1,5 px. Sem emoji nem caracteres Unicode como ícone.

## Tokens de movimento

Definidos aqui e detalhados em [06-motion-e-webgl.md](06-motion-e-webgl.md).

| Token | Valor | Uso |
|---|---|---|
| `--ease-saida` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas de elementos |
| `--ease-troca` | `cubic-bezier(0.65, 0, 0.35, 1)` | Movimento dentro da tela |
| `--dur-toque` | 90 ms | Pressionar |
| `--dur-hover` | 160 ms | Hover, foco |
| `--dur-ui` | 240 ms | Menus, painéis |
| `--dur-cena` | 900 ms | Transição de rota |
| Mola de botão | `stiffness 400, damping 30` | Motion for React |

## Componentes

Base UI para comportamento acessível, com visual próprio. O shadcn/ui serve de ponto de partida para o código, sem manter a aparência padrão.

| Componente | Base | Estados obrigatórios | Notas |
|---|---|---|---|
| `Botao` | `button`/`a` | Hover, foco, pressionado, desativado | Ouro com arco leve. Texto diz a ação. Pressionar: escala 0,97 |
| `LinkOuro` | `a` | Hover, foco, visitado | Sublinhado com folha de ouro |
| `Secao` | `section` | Com e sem cena | Título, margem, número derivado da ordem |
| `MargemManuscrito` | `aside` decorativo | Sem | Nome poético e número. `aria-hidden` no número |
| `PainelVitral` | `div` | Com e sem `backdrop-filter` | Aplica `--vidro-alfa` |
| `LinhaDoTempo` | `ol` | Reduzido e completo | Lista real, mesmo se animada |
| `Lanceta` | `article` | Em andamento, concluída | Altura da luz vem da data |
| `Iconostase` | `section` com listas | Por área | Portas reais são botões `aria-expanded` |
| `SeloCertificado` | `li` + `a` | Com e sem validação | Link externo com `rel="noopener noreferrer"` |
| `FiltroUrl` | Base UI Toggle Group | Selecionado, foco | Sincroniza com a URL |
| `TrocadorTema` | Base UI Menu | Tema atual, pré-visualização | Salvo em `localStorage` |
| `Terminal` | Base UI Dialog | Aberto, vazio, erro | Abre sem animação |
| `RevelarWhatsapp` | `button` → `a` | Oculto, revelado | Foco passa para o link |
| `BotaoSom` | `button` | Ligado, desligado | `aria-pressed` |
| `ModoDireto` | `a` para `/cv` | Sempre visível | Atalho de quem tem pressa |
| `BotaoChuva` | `button` | Pausada, ligada | `Pausar chuva`, na barra, com `aria-pressed` |

**Estados globais obrigatórios:** foco visível com contorno de 2 px em `acento` e deslocamento de 3 px em todo interativo; seleção de texto em `acento` com `fundo`; barra de rolagem fina na paleta; `color-scheme` e `theme-color` por tema; alvos de toque de 44 px ou mais.

## Tailwind e tokens

Tailwind v4, com tokens em `@theme`. Temas trocam por `data-tema` na tag `html`, com um script bloqueante mínimo e de hash fixo na CSP, para evitar flash.

```css
@theme {
  --color-fundo: var(--fundo);
  --color-tinta: var(--tinta);
  --font-titulo: "Grenze Gotisch", serif;
  --font-texto: "Literata", serif;
  --font-dado: "JetBrains Mono", monospace;
}
```

Regra: componente nenhum usa cor literal. Valor novo entra primeiro neste documento.
