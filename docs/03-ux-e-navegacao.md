# 03 — UX e navegação

Como o visitante encontra o que precisa, em qualquer aparelho e condição. Modo da skill Impeccable para a página inicial: Experience. `/cv` e `/seguranca` usam modo Read.

## Mapa do site

| Rota | Função | Com WebGL | Indexada |
|---|---|---|---|
| `/` | Experiência completa com as seções | Sim | Sim |
| `/cv` | Currículo direto e imprimível | Não | Sim |
| `/seguranca` | Controles reais do site, regras e privacidade | Leve (chuva lenta) | Sim |
| `/sistema` | Design system público | Amostras | Sim |
| `/404` | Página não encontrada | Chuva lenta | Não |
| `/offline` | Página sem conexão, servida pelo service worker | Não | Não |
| `/curriculo-warley-ferraz-almeida.pdf` | PDF público, sem telefone | — | Sim |
| `/.well-known/security.txt` | Contato para relatos de segurança | — | — |
| `/robots.txt`, `/sitemap.xml`, `/humans.txt`, `/sbom.json` | Arquivos públicos | — | — |

Reservadas para o futuro: `/obras` e `/obras/[slug]`, descritas em [13-projetos-futuros.md](13-projetos-futuros.md).

**Idiomas:** `/` e as demais rotas sem prefixo são pt-BR, idioma principal. Cada outro idioma repete as rotas com prefixo: `/en`, `/es`, `/de`, `/fr`. O seletor fica na barra e no Índice, leva à mesma página no idioma escolhido e nunca redireciona sozinho pelo navegador do visitante.

## Seções da página inicial

