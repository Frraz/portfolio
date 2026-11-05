# 06 — Motion e WebGL

Como tudo se move, quem é o dono de cada animação e como a experiência se adapta ao aparelho. Fontes: skills Animate (Emil Kowalski), GSAP, React Three Fiber e `threejs-webgl`.

## Regras gerais

1. **Um momento autoral por seção.** Listado em [Storyboard](#storyboard-da-rolagem). Não há efeito igual de entrada em todas as seções.
2. **O conteúdo já está visível.** As animações partem do estado legível: um texto nunca depende de animação para aparecer.
3. **Só animamos transform, opacity, filter, clip-path e mask.** Nunca `transition: all`.
4. **Ações de teclado não animam.** Terminal e foco respondem de imediato.
5. **Toda animação é interrompível.** Rolar ou clicar cancela a anterior.
6. **Fora da tela, para.** Cena invisível não renderiza, e aba oculta pausa tudo.

## Quem é dono de quê

Cada elemento tem um único motor. Isso evita a disputa entre bibliotecas que o `skills-stacks.md` alerta.

| Tarefa | Motor | Exemplo |
|---|---|---|
| Relógio global | **GSAP ticker** | Alimenta Lenis, ScrollTrigger e a cena |
| Rolagem suave | **Lenis** | Desligado com movimento reduzido |
| Progresso e fixação na rolagem | **GSAP ScrollTrigger** | Trajetória, árvore de fibra |
| Sequências | **GSAP Timeline** | Abertura do hero, portas reais |
| Texto decodificado e divisão de letras | **GSAP SplitText** | Título do hero |
| Vetores de traço | **GSAP DrawSVG** | Rendilhado |
| Sigilos animados | **Lottie (`lottie_light`)** | Selos do CTF |
| Hover, pressionar, gesto, entrada e saída de componente | **Motion for React** | Botões, menu, painéis |
| Mudanças simples de estado | **CSS** | Cor de link, foco |
| Troca de rota | **View Transitions** | `/` → `/cv` |
| Cena 3D | **R3F, avançado pelo GSAP ticker** | Chuva e nave |

**Proibido:** GSAP e Motion no mesmo elemento e propriedade; `requestAnimationFrame` separado para Lenis ou para a cena.

### Ligação do relógio

Padrão de integração indicado pela documentação da comunidade do GSAP e do Lenis. Um único laço conduz tudo:

```ts
const lenis = new Lenis({ autoRaf: false });
lenis.on("scroll", ScrollTrigger.update);

function pulso(tempo: number) {
  lenis.raf(tempo * 1000);        // GSAP entrega segundos; Lenis espera milissegundos
  advance(tempo * 1000);          // R3F com frameloop="never"
}
gsap.ticker.add(pulso);
gsap.ticker.lagSmoothing(0);
// Na desmontagem: gsap.ticker.remove(pulso); lenis.destroy();
```

O `Canvas` usa `frameloop="never"`. Parada, a cena só desenha quando algo muda (rolagem, tema, redimensionamento). Em React, tudo usa `useGSAP` com limpeza por contexto. Estado de rolagem passa por refs, sem re-render por quadro.

## Arquitetura da cena

**Um único `Canvas`, fixo atrás do DOM, em `layout.tsx`.** Ele persiste entre rotas e fica com `aria-hidden`, sem foco e `pointer-events: none`. O cursor é lido em `window`.

A cena tem camadas que se ligam conforme a seção. O `Canvas` usa câmera em perspectiva, e a chuva ignora a câmera por desenhar direto em coordenadas de tela:

| Camada | Conteúdo | Ativa em |
|---|---|---|
| `Chuva` | Glifos em shader | Início, Contato; fundo muito tênue nas demais |
| `Rosacea` | Janela analítica no shader, vidro e rendilhado | Início |
| `Nave` | Pilares, arcos, nervuras, piso, portal e a rosácea oeste | Depois da travessia, até o fim |
| `Lancetas` | Três janelas | Formação |
| `Reliquario` | Caixa de metal e selos, presos à câmera no terço direito | Certificados, em tela larga e tema escuro |
| `Atmosfera` | Névoa de incenso, poeira, brasas | Conforme a seção |
| `Pos` | Bloom, grão, aberração, vinheta | Sempre, conforme o nível de qualidade |

`Chuva`, `Rosacea` e `Pos` chegam primeiro. `Nave`, `Lancetas`, `Reliquario` e `Atmosfera` ficam em um chunk próprio, que carrega logo depois, sem segurar a pintura. A árvore GPON é SVG no DOM, por precisar de botões reais ([decisão 48](decisoes.md)).

### Renderizador

**Base:** WebGL2 com `three`, `@react-three/fiber`, `@react-three/drei` (`useGLTF`) e `@react-three/postprocessing`. É a combinação da lista do titular e a mais madura.

**Armadilha da quantização:** ela guarda escala e translação no nó do glTF. Usar só `.geometry` deixa o modelo em coordenadas normalizadas, minúsculo. `peca()` em `Nave.tsx` copia a transformação junto.

**Armadilha conhecida:** criar o `ShaderMaterial` à mão e passá-lo ao `mesh`. Passado como prop JSX, os invólucros dos uniforms são copiados e valores numéricos não chegam ao shader, enquanto vetores continuam funcionando. O teste "a chuva anima de verdade" protege contra isso.

**WebGPU/TSL:** decidido na Fase 4: **fica fora do lançamento** ([decisão 40](decisoes.md)). A chuva em GLSL com WebGL2 entregou o resultado visual, e `postprocessing` é só WebGL. Reavaliar depois, com estes critérios:

- A mesma chuva roda em WebGPU e WebGL2 a partir do mesmo código TSL.
- Bloom, grão e aberração têm qualidade equivalente, pois `postprocessing` é só WebGL.
- Testado em Chrome, Safari 26 ou mais novo, Firefox e iPhone, e o fallback funciona no Firefox para Linux.
- O bundle não cresce mais que 15%.

Sem isso, o WebGPU fica para depois do lançamento. As fontes consultadas sobre WebGPU em produção são secundárias.

### Pipeline de assets

```
scripts/blender/*.py  →  Blender headless  →  assets-3d/brutos/*.glb
*.glb  →  @gltf-transform (dedup e quantização)  →  public/gl/*.glb
```

Comando: `pnpm modelos [nave lancetas relicario]`. O Blender 5.2 fica em `~/.local/opt`, instalado sem `sudo`.

| Modelo | Triângulos | Tamanho | Gzip | Conteúdo |
|---|---|---|---|---|
| `nave.glb` | 69.550 | 964 KB | 446 KB | 26 pilares, arcadas, trifório, nervuras, piso, portal e rosácea oeste |
| `lancetas.glb` | 1.638 | 23 KB | 10 KB | Três molduras e vidro em grade |
| `relicario.glb` | 4.346 | 116 KB | 44 KB | Caixa com telhado, arcaria e pináculos, e o selo instanciado 36 vezes |

- **Geometria:** tudo gerado por código no Blender (arcos, nervuras, colunas). Sem compras de modelos prontos.
- **Luz assada por vértice, em cinza:** R = luz da abside, G = oclusão e B = luz do portal. O shader tinge pela paleta do tema, e por isso há uma bake só para os seis temas ([decisão 44](decisoes.md)).
- **Nave aberta:** sem paredes nem abóbada cheia. A chuva corre entre os pilares ([decisão 45](decisoes.md)).
- **Teto:** a pedra e as janelas obedecem ao mesmo teto de luminância da chuva. Só o portal e a rosácea oeste passam dele, e só à direita de 58% da largura, em tela de 1200 px ou mais.
- **Materiais:** pedra e luz em shader próprio. O relicário usa PBR de ouro com ambiente gerado no navegador ([decisão 52](decisoes.md)).
- **Decodificação:** só quantização, que dispensa WASM. Meshopt e KTX2 só entram se o orçamento exigir, pois pedem `wasm-unsafe-eval` na CSP ([09](09-seguranca-e-privacidade.md#política-de-conteúdo)).

### Caminho da câmera

`src/gl/nave/caminho.ts` define os quadros por `t` = seção + progresso. A posição é suavizada no quadro, e o cursor adiciona uma paralaxe pequena. Com movimento reduzido, a câmera vai direto ao ponto, sem suavização.

| Seção | A câmera |
|---|---|
| Sobre, Agora | Entra pela nave e olha à frente |
| Trajetória | Caminha 35 unidades, passando pelos pilares |
| Formação | Vê as três lancetas ao longe: a informação está no DOM |
| Competências | O olhar sobe para as nervuras |
| Certificados | Começa a se virar. O relicário gira no terço direito |
| Contato | Olha de volta para o portal aceso e para a rosácea oeste, à direita do texto |

## A chuva

Peça central do site, pedida pelo titular como "muito bem feita". É um motor próprio em shader de fragmento, sem partículas individuais.

### Atlas de glifos

`scripts/gerar-atlas.ts` gera, no build, um atlas com SDF de um canal e 128 glifos:

| Grupo | Glifos | Função |
|---|---|---|
| Hexadecimal | `0–9 A–F` | Sentido técnico |
| Katakana de meia largura | Cerca de 45 | Homenagem à chuva clássica, em conjunto próprio |
| Grego | Cerca de 30 | Ponte com a tradição bizantina |
| Glagolítico | Cerca de 30 | O primeiro alfabeto eslavo, quase nunca visto em chuvas |

Letras gregas e glagolíticas são tratadas como escrita. Elas não formam palavras sagradas, e a ordem é aleatória. A ausência de palavras precisa ser checada no gerador.

### Comportamento

Para cada coluna, um `hash(coluna)` define velocidade, comprimento da cauda, fase e profundidade.

| Elemento | Especificação |
|---|---|
| Cabeça | Cor `chuva-cabeca`, com bloom. Brilho acima de 1 para acionar o limiar |
| Cauda | Decaimento exponencial em `chuva`. Comprimento de 12 a 40 células |
| Troca de glifo | Cada célula troca em intervalo próprio, de 80 a 600 ms, com leve *flicker* |
| Velocidade | De 4 a 18 células por segundo, por coluna |
| Camadas | Três planos: perto (grande e desfocado), meio (nítido), longe (pequeno e apagado). Paralaxe com o cursor |
| Interação | O cursor abre a chuva como uma mão na água: um campo analítico no shader desloca as colunas conforme a velocidade do cursor, com retorno suave |
| Rolagem | A velocidade da rolagem altera a taxa de queda em até 2,5×, com suavização. O movimento nunca para abruptamente |
| Frase escondida | Quando parada, uma coluna central decodifica `WARLEY` por um instante. Com o coelho do CTF, mostra `siga o coelho branco` |
| Fim da página | Em Contato, a chuva cai a 15% da velocidade, quase parada |

### Rosácea e luz

A chuva cai **atrás** da rosácea. O vidro colore a luz pela técnica de vitral, em três passos:

1. **Máscara:** o rendilhado é uma textura SDF (pedra = opaca; vidro = passa luz).
2. **Vitral:** cada painel de vidro multiplica a cor da chuva por sua própria paleta do tema, em tons de ouro, fósforo e púrpura.
3. **Raios de luz:** um passo de *god rays* a partir do centro da janela lança feixes coloridos e dá volume à névoa.

No centro da rosácea, a cruz de três barras é parte fixa da pedra, conforme [04](04-direcao-criativa.md#regras-do-sagrado). A chuva nunca a atravessa em primeiro plano.

### Legibilidade sobre a cena

**O vidro não basta, pois a maior parte do texto fica direto sobre a cena.** A cena escurece onde há texto.

| Tema | Luminância máxima atrás de `tinta-2` |
|---|---|
| Ouro | 0,0561 |
| Fósforo | 0,0672 |
| Rubro | 0,0544 |
| Púrpura | 0,0554 |

**Regras**

- A rosácea fica à direita no desktop, e o texto à esquerda, na composição descentralizada de Mr. Robot. No celular, a janela fica no topo e o texto abaixo.
- **Fora do hero:** um teto de luminância no shader limita toda a cena (`uTeto`). No hero, um degradê no DOM protege a caixa do texto.
- Texto que não couber nessa regra usa `PainelVitral`.
- **Teste automático:** `tests/e2e/cena.spec.ts` esconde o texto, tira uma captura, mede a luminância em cada tema e falha se o limite for ultrapassado. Medido em 05/11/2026: Ouro 0,043; Fósforo 0,043; Rubro 0,024; Púrpura 0,027.

### Tema Pergaminho

Em fundo claro, bloom e raios de luz não funcionam. A cena muda de técnica:

- A chuva vira **tinta**: glifos pretos a no máximo 8% de opacidade, com a cabeça em cinábrio a 25%.
- A rosácea e a nave viram **gravura**: traços de contorno, sem luz, como desenho técnico medieval.
- Sem bloom, raios, brasas nem aberração. O grão vira textura de papel.
- A tela branca inverte para preto, com o W em `fundo`.

Atrás de `tinta-2`, a luminância mínima é de 0,5406.

### Pós-processamento

| Efeito | Nível alto | Nível médio | Nível baixo |
|---|---|---|---|
| Bloom | 2 passos seletivos | 1 passo | Falso, no próprio shader |
| Raios de luz | Sim | Metade da resolução | Não |
| Grão de filme (Bunnyland) | Sim | Sim | Não |
| Aberração cromática | Só em transições | Só em transições | Não |
| Vinheta | Sim | Sim | Em CSS |

## Níveis de qualidade

Definidos por uma heurística local (núcleos, memória, tipo de ponteiro) e corrigidos em execução por um controlador de quadros. O `detect-gpu` foi descartado porque busca dados em um CDN externo, o que a CSP proíbe.

| Nível | Quando | Chuva | Cena | DPR |
|---|---|---|---|---|
| **Alto** | GPU dedicada, desktop | 3 camadas, cursor | Todas | Até 2 |
| **Médio** | Integrada recente, celular topo de linha | 2 camadas | Sem Reliquário 3D | Até 1,5 |
| **Baixo** | Celular intermediário | 1 camada | Só Rosácea simplificada | Até 1,25 |
| **Mínimo** | Sem WebGL2 | Canvas 2D, 30 fps | Pôster | 1 |
| **Estático** | Economia de dados, movimento reduzido ou falha geral | Quadro parado | Pôster | — |

**Controlador:** média móvel de 60 quadros. Acima de 22 ms, reduz DPR e depois o nível. Abaixo de 14 ms por 5 s, sobe DPR, sem nunca subir de nível para não oscilar.

**Ainda economiza:** pausa com aba oculta; renderiza a 30 fps com bateria fraca, se a API existir; desativa a Atmosfera fora de foco; `dpr` reduzido durante a rolagem rápida.

**Pôster:** AVIF de cada cena, renderizado do próprio shader no build, para a transição pôster → cena ser quase invisível.

## Storyboard da rolagem

O progresso das animações do DOM vem do ScrollTrigger. O DOM nunca depende dele para ser lido.

| Seção | Fixação | O que acontece | Alternativa no celular |
|---|---|---|---|
| **Início** | 200 svh | A luz atravessa o título uma vez. Ao rolar, a câmera avança para a rosácea, há um clarão único e chegamos à nave | 120 svh |
| **Sobre** | Não | A vela segue o cursor em ponteiro fino e aquece a inicial iluminada. No fim, a tela branca com o W, em 900 ms e sem piscar | Sem vela; a tela branca é igual |
| **Agora** | Só a figura, 150 svh | O traçado da árvore se desenha na ordem real, 1:2, 1:4, 1:8. O texto continua rolando. O Divisor fica disponível | Sem fixar |
| **Trajetória** | Não | A câmera anda pela nave. Cada ano acende ao entrar, e o ano fica preso ao lado do cargo | Igual |
| **Formação** | Não | As lancetas acendem com a rolagem. Duas por inteiro, e a da FIAP até `(hoje − 02/2026) / (02/2028 − 02/2026)` | Empilhadas |
| **Competências** | Não | Fileiras entram pelo mesmo arco. Ao filtrar, as portas reais se abrem, em ouro | Igual |
| **Certificados** | Não | Relicário gira com a rolagem, e os selos do filtro atual sobem. A lista de texto é a fonte real | Só lista |
| **Contato** | Não | A chuva cai a 15% da velocidade, a câmera se vira e resta o portal aceso | Igual, sem brilho acima do teto |

**Por que sem `pin`:** seções mais altas que a tela ficariam com o fim inalcançável. A fixação usa `position: sticky` e o ScrollTrigger só lê o progresso ([decisão 46](decisoes.md)). A cena lê a rolagem a cada quadro, por conta própria ([decisão 47](decisoes.md)).

**Transições entre seções:** a câmera é contínua. A troca de luz leva de 300 a 600 ms, para acompanhar a rolagem.

**Fibra de progresso:** o fio lateral acende com `scrub: true`. Fica como elemento DOM em SVG.

### Tela branca

Evento único, disparado pela rolagem e nunca por tempo. Transição de 900 ms, sem pisca-pisca, e com o limite de três flashes por segundo da WCAG 2.3.1 respeitado. Com movimento reduzido, a página mostra o W em fundo claro sem qualquer transição.

## Microinterações

| Elemento | Comportamento | Dur. |
|---|---|---|
| Botão principal | Escala 0,97 ao pressionar; brilho de ouro no hover | 90 ms / 160 ms |
| Hover magnético | Só nos 2 botões do hero e em `Mostrar WhatsApp`, com `gsap.quickTo`; sem efeito em toque | 400 ms |
| Link de ouro | A linha sublinhada corre da esquerda para a direita | 240 ms |
| Selo de certificado | Inclinação 3D leve com o cursor; folha de ouro responde ao ângulo (GSAP) | Contínuo |
| Filtros | Reordenação com `animate` do Motion, carregado no primeiro uso | 240 ms |
| Índice | Entrada dos itens com mola, em `motion/react` | Mola |
| Trocador de tema | A chuva muda de cor em 800 ms; o DOM usa View Transition | 800 ms |
| Cursor-vela | Halo que segue com atraso, só em ponteiro fino, sem esconder o cursor nativo | Contínuo |
| Revelar WhatsApp | O número decodifica em até 400 ms | 400 ms |

Hover de lista repetida fica só na cor, para evitar ruído. Elementos que aparecem partem de `scale(0.96)` e `opacity: 0`, nunca de `scale(0)`.

## Transições de rota

Usam a View Transitions API, pelo componente `ViewTransition` do React 19.3, sem configuração no Next. Funciona com `output: "export"` e sob a CSP real, testado no Chromium. Sem suporte, a troca é imediata.

**Só links marcados animam:** o `ViewTransition` usa `default="none"`, e cada `Link` interno leva `transitionTypes={["rota"]}`. Sem isso, cada chunk carregado depois da pintura disparava uma transição, e os cliques eram engolidos enquanto ela durava ([decisão 50](decisoes.md)).

| De → para | Efeito |
|---|---|
| `/` → `/cv` | O canvas apaga em 300 ms; o texto entra com `--ease-saida` |
| `/cv` → `/` | Pôster aparece, e a cena retoma |
| Âncora → âncora | Lenis rola com `duration` proporcional, máximo de 1,2 s |

## Movimento reduzido

Com `prefers-reduced-motion: reduce`:

| Recurso | Comportamento |
|---|---|
| Lenis | Desligado, rolagem nativa |
| Trilho do hero | Vira uma tela só, sem `sticky` |
| Chuva | Quadro parado |
| ScrollTrigger | Sem fixar nem fazer scrub; a seção mostra seu estado final |
| Tela branca | Sem transição |
| Decodificação | Texto final direto |
| Paralaxe, vela, hover magnético | Desligados |
| Foco, seleção, cor de hover | Mantidos |
| Tema | Troca imediata |
| View Transitions | Desligadas |

O botão `Pausar chuva` na barra dá o mesmo controle para quem não usa a preferência do sistema.

## Orçamentos

Medidos em celular intermediário real. Ver [11-qualidade.md](11-qualidade.md#orçamentos).

| Item | Limite |
|---|---|
| Quadro no nível alto | ≤ 12 ms de GPU em desktop com integrada |
| Quadro no nível baixo | ≤ 16 ms em celular intermediário |
| Chamadas de desenho | ≤ 80 por quadro |
| Triângulos | ≤ 300 mil no alto; ≤ 60 mil no baixo |
| Texturas | ≤ 64 MB de GPU no alto; ≤ 24 MB no baixo |
| Assets do hero | ≤ 1,5 MB, depois do LCP |
| Bibliotecas 3D | ≤ 380 KB gzip, carregados depois da pintura |

## Prova de fogo

A Fase 4 começa pelo maior risco: `Chuva` + `Rosacea` + `Pos`, rodando em um celular intermediário real, com CSP estrita ativa e deploy em ambiente de testes, antes de qualquer outra cena. Se esse conjunto não atingir a meta, o projeto ajusta este documento antes de seguir.
