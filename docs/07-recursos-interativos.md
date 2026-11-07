# 07 — Recursos interativos

Especificação de tudo com que o visitante interage além de rolar. Nenhum recurso esconde informação do currículo: tudo existe também no fluxo normal da página. **Todo recurso obedece ao princípio do dado real** de [04](04-direcao-criativa.md#princípio-inegociável-todo-enfeite-técnico-mostra-um-dado-real).

**Situação:** redesign de 06/11/2026. O titular manteve terminal, CTF e som (a simulação GPON saiu em 07/11/2026), e pediu mais elementos de hardware, Kali, binário, cyber e SOC. A lógica já implementada é reaproveitada, e o visual é novo.

## Simulação GPON (removida)

Removida em 07/11/2026, a pedido do titular ([decisão 90](decisoes.md)). A árvore de fibra continua como forma 3D da chuva em Agora, em tela larga ([06](06-motion-e-webgl.md)). `Divisor.tsx`, `DivisorCarregador.tsx` e `graficos/arvore.ts` saíram do código.

## Terminal

Abre com `Ctrl/Cmd + K` ou `` ` `` e pelo botão `Terminal` da barra ou do Índice. **Sem animação ao abrir**, como orienta a skill Animate para ações de teclado. Reaproveita `src/terminal/`.

| Item | Especificação |
|---|---|
| Base | Base UI Dialog, em chunk carregado só ao abrir |
| Visual | `superficie` com `--borda` e `--sombra-flutua`, ocupando 60% da altura no desktop e a tela inteira no celular. Barra de título com o nome da sessão e a hora real |
| Prompt | Próprio, em duas linhas: a primeira com `warley.ferzion.com.br` (o endereço do site) e o caminho da seção atual (`~/agora`), a segunda com `$`. Lembra um shell de pentest sem copiar o prompt do Kali |
| Saída | `role="log"` com `aria-live="polite"` |
| Fonte | JetBrains Mono, com a paleta do tema |
| Histórico | Setas para cima e para baixo; `Tab` completa |
| Fechar | `Esc`, `sair` ou clique fora; devolve o foco ao botão |
| Dados | Lidos de `src/conteudo/`, sem duplicar texto |

### Comandos

| Comando | Resposta |
|---|---|
| `ajuda` ou `help` | Lista os comandos |
| `quemsou` ou `whoami` | Nome, cargo atual e curso atual |
| `sobre`, `agora`, `trajetoria`, `formacao` | Texto da seção correspondente |
| `competencias [area]` | Degraus de evidência, com filtro opcional |
| `certificados [area]` | Lista, com links de validação |
| `contato` | E-mail, LinkedIn, GitHub. Informa que o WhatsApp está na seção Contato |
| `cv` / `pdf` | Abre `/cv` / baixa o PDF |
| `tema [nome]` | Lista ou troca: `rubro`, `claro` e, se liberado, `fosforo` |
| `matrix` | Libera e aplica o tema Fósforo. Repetir volta ao Rubro |
| `chuva [ligar/pausar]` | Controla a chuva |
| `som [ligar/desligar]` | Controla o som |
| `seguranca` | Abre `/seguranca` |
| `cabecalhos` | Busca `HEAD /` no próprio site e mostra os **cabeçalhos reais** de segurança |
| `hexdump [secao]` | Hexdump real do texto da seção, como `xxd` |
| `hora` | Hora de Rondon do Pará e do visitante, as duas reais |
| `build` | Hash, data do build e quantidade de hashes da CSP desta rota |
| `eventos` | O registro desta sessão |
| `flags` | Progresso do CTF |
| `flag <código>` | Confere uma flag |
| `ls -a` | Lista as "pastas" das seções, com uma flag escondida |
| `limpar` ou `clear` | Limpa a tela |
| `sair` ou `exit` | Fecha |

### Respostas de personalidade

Breves, e sem afirmar experiência.

| Entrada | Resposta |
|---|---|
| `sudo <algo>` | `permissão negada. Ainda estou aprendendo.` |
| `rm -rf /` | `boa tentativa. Este site é estático e somente leitura.` |
| `<script>` | `bela tentativa. A CSP deste site já barraria isso:`, com a diretiva real lida do cabeçalho |
| `nmap`, `nikto`, `sqlmap`, `hydra` | `só com autorização escrita. Veja /seguranca.` |
| `ping <algo>` | `este terminal não sai do seu navegador.` |
| Desconhecido | `comando não encontrado: x. Digite ajuda para ver a lista.` |

**Nunca:** imitar invasão, listar arquivos falsos do servidor, simular varredura, mostrar dados do visitante ou do VPS.

## Registro da sessão

O elemento de SOC do site, **feito só com eventos reais desta visita**. É um painel recolhível no canto inferior esquerdo, aberto pelo botão `Eventos` da moldura, pelo Índice ou pelo comando `eventos`.

| Item | Especificação |
|---|---|
| Base | `aside` com `role="log"` e `aria-live="off"`. O leitor de tela lê quando o visitante abre, sem anunciar cada evento |
| Linha | Hora real (`HH:MM:SS.mmm`), tipo e descrição curta. Tipos em palavras: `info`, `ação`, `flag` |
| Aviso fixo | `Só no seu navegador. Nada é enviado.` |
| Limite | Últimos 50 eventos, só na memória da aba. Some ao fechar |

**Eventos registrados:** página carregada (com o tempo até a primeira pintura); fontes prontas; cena iniciada e o nível escolhido; nível alterado pelo controlador; tema trocado; seção visitada; terminal aberto; simulação GPON concluída; som ligado ou desligado; e-mail copiado; flag encontrada; violação de CSP, se o navegador reportar (`securitypolicyviolation`).

**Nunca registra:** IP, navegador, localização, nada digitado no terminal além do nome do comando, e nada que saia do navegador.

## Boot log

No canto inferior direito do hero, uma lista curta dos passos reais de carregamento, com os tempos medidos por `performance.now`:

```
000.000  html
000.184  fontes
000.412  cena: chunk
000.655  cena: alto
000.661  pronto
```

Nunca bloqueia: o H1 e as ações já estão na tela. Some 4 s depois de concluir e fica disponível no registro da sessão. Sem JavaScript, não aparece. Com movimento reduzido, aparece pronto, sem linha a linha.

## CTF de flags

Um jogo didático, inteiramente no navegador do visitante. Nove flags no formato `flag{...}` ficam em lugares que qualquer pessoa pode olhar sem atacar nada. Reaproveita `src/ctf/` e `scripts/gerar-selos.ts`, renomeado para `gerar-flags.ts`.

**Regra destacada no início do CTF:** `Todas as flags estão à vista no navegador. Você não precisa varrer nem atacar o servidor para jogar.`

### Onde estão

| # | Local | O que ensina |
|---|---|---|
| 1 | Comentário no HTML da página inicial | Ver código-fonte |
| 2 | Console do navegador, com arte ASCII da moldura | Ferramentas de desenvolvedor |
| 3 | `robots.txt` | Arquivo público de rastreadores |
| 4 | Cabeçalho `X-Flag` na resposta | Cabeçalhos HTTP |
| 5 | Comentário em `/.well-known/security.txt` | security.txt |
| 6 | Texto em Base64 em uma variável CSS | Codificação não é criptografia |
| 7 | Metadados do SVG das trilhas de placa | Metadados de arquivos |
| 8 | Letras da chuva, em uma coluna, quando pausada | Observação |
| 9 | `ls -a` no terminal | Enumeração básica |

### Mecânica

- As flags ficam em texto simples nos locais acima, de propósito. A fonte única é `src/ctf/flags.ts`. O bundle guarda apenas o SHA-256 de cada uma, para conferência. As flags 2 e 9 aparecem no bundle porque o local delas é o próprio JavaScript.
- Ao confirmar uma flag, uma animação Lottie curta (`lottie_light`, sem `eval`) se desenha no canto: um quadrado de flag que se preenche. O terminal não anima.
- A flag 8 só pode ser lida com WebGL: a chuva pausada mostra a palavra em uma coluna.
- Progresso em `localStorage`, sem servidor nem placar.
- Cada flag traz uma dica curta e um link de documentação (MDN, securitytxt.org).

### Recompensa

Com as nove flags, o **coelho branco** atravessa a chuva uma vez, a coluna passa a soletrar `siga o coelho branco`, e o tema **Fósforo** é liberado no trocador. A recompensa é visual, sem prêmio material nem pontuação pública, e não sugere que resolver o CTF prove competência do titular.

### Armadilhas para quem tenta explorar

Pedido do titular, implementado na fase de blindagem. Quem sonda o site atrás de falhas encontra respostas temáticas no visual do site.

| Sondagem | Resposta |
|---|---|
| `/admin`, `/wp-login.php`, `/wp-admin`, `/phpmyadmin` | Página no estilo do terminal: "Aqui não há painel. O site é estático." Com uma flag extra |
| `/.env`, `/.git/config`, `/backup.zip` | Arquivo-isca sem valor real, com um comentário bem-humorado e uma flag |
| Injeção na URL, como `?id=1' OR 1=1--` | Página temática, servida pelo nginx |
| `<script>` no terminal do site | "Bela tentativa, a CSP já barrou isso", com a diretiva real |

**Regras:** só neste domínio; sem registrar, identificar ou revidar o visitante; nada com aparência de segredo real; respostas leves, com limite de taxa, para não pesar no VPS compartilhado. Os outros sistemas do VPS seguem fora do jogo.

**Limites:** nenhuma vulnerabilidade real, nenhum desafio que dependa de chamar o servidor além de GET em arquivos públicos.

## Trocador de temas

| Item | Especificação |
|---|---|
| Local | Botão `Tema` na barra e no Índice |
| Interface | Menu com amostra de cor e nome. Fósforo aparece como `Fósforo (bloqueado)` com a dica `encontre no terminal` até ser liberado |
| Efeito | DOM com `document.startViewTransition`, se houver; a chuva muda de cor em 800 ms |
| Sem JavaScript | Tema por `prefers-color-scheme`: Rubro ou Claro |
| Persistência | `localStorage`, aplicado por script bloqueante mínimo para evitar flash |

## Som ambiente

Áudio procedural feito no navegador com Web Audio, sem arquivos nem música de terceiros. Reaproveita `src/som/motor.ts`, com timbre novo.

| Item | Especificação |
|---|---|
| Padrão | **Desligado**. Só toca depois de um clique em `Ligar som` |
| Timbre | Zumbido grave de sala de servidores: ruído rosa filtrado, um tom de ventoinha e um leve 60 Hz. Sem melodia |
| Reação | Filtro abre com a velocidade da rolagem; clique de relé curto ao abrir painéis e ao confirmar uma flag; um bipe curto em cada etapa do handshake |
| Volume | Máximo de −24 dBFS, com botão sempre visível |
| Sair | Fade de 400 ms ao desligar; suspenso com aba oculta |
| Carregamento | O código é baixado só depois do clique |

## Revelação do WhatsApp

Decisão do titular: número fora do HTML estático. **Comportamento e segurança inalterados** ([decisões 3, 27 e 41](decisoes.md)).

1. A página mostra o botão `Mostrar WhatsApp`.
2. Ao clicar, o código monta o número a partir de partes guardadas no chunk carregado só nesse momento.
3. O botão vira um link `https://wa.me/...`, e o número aparece decodificando em 400 ms, ou de imediato com movimento reduzido.
4. O foco passa para o novo link, com `aria-live` anunciando o número.

- O número vem de `WHATSAPP_NUMERO`, do `.env` local, e **nunca é escrito no código-fonte ou nos documentos**.
- No build, as partes são embaralhadas e ficam em um chunk separado. Sem a variável, o botão não aparece.
- O telefone completo não pode aparecer em HTML, JSON-LD, PDF, sitemap, mapas de código-fonte, metadados, terminal nem no registro da sessão. O verificador do build busca o número em todos os formatos.

**O que isso garante:** barra robôs simples. Um robô dedicado ainda consegue o número, e o site não promete proteção total.

## Modo direto

O botão `Currículo` leva a `/cv` e está disponível em toda a página inicial. É a saída para quem não quer a experiência, e nunca é tratado como versão inferior.

## Selo de build

No rodapé, uma faixa binária com os bits do hash do commit. Em `/seguranca`, um código de barras do mesmo hash, com o hash em texto. O visitante pode compará-lo ao repositório, caso seja público.

## Easter eggs

| Gatilho | Efeito | Limite |
|---|---|---|
| Sequência Konami | Todas as colunas da chuva ficam com a cabeça em branco-quente por 20 s | Sem som, sem flash |
| `console.log` da abertura | Arte ASCII da moldura, assinatura, convite ao CTF e link para o currículo | Curto |
| `view-source:` | Comentário com arte ASCII das trilhas de placa e uma flag | Sem dados pessoais |
| `humans.txt` | Créditos, stack e apoio da IA | Só fatos |

## Recursos analisados e deixados de fora

| Recurso | Motivo |
|---|---|
| Painel de NOC ou SOC com métricas | Só faria sentido com dados reais, que não existem. O registro da sessão cumpre o papel com eventos verdadeiros |
| Mapa de ataques ao vivo | Dados de terceiros ou inventados, e estética de filme |
| Exibir IP, navegador ou local do visitante | Privacidade, e soaria como ameaça |
| Foto de fundo no hero | A chuva é a imagem. Foto do titular pode entrar em Sobre, se ele fornecer |
| Reconhecimento de voz ou câmera | Pede permissões e entrega pouco |
| Formulário de contato | Exige backend em um site estático. E-mail e LinkedIn resolvem |
| Chat com IA | Risco de afirmar algo falso sobre o titular |