A ordem vem dos dados, nunca escrita à mão. Ela aparece só na régua da moldura, e não como número ao lado do título ([04](04-direcao-criativa.md#revisão-contra-marcas-de-ia)). Os nomes poéticos de margem saíram com o redesign ([decisão 62](decisoes.md)).

| Rótulo | Forma da seção | Âncora |
|---|---|---|
| Início | Nome, cargo e ações | `#inicio` |
| Sobre | Ficha com hexdump | `#sobre` |
| Agora | Atividades e ferramentas | `#agora` |
| Trajetória | Traceroute | `#trajetoria` |
| Formação | Blocos de carga horária | `#formacao` |
| Competências | Degraus de evidência | `#competencias` |
| Certificados | Registro em tabela | `#certificados` |
| Projetos | A definir na ativação | `#obras`, oculta |
| Contato | Handshake e ações | `#contato` |

## Navegação

**Barra fixa no desktop, em vidro líquido** ([05](05-design-system.md#vidro-só-na-navegação)): nome à esquerda; rótulos das seções ao centro, com a atual em `sinal`; `Currículo`, `Tema`, `Pausar chuva` e `Terminal` à direita. Fica sem fundo durante o hero e ganha `superficie` depois dele. Fica dentro da moldura, abaixo da faixa do identificador e da hora.

**Telas abaixo de 1180 px** (a barra cabe a partir daí, conferido em 1180, 1200, 1280 e 1440): nome, `Currículo` e `Índice`. O `Índice` abre uma tela inteira com a lista das seções, os temas, a chuva, o som, o registro da sessão e o terminal.

**Moldura e régua:** a [moldura de instrumento](05-design-system.md#moldura-de-instrumento-hud) mostra dados reais nos cantos. A régua na borda direita é o indicador de progresso: desce com a rolagem, e clicar em um traço de seção leva até ela. Duplica uma navegação real.

**Atalhos de teclado**

| Tecla | Ação |
|---|---|
| `Tab` | Percorre a ordem do DOM; o primeiro item é `Pular para o conteúdo` |
| `Ctrl/Cmd + K` ou `` ` `` | Abre o terminal, fora de campos de texto |
| `Esc` | Fecha o terminal ou o índice |
| Setas ou `J`/`K` | Só dentro de componentes, como filtros e terminal |

Sem sequestro de rolagem. Lenis suaviza, mas a roda, o trackpad, o teclado e o toque sempre movem a página.

## Fluxos

### Recrutador, 30 segundos

1. Abre o link. Nome, cargo e estudo aparecem antes de qualquer animação.
2. Clica em `Ver currículo` ou rola até Agora.
3. Baixa o PDF ou clica em `Falar comigo`.

**Requisito:** nenhum desses passos espera um carregamento, uma introdução ou uma rolagem presa. O hero nunca bloqueia a página.

### Líder técnico, 3 minutos

1. Lê Sobre e encontra "O que ainda não tenho".
2. Filtra Competências por Segurança ou Redes.
3. Abre a validação de um certificado.
4. Vai a `/seguranca`, confere os cabeçalhos e o `security.txt`.
5. Abre o terminal ou o código-fonte e talvez encontre uma flag.

### Júri, 5 a 10 minutos

1. Rola a experiência inteira no desktop.
2. Troca de tema, liga o som, abre o terminal e o registro da sessão.
3. Abre no celular.
4. Vê `/sistema` e `/seguranca`.

### Visitante com movimento reduzido

Recebe a composição final de cada seção, sem parallax, chuva em quadro parado e nenhum elemento fixado. Veja a [tabela completa](06-motion-e-webgl.md#movimento-reduzido).

### Visitante sem WebGL ou sem JavaScript

Recebe o pôster estático nas seções com cena. As formas das seções (traceroute, régua de formação, degraus) são SVG e HTML, e continuam lá. Sem JavaScript, tudo continua legível, com filtros mostrando todos os itens. O número de WhatsApp fica indisponível, e e-mail e LinkedIn funcionam.

## Hero: ordem de carregamento

| Momento | O que acontece | Meta |
|---|---|---|
| Primeiro byte | HTML com H1, cargo, ações, moldura e pôster em CSS | |
| Fontes | Mona Sans com preload; JetBrains Mono depois | Sem deslocamento de layout |
| Pintura principal | O H1 é o elemento do LCP | ≤ 2,5 s no celular intermediário |
| Ocioso | Baixa a cena no fundo, depois da primeira pintura | Sem bloquear o INP |
| Cena pronta | A chuva aparece sobre o pôster, com transição de 600 ms, e trava no nome. O boot log registra cada passo | Sem mudança de layout |

Sem tela de carregamento. Se a cena demorar, o pôster continua, e o visitante já pode rolar.

## Responsividade

| Largura | Mudanças |
|---|---|
| ≥ 1280 px | Moldura completa nos quatro cantos, cena completa, forma da seção à direita |
| 768 a 1279 px | Moldura completa; forma da seção abaixo do texto; fixações mais curtas |
| < 768 px | Coluna única; moldura com dois cantos; `Índice`; cena de nível baixo por padrão; traceroute vertical; degraus em coluna única; formas da chuva só no hero; hexdump em faixa |
| Paisagem baixa | Sem seções fixadas |
| Toque | Efeitos de hover têm alternativa e nunca condicionam a leitura |

Testar em 360, 390, 768, 1024, 1440 e 2560 px, além de zoom de 200%.

## Estados

| Componente | Estado | Comportamento |
|---|---|---|
| Filtros | Sem resultado | Impossível com os dados atuais. Se ocorrer: `Nenhum item nesta área.` e botão `Limpar filtro` |
| Filtros | URL inválida | Ignora o filtro e mostra todos |
| Certificados | Sem validação | Só emissor e data |
| Copiar e-mail | Sucesso | `E-mail copiado`, com `aria-live="polite"` |
| Copiar e-mail | Falha | `Não foi possível copiar. O e-mail é warley.ferraz.wf@gmail.com.` |
| Cena | Contexto WebGL perdido | Volta ao pôster e tenta recriar uma vez |
| Som | Áudio bloqueado | Botão desliga e mostra `Som indisponível neste navegador` |
| Terminal | Sem JavaScript | Oculto, sem atalho exibido |
| PDF | Baixar | Link direto, sem aviso |

## Acessibilidade

Detalhes de teste em [11-qualidade.md](11-qualidade.md#acessibilidade).

- HTML semântico: um `h1` por rota, ordem correta de títulos, `main`, `nav`, listas reais.
- Tudo o que o WebGL mostra existe em texto.
- A moldura, a régua e os dados decorativos não atrapalham: o que duplica informação fica com `aria-hidden`, e o rótulo claro é o nome acessível.
- `lang="pt-BR"`; termos em inglês com `lang="en"` quando forem frases.
- O nome e os títulos ficam sempre em texto real, inclusive durante a decodificação e a mudança de largura, nunca em imagem ou só no canvas.
- Animações automáticas com mais de 5 segundos têm controle de pausa: a chuva tem botão `Pausar chuva` na barra.
- Som nunca começa sozinho.

## Conteúdo sem depender da aparência

A página continua compreensível se o CSS falhar. Teste obrigatório: desligar CSS e JavaScript, e ler a página inteira em sequência lógica.

## Estado salvo

| Dado | Onde | Padrão |
|---|---|---|
| Tema | `localStorage: tema` | Rubro, ou Claro se `prefers-color-scheme: light`. Fósforo só depois de liberado |
| Som | `localStorage: som` | Desligado |
| Chuva pausada | `localStorage: chuva` | Ligada, salvo movimento reduzido |
| Flags do CTF e Fósforo liberado | `localStorage: flags` | Vazio |
| Registro da sessão | Memória da aba | Vazio. Some ao fechar |
| Filtros | URL | Sem filtro |
| Idioma | URL | pt-BR |

Nada disso vai para um servidor. O uso de `localStorage` é restrito a preferências e flags, sem identificar o visitante.
