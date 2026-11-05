# 07 — Recursos interativos

Especificação de tudo com que o visitante interage além de rolar. Nenhum recurso esconde informação do currículo: tudo existe também no fluxo normal da página.

## O Divisor

**A coisa viva do site.** Fica na seção Agora e torna a ideia central palpável: luz atravessando vidro.

**Experiência:** o visitante toca na OLT para lançar a luz. Tocar em um nó aceso divide a luz para os dois filhos. Tocar em um filho ainda apagado leva a luz só por aquele ramo. Depois de 1:2, 1:4 e 1:8, cada ONU atingida acende um painel da pequena rosácea no canto do desenho. Com as oito acesas, a janela fica completa e a cor dela passa à chuva daquela seção.

| Requisito | Especificação |
|---|---|
| Honestidade | Sempre com a legenda `Desenho ilustrativo. Sem dados de nenhuma rede real.` Nada de números de potência, clientes ou alarmes |
| Polegar | Alvos de 44 px de altura, sem arrastar. Abaixo de 480 px de largura, os nós folha ficam com 32 px de largura, pois oito não cabem de outro modo |
| Teclado | Tab ou setas movem o foco entre os nós, Enter envia a luz |
| Leitor de tela | `role="group"`, com o nome "Simulação da divisão de luz em uma rede GPON". Anúncio: "Painel 3 de 8 aceso" |
| Sem JavaScript | Diagrama estático em SVG, com a explicação em texto |
| Movimento reduzido | Sem pulso em movimento; a ONU acende na hora |
| Duração | Leva cerca de 15 segundos e pode ser ignorado |
| Estado | Fica salvo só na sessão |

## Terminal

