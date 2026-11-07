# 06 — Motion e WebGL

Como tudo se move no conceito Sinal, quem é o dono de cada animação e como a experiência se adapta ao aparelho. Fontes: skills Animate (Emil Kowalski), GSAP, React Three Fiber e `threejs-webgl`.

**Situação:** redesign de 06/11/2026. O relógio, os níveis de qualidade, o teto de luz e os orçamentos vêm da versão anterior e já foram testados. Cena, chuva, storyboard e microinterações são novos.

## Regras gerais

1. **Um momento autoral por seção.** Listado no [storyboard](#storyboard-da-rolagem). Não há efeito igual de entrada em todas as seções.
2. **O conteúdo já está visível.** As animações partem do estado legível. Um texto nunca depende de animação para aparecer, e a decodificação parte do texto final já no HTML.
3. **Só animamos transform, opacity, filter, clip-path, mask e eixos de fonte variável.** Nunca `transition: all`.
4. **Ações de teclado não animam.** Terminal e foco respondem de imediato.
5. **Toda animação é interrompível.** Rolar ou clicar cancela a anterior.
6. **Fora da tela, para.** Cena invisível não renderiza, e aba oculta pausa tudo.
7. **Movimento de instrumento.** Barras, decodificações e contadores andam em degraus (`--ease-sinal`), como um aparelho. Painéis e menus usam mola. A cena usa curvas suaves.

## Quem é dono de quê

Cada elemento tem um único motor.

| Tarefa | Motor | Exemplo |
|---|---|---|
| Relógio global | **GSAP ticker** | Alimenta Lenis, ScrollTrigger, a cena e o relógio do HUD |
| Rolagem suave | **Lenis** | Desligado com movimento reduzido |
| Progresso e fixação na rolagem | **GSAP ScrollTrigger** | Traceroute, topologia, blocos de carga |
| Sequências | **GSAP Timeline** | Abertura do hero, handshake |
| Decodificação de títulos | **GSAP ScrambleText** | Títulos de seção, uma vez por visita |
| Largura variável por letra | **GSAP SplitText** | Nome do hero, de condensado a expandido |
| Traços | **GSAP DrawSVG** | Fibra, traceroute, trilhas, handshake |
| Formas que mudam | **GSAP MorphSVG** | Sem uso desde a saída dos anéis (decisão 91) |
| Flags animadas | **Lottie (`lottie_light`)** | Confirmação de flag do CTF |
| Hover, pressionar, gesto, entrada e saída de componente | **Motion for React** | Botões, menus, Índice, registro da sessão, filtros |
| Mudanças simples de estado | **CSS** | Cor de link, foco, sublinhado |
| Troca de rota | **View Transitions** | `/` → `/cv` |
| Cena 3D | **R3F, avançado pelo GSAP ticker** | Chuva e formas das seções |

**Proibido:** GSAP e Motion no mesmo elemento e propriedade; `requestAnimationFrame` separado para Lenis, para a cena ou para o HUD.

### Ligação do relógio

Padrão já em produção em `src/movimento/relogio.ts`:

```ts
const lenis = new Lenis({ autoRaf: false });
lenis.on("scroll", ScrollTrigger.update);

function pulso(tempo: number) {
  lenis.raf(tempo * 1000);        // GSAP entrega segundos; Lenis espera milissegundos
  advance(tempo * 1000);          // R3F com frameloop="never"
}
gsap.ticker.add(pulso);
gsap.ticker.lagSmoothing(0);
```

O `Canvas` usa `frameloop="never"`. Em React, tudo usa `useGSAP` com limpeza por contexto. Estado de rolagem e dados do HUD passam por refs, sem re-render por quadro.

## Arquitetura da cena

**Um único `Canvas`, fixo atrás do DOM, em `layout.tsx`.** Persiste entre rotas e fica com `aria-hidden`, sem foco e `pointer-events: none`. O cursor é lido em `window`.

| Camada | Conteúdo | Ativa em |
|---|---|---|
| `Chuva` | Glifos em shader de fragmento | Sempre, com intensidade por seção |
| `Forma` | A forma 3D de cada seção, renderizada em um alvo do tamanho da grade de células | Início, Agora e Contato |
| `Pos` | Bloom, grão, aberração, vinheta | Conforme o nível de qualidade |

`Chuva` e `Pos` chegam primeiro. `Forma` fica em um chunk próprio, carregado depois da pintura. O traceroute, a régua de formação e o handshake são SVG ou HTML no DOM, por precisarem de texto e botões reais ([decisão 48](decisoes.md)). A cena repete essas formas como luz, nunca como a única fonte.

### Renderizador

**Base:** WebGL2 com `three`, `@react-three/fiber`, `@react-three/drei` e `@react-three/postprocessing`.

**Armadilhas conhecidas, mantidas da versão anterior:**

- Criar o `ShaderMaterial` à mão e passá-lo ao `mesh`. Como prop JSX, valores numéricos dos uniforms não chegam ao shader. O teste "a chuva anima de verdade" protege contra isso.

**WebGPU/TSL:** continua fora do lançamento ([decisão 40](decisoes.md)). Reavaliar depois da R5, pelos critérios:

- A mesma chuva roda em WebGPU e WebGL2 a partir do mesmo código TSL.
- Bloom, grão e aberração com qualidade equivalente.
- Testado em Chrome, Safari 26 ou mais novo, Firefox e iPhone, com fallback funcionando no Firefox para Linux.
- O bundle não cresce mais que 15%.

## A chuva

Peça central, compartilhada pelas duas cenas. Motor próprio em shader de fragmento, sem partículas individuais. Reaproveita `scripts/gerar-atlas.ts` e `src/gl/chuva/shader.ts`, com glifos, cores e comportamento novos.

### Atlas de glifos

`scripts/gerar-atlas.ts` gera no build um atlas com SDF de um canal e cerca de 128 glifos:

| Grupo | Glifos | Função |
|---|---|---|
| Hexadecimal | `0–9 A–F` | Sentido técnico, maioria das células |
| Binário | `0 1` com peso maior no sorteio | Faixas de bits |
| Katakana | 40, em conjunto próprio | Homenagem a Matrix, **sem espelhar** e sem copiar o conjunto do filme |
| Símbolos de código | 22 caracteres ASCII: `/ \ { } [ ] < > = + - * # & | ^ ~ ; : _ ( )` | Código. Os operadores lógicos Unicode ficaram de fora: o subconjunto latino da fonte não os traz |
| Traços de caixa | `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼`, **desenhados à mão no canvas** | Contorno das formas travadas, com junção sem emenda entre células |

Total: 109 glifos em 16 × 7. Martian Mono e Noto Sans JP pré-renderizadas. O sorteio por célula usa pesos fixos: hex 52%, binário 14%, katakana 20% e símbolos 14%.

### Comportamento

Para cada coluna, um `hash(coluna)` define velocidade, cauda, fase e profundidade.

| Elemento | Especificação |
|---|---|
| Cabeça | `chuva-cabeca`, com bloom. Brilho acima de 1 para acionar o limiar |
| Cauda | Decaimento exponencial em `chuva`. De 12 a 40 células |
| Troca de glifo | Cada célula troca em intervalo próprio, de 80 a 600 ms |
| Velocidade | De 2,4 a 10,8 células por segundo, por coluna: a queda corre a 60% da velocidade original (`RITMO_BASE`), por pedido do titular |
| Camadas | Três planos: perto (grande, desfocado), meio (nítido), longe (pequeno e apagado). Paralaxe com o cursor |
| Travamento | Uma **máscara** com um texel por célula (18 px). Onde ela vale 1, a célula para de cair: o contorno usa traços de caixa escolhidos pelos vizinhos (n, s, e, w) e o miolo usa hexadecimal. É o "ruído virando sinal". A fonte da máscara é plugável: na R2 é o nome do hero, desenhado em canvas 2D com a fonte real da página (`src/gl/chuva/mascara.ts`); as cenas A e B trocam a fonte e mantêm o resto |
| Rolagem | A velocidade da rolagem altera a taxa de queda em até 2,5×, com suavização |
| Frase escondida | Parada, uma coluna decodifica `WARLEY`. Com o CTF completo, `siga o coelho branco` |
| Fim da página | Em Contato, a chuva cai a 15% da velocidade |

### As formas das seções

O titular escolheu a cena "Tudo é código" em 07/11/2026, e a alternativa com modelos 3D foi removida, com seus scripts do Blender ([decisão 81](decisoes.md)). `src/gl/forma/Forma.tsx`: uma cena 3D pequena, em unidades de célula (eixo y para cima), é renderizada em um **alvo do tamanho exato da grade** da chuva (por exemplo, 80 × 50 texels). A câmera em perspectiva enquadra a tela inteira. O alvo vira a máscara de travamento: onde há superfície, a célula trava e escolhe o glifo (traços de caixa no contorno, hex no miolo). A luz da superfície (0,55 a 1) vira profundidade no brilho.

| Seção | Forma construída | Detalhe |
|---|---|---|
| Início | Nome em **pilha de 22 camadas** com a máscara 2D do hero | A câmera gira ±10° e a pilha vira extrusão. Fica sob o nome em DOM |
| Agora | Árvore de fibra 1:2:4:8: OLT, divisores e ONUs em caixas, tubos de 1,7 célula de espessura | Três pulsos de luz percorrem OLT, divisor, divisor e ONU. Gira ±20° |
| Contato | Dois nós e três setas, o handshake SYN, SYN-ACK, ACK | Ciclo de 5 s: uma esfera percorre cada seta em 1,2 s, e uma pausa fecha |

As outras seções não têm forma na cena: a chuva é tênue atrás delas, e o conteúdo é feito de HTML e SVG (traceroute, régua de carga horária, degraus de evidência, tabela).

- **Região:** nas colunas da direita em tela larga (62% a 95% da largura, a partir de 1100 px) e em uma faixa no topo em tela estreita.
- **Espessura mínima:** tubos com menos de uma célula ficam picotados. O mínimo é cerca de 1,5 célula.
- **Custo:** o chunk da cena tem 4,7 KB (2,3 KB gzip), sem assets. O alvo é minúsculo e a leitura é de uma textura.
- **Cena parada:** com movimento reduzido ou chuva pausada, as formas ficam em um quadro fixo.

### Câmera

Perspectiva fixa que enquadra a grade, com uma rotação lenta em torno do centro. Não há caminho de câmera por seção: cada forma aparece só quando a sua seção cruza o centro da tela (`partilha.secao`).

### Legibilidade sobre a cena

**A maior parte do texto fica direto sobre a cena.** A cena escurece onde há texto.

- **Fora do hero:** um teto de luminância no shader limita toda a cena (`uTeto`), com valor por tema.
- **No hero:** um degradê no DOM protege a caixa do texto.
- Texto que não couber nessa regra usa `superficie` opaca a 92%.
- **Teste automático:** `tests/e2e/cena.spec.ts` esconde o texto, tira uma captura, mede a luminância atrás de cada bloco em cada tema e falha se passar do limite. Limites calculados em 06/11/2026 a partir de `tinta-2` com 4,5:1 (`tetoDeLuz` em `src/temas/cor.ts` aplica 5% de folga ao teto): Rubro 0,0375, Fósforo 0,0707 e, no Claro, piso de 0,45. O teto do shader (`uTeto`) deriva da `tinta-2` de cada tema.

### Tema Claro

Em fundo claro, bloom e brilho não funcionam. A cena muda de técnica:

- A chuva vira **tinta**: glifos escuros a no máximo 8% de opacidade, com a cabeça em `sinal` a 25%.
- Formas travadas viram **desenho técnico**: contornos em `forma`, sem luz, como uma planta de engenharia.
- Sem bloom, sem aberração. O grão vira textura de papel.

### Pós-processamento

| Efeito | Nível alto | Nível médio | Nível baixo |
|---|---|---|---|
| Bloom | 2 passos seletivos | 1 passo | Falso, no próprio shader |
| Grão | Sim | Sim | Não |
| Aberração cromática | Só em transições de seção e de tema | Só em transições | Não |
| Linhas de varredura | Muito sutis, só no tema Fósforo | Idem | Não |
| Vinheta | Sim | Sim | Em CSS |

## Níveis de qualidade

Mantidos da versão anterior. Heurística local (núcleos, memória, tipo de ponteiro) corrigida por um controlador de quadros. Sem `detect-gpu`, que busca dados em CDN externo ([decisão 38](decisoes.md)). **O nível escolhido aparece na moldura e no registro da sessão**, como dado real.

| Nível | Quando | Chuva | Forma | DPR |
|---|---|---|---|---|
| **Alto** | GPU dedicada, desktop | 3 camadas | Completa | Até 2 |
| **Médio** | Integrada recente, celular topo de linha | 2 camadas | Completa | Até 1,5 |
| **Baixo** | Celular intermediário | 1 camada | Completa, sem pós-processamento | Até 1,25 |
| **Mínimo** | Sem WebGL2 | Canvas 2D, 30 fps | Pôster | 1 |
| **Estático** | Economia de dados, movimento reduzido ou falha | Quadro parado | Pôster | — |

**Controlador:** média móvel de 60 quadros. Acima de 22 ms, reduz DPR e depois o nível. Abaixo de 14 ms por 5 s, sobe DPR, sem subir de nível.

**Economia:** pausa com aba oculta; 30 fps com bateria fraca, se a API existir; DPR reduzido durante rolagem rápida.

**Pôster:** AVIF de cada seção, renderizado do próprio shader no build, para a transição pôster → cena ser quase invisível.

## Storyboard da rolagem

O progresso das animações do DOM vem do ScrollTrigger (`src/movimento/storyboard.ts`). O DOM nunca depende dele para ser lido. Sem seções fixadas: a rolagem sempre anda. A cena lê a rolagem por conta própria ([decisão 47](decisoes.md)).

| Seção | O que acontece | Celular |
|---|---|---|
| **Início** | O nome já está no HTML. Quando a cena chega, os glifos travam no desenho do nome e o nome passa de `wdth` 75 a 112 (o token `--larg-nome`) em 1,1 s, uma vez. A moldura liga e o boot log lista os passos reais | Igual |
| **Sobre** | A ficha à direita, marcada só por um fio, traz cargo, local, estudo formal desde 02/2022 e tempo no cargo, calculados das datas. Embaixo dela, o hexdump real do texto. Ela gruda só enquanto o texto passa (`.sobre-topo`), e nunca sobre os blocos de baixo | A ficha desce para depois do texto |
| **Agora** | A forma da seção é a árvore de fibra desenhada pela chuva. A simulação GPON saiu (decisão 90) | Sem forma: o texto ocupa a largura (decisão 92) |
| **Trajetória** | Um pacote percorre o traceroute com a rolagem, e cada salto acende quando ele chega. O último, o NOC, fica em `sinal` | Traceroute com trilho estreito |
| **Formação** | Régua comum de horas: as barras dos concluídos se enchem em degraus de 1/14 em 0,9 s, no mesmo eixo de 0 a 2.600 h. O curso em andamento tem régua de tempo e usa a data de **hoje**, e não a do build | Régua abaixo do nome do curso |
| **Competências** | Sem animação própria: os degraus já são o estado final. Filtrar esconde os itens que não casam | Degraus em coluna única |
| **Certificados** | Tabela com o SHA-256 de cada registro. Filtrar esconde as linhas | Cada linha vira um bloco com rótulos |
| **Contato** | A forma da seção é o handshake. A chuva cai a 15% da velocidade | Sem forma (decisão 92) |

### Decodificação de títulos

GSAP ScrambleText, uma vez por título e por visita, ao entrar na tela. O HTML já traz o título final, e a decodificação parte dele. Usa só dígitos hex, em 600 ms. Com movimento reduzido, não acontece. O nome acessível (`aria-label`) é fixado antes da animação, então o leitor de tela nunca ouve o embaralhamento.

## Microinterações

| Elemento | Comportamento | Dur. |
|---|---|---|
| Botão principal | Escala 0,97 ao pressionar; no hover, o fundo varre da esquerda para a direita em `sinal` | 90 ms / 160 ms |
| Hover magnético | Só nos 2 botões do hero e em `Mostrar WhatsApp`, com `gsap.quickTo`; sem efeito em toque | 400 ms |
| Link | O sublinhado se preenche como barra de progresso, em degraus | 240 ms |
| Linha de tabela e item de lista | Fundo `superficie-2` e marcador em `sinal`, só cor | 160 ms |
| Filtros | Reordenação com `animate` do Motion | 240 ms |
| Índice | Itens entram com mola | Mola |
| Registro da sessão | Evento novo entra pelo topo, empurrando os outros | 240 ms |
| Trocador de tema | DOM por View Transition; a chuva muda de cor em 800 ms, coluna por coluna, de cima para baixo | 800 ms |
| Barra de navegação | Cápsula de vidro. A lente de vidro desliza até o link da seção atual com uma mola curta (450 ms). Ver [vidro](05-design-system.md#vidro-só-na-navegação) | 450 ms |
| Revelar WhatsApp | O número decodifica em até 400 ms | 400 ms |
| Copiar e-mail | O botão vira `E-mail copiado` com um traço que se completa | 240 ms |

Hover de lista repetida fica só na cor. Elementos que aparecem partem de `scale(0.96)` e `opacity: 0`, nunca de `scale(0)`.

## Transições de rota

View Transitions pelo componente `ViewTransition` do React, com `default="none"` e `transitionTypes={["rota"]}` só nos links marcados ([decisão 50](decisoes.md)).

| De → para | Efeito |
|---|---|
| `/` → `/cv` | As células da chuva destravam e o canvas apaga em 300 ms; o texto entra com `--ease-saida` |
| `/cv` → `/` | Pôster aparece, e a cena retoma |
| Âncora → âncora | Lenis rola com duração proporcional, no máximo 1,2 s |

## Movimento reduzido

Com `prefers-reduced-motion: reduce`:

| Recurso | Comportamento |
|---|---|
| Lenis | Desligado, rolagem nativa |
| Trilho do hero | Uma tela só, sem `sticky` |
| Chuva | Quadro parado, com as formas já travadas |
| ScrollTrigger | Sem fixar nem fazer scrub; cada seção mostra o estado final |
| Nome do hero | Já na largura final |
| Decodificação e embaralhamento | Texto final direto |
| Handshake, traceroute, blocos | Estado final |
| Hover magnético e a mola da lente de vidro | Desligados |
| HUD | Números atualizam sem transição |
| Foco, seleção, cor de hover | Mantidos |
| Tema | Troca imediata |
| View Transitions | Desligadas |

O botão `Pausar chuva` na barra dá o mesmo controle para quem não usa a preferência do sistema.

## Orçamentos

Medidos em celular intermediário real. Ver [11](11-qualidade.md#orçamentos).

| Item | Limite |
|---|---|
| Quadro no nível alto | ≤ 12 ms de GPU em desktop com integrada |
| Quadro no nível baixo | ≤ 16 ms em celular intermediário |
| Chamadas de desenho | ≤ 80 por quadro |
| Triângulos | ≤ 300 mil no alto; ≤ 60 mil no baixo |
| Texturas | ≤ 64 MB de GPU no alto; ≤ 24 MB no baixo |
| Assets do hero | ≤ 1,5 MB, depois do LCP |
| Bibliotecas 3D | ≤ 380 KB gzip, carregados depois da pintura |