Abre com `Ctrl/Cmd + K` ou `` ` `` e pelo botão `Terminal` da barra ou do Índice. **Sem animação ao abrir**, como orienta a skill Animate para ações de teclado.

| Item | Especificação |
|---|---|
| Base | Base UI Dialog, em chunk carregado só ao abrir |
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
| `sobre` | Texto de Sobre |
| `agora` | Cargo atual e atividades |
| `trajetoria` | Lista de experiências |
| `formacao` | Cursos e situação |
| `competencias [area]` | Fileiras, com filtro opcional |
| `certificados [area]` | Lista, com links de validação |
| `contato` | E-mail, LinkedIn, GitHub. Informa que o WhatsApp está na seção Contato |
| `cv` | Abre `/cv` |
| `pdf` | Baixa o PDF |
| `tema [nome]` | Lista ou troca os temas: `ouro`, `fosforo`, `rubro`, `purpura`, `pergaminho` |
| `chuva [ligar/pausar]` | Controla a chuva |
| `som [ligar/desligar]` | Controla o som |
| `seguranca` | Abre `/seguranca` |
| `cabecalhos` | Busca `HEAD /` no próprio site e mostra os **cabeçalhos reais** de segurança |
| `selos` | Progresso do CTF |
| `selo <código>` | Confere um selo |
| `ls -a` | Lista as "pastas", com um selo escondido |
| `limpar` ou `clear` | Limpa a tela |
| `sair` ou `exit` | Fecha |

### Respostas de personalidade

Breves, e sem afirmar experiência.

| Entrada | Resposta |
|---|---|
| `sudo <algo>` | `permissão negada. Ainda estou aprendendo.` |
| `rm -rf /` | `boa tentativa. Este site é estático e somente leitura.` |
| `<script>` | `bela tentativa. A CSP deste site já barraria isso:`, com a diretiva real lida do cabeçalho |
| `nmap` | `só com autorização. Veja /seguranca.` |
| `matrix` | Muda para o tema Fósforo por 10 segundos |
| Desconhecido | `comando não encontrado: x. Digite ajuda para ver a lista.` |

**Nunca:** imitar invasão, listar arquivos falsos do servidor, simular varredura ou mostrar dados do visitante.

## CTF: os nove selos

Um jogo didático, inteiramente no navegador do visitante. Nove selos ficam em lugares que qualquer pessoa pode olhar sem atacar nada.

**Regra destacada no início do CTF:** `Todos os selos estão à vista no navegador. Você não precisa varrer nem atacar o servidor para jogar.`

### Onde estão

| # | Local | O que ensina |
|---|---|---|
| 0 | Comentário no HTML da página inicial | Ver código-fonte |
| 1 | Console do navegador, com arte ASCII | Ferramentas de desenvolvedor |
| 2 | `robots.txt` | Arquivo público de rastreadores |
| 3 | Cabeçalho `X-Selo` na resposta | Cabeçalhos HTTP |
| 4 | Comentário em `/.well-known/security.txt` | security.txt |
| 5 | Texto em Base64 em uma variável CSS | Codificação não é criptografia |
| 6 | Metadados do SVG de um ornamento | Metadados de arquivos |
| 7 | Letras da chuva, em uma coluna, quando pausada | Observação |
| 8 | `ls -a` no terminal | Enumeração básica |

### Mecânica

- Os selos ficam em texto simples nos locais acima, de propósito, e a fonte única é `src/ctf/selos.ts`. O bundle guarda apenas o SHA-256 de cada um (`pnpm selos`), para conferência. Os selos 1 e 8 aparecem no bundle porque o local deles é o próprio JavaScript.
- Um sigilo em Lottie (`lottie_light`, sem `eval`) se desenha no canto ao confirmar um selo, fora do terminal, que não anima. Os nove arquivos saem de `pnpm lottie`.
- O selo 7 só pode ser lido com WebGL. A chuva pausada mostra a palavra em uma coluna à esquerda da rosácea.
- Progresso em `localStorage`, sem servidor nem placar.
- Cada selo traz uma dica curta e um link de documentação (MDN, securitytxt.org).

### Recompensa

Com os nove selos, o **coelho branco** atravessa a tela uma vez, a coluna da chuva passa a soletrar `siga o coelho branco`, e o terminal cita a maçã em texto. A recompensa é visual, sem prêmio material, pontuação pública nem cruz. Libera o sexto tema: **Selado**, uma variante do tema Ouro em que a rosácea fica totalmente acesa.

### Armadilhas para quem tenta explorar

Pedido do titular, implementado na fase final de blindagem. Quem sonda o site atrás de falhas encontra respostas temáticas, em vez de uma página de erro comum.

| Sondagem | Resposta |
|---|---|
| `/admin`, `/wp-login.php`, `/wp-admin`, `/phpmyadmin` | Página temática: "Aqui não há painel. O site é estático." Com um selo extra |
| `/.env`, `/.git/config`, `/backup.zip` | Arquivo-isca sem valor real, com um comentário bem-humorado e um selo |
| Injeção na URL, como `?id=1' OR 1=1--` | Página temática, servida pelo nginx |
| `<script>` no terminal do site | "Bela tentativa, a CSP já barrou isso", mostrando a diretiva real |
| Cabeçalhos e `robots.txt` | Pistas falsas assumidas como brincadeira |

**Regras:** só neste domínio; sem registrar, identificar ou revidar o visitante; nada com aparência de segredo real; respostas leves, com limite de taxa, para não pesar no VPS compartilhado. O convite do CTF continua: ninguém precisa varrer o servidor para jogar, e os outros sistemas do VPS seguem fora do jogo.

**Limites:** nenhuma vulnerabilidade real, nenhum desafio que dependa de chamar o servidor além de GET em arquivos públicos, e nenhuma sugestão de que resolver o CTF prove competência do titular.

## Trocador de temas

| Item | Especificação |
|---|---|
| Local | Botão `Tema` na barra e no Índice |
| Interface | Menu com amostra de cor e nome |
| Efeito | DOM com `document.startViewTransition`, se houver; a chuva muda de cor em 800 ms |
| Sem JavaScript | Tema por `prefers-color-scheme` |
| Persistência | `localStorage`, aplicado por script bloqueante mínimo para evitar flash |

## Som ambiente

Áudio procedural feito no próprio navegador com Web Audio, sem arquivos nem música de terceiros.

| Item | Especificação |
|---|---|
| Padrão | **Desligado**. Só toca depois de um clique em `Ligar som` |
| Timbre | Bordão grave em quinta justa, com reverberação longa, lembrando uma nave vazia. Cantochão, nenhum |
| Reação | Filtro abre levemente com a velocidade da rolagem; clique discreto ao abrir portas |
| Volume | Máximo de −24 dBFS, com botão sempre visível |
| Sair | Fade de 400 ms ao desligar; suspenso com aba oculta |
| Carregamento | O código é baixado só depois do clique |

## Revelação do WhatsApp

Decisão do titular: número fora do HTML estático.

**Comportamento**

1. A página mostra o botão `Mostrar WhatsApp`.
2. Ao clicar, o código monta o número a partir de partes guardadas no chunk carregado só nesse momento.
3. O botão vira um link `https://wa.me/...`, e o número aparece decodificando em 400 ms, ou de imediato com movimento reduzido.
4. O foco passa para o novo link, com `aria-live` anunciando o número.

**Especificação**

- O número vem da variável de build `WHATSAPP_NUMERO`, do `.env` local, e **nunca é escrito no código-fonte ou nos documentos**. Assim, ele não vaza se o repositório for público.
- No build, as partes são embaralhadas por uma chave simples e ficam em um chunk separado, com import dinâmico. Sem a variável, o botão não aparece.
- O telefone completo não pode aparecer em HTML, JSON-LD, PDF, sitemap, mapas de código-fonte, metadados nem no terminal. O verificador do build busca o número em todos os formatos ([01](01-veracidade-e-fontes.md#automação)).
- Sem JavaScript, o botão não aparece.

**O que isso garante:** barra robôs simples, que não executam JavaScript nem clicam. Um robô dedicado ainda consegue o número, e o site não promete proteção total.

## Cursor-vela

Um halo quente segue o cursor em ponteiro fino, na seção Sobre e em Contato. **O cursor nativo continua visível**, e o texto mantém contraste total sem o halo: a vela aquece o que já é legível.

## Folha de ouro

No DOM, gradiente em `background-clip: text` só para a inicial iluminada da abertura de Sobre, com o tom alterado por uma variável que acompanha o cursor. Sem suporte, a letra fica em `acento`. Respeita a regra de legibilidade da letra gótica. Não é aplicado a títulos normais, para não virar gradiente decorativo.

## Modo direto

O botão `Currículo` leva a `/cv` e está disponível em toda a página inicial. É a saída explícita para quem não quer a experiência, e nunca é tratado como versão inferior.

## Selo de build

No rodapé de `/seguranca`, um código de barras gerado do hash do commit, com o hash em texto. O visitante pode compará-lo ao repositório, caso seja público.

## Easter eggs

| Gatilho | Efeito | Limite |
|---|---|---|
| Sequência Konami | A rosácea acende totalmente por 20 s | Sem som |
| `console.log` da abertura | Assinatura, convite ao CTF e link para o currículo | Curto |
| `view-source:` | Comentário com arte ASCII do rendilhado e um selo | Sem dados pessoais |
| `humans.txt` | Créditos, stack e apoio da IA | Só fatos |

## Recursos analisados e deixados de fora

| Recurso | Motivo |
|---|---|
| Foto de fundo no hero | A chuva é a imagem. Foto do titular é opcional e entra em Sobre, se ele fornecer |
| Reconhecimento de voz ou câmera | Pede permissões e entrega pouco |
| Formulário de contato | Exige backend, e o site é estático. E-mail e LinkedIn resolvem. Pode ser reavaliado |
| Chat com IA | Risco de afirmar algo falso sobre o titular |
| Painel de NOC em tempo real | Só faria sentido com dados reais, que não existem |
