# 04 — Direção criativa

O que o conceito **Sinal** é, de onde vem cada decisão visual e onde estão os limites. Em conflito com recomendações genéricas de design, este documento vence, na ordem de [14](14-stack.md#quando-as-orientações-discordam).

**Origem:** redesign completo pedido pelo titular em 06/11/2026 ([briefing](00-briefing.md#pedido-de-redesign-06112026)). O conceito anterior, Nave Digital, foi descartado inteiro, com todas as suas referências ([decisão 56](decisoes.md)). Nome do conceito provisório, a confirmar pelo titular.

## O objetivo visual

Quem abre o site, sem ler uma palavra, precisa concluir: **essa pessoa é boa com tecnologia.** Redes, infraestrutura e cibersegurança têm de estar na forma, no movimento e nos detalhes, e não só no texto. O site é usado ao longo de 2027 inteiro, então precisa surpreender na primeira visita e continuar sólido na décima.

## A ideia

**O ruído vira sinal.**

O trabalho do titular é achar o sinal no meio do ruído. No NOC, é a anomalia entre milhares de métricas do Zabbix e do Grafana. Em segurança, é o evento que importa entre milhares de linhas de log. Em redes, é a luz que atravessa a fibra e chega inteira à casa do cliente.

A tela é um campo de glifos vermelhos caindo, a chuva. Ao rolar, esse ruído se organiza em formas com sentido: o nome, a fibra se dividindo, o caminho até o NOC, os anéis de evidência, o handshake do contato. **O visitante vê ordem surgindo do caos, e é exatamente isso que o titular faz no trabalho.**

## Luz vermelha de operação

O vermelho daqui é o de uma sala de operações à noite: instrumentos em modo noturno, LEDs de rack, o alarme que acende no painel, o laser de uma fibra. É **material de luz**, e não um acento de interface sobre preto.

Por isso o vermelho é uma **rampa tonal inteira**: do sangue quase preto das superfícies ao carmim das formas, ao vermelho de sinal da interface, até o branco-quente da cabeça da chuva. Uma tela inteira em vermelho, com profundidade, é uma escolha. Um acento vermelho isolado sobre preto é um padrão comum de página feita em série, e fica de fora ([revisão](#revisão-contra-padrões-genéricos)).

## Princípio inegociável: todo enfeite técnico mostra um dado real

É o que separa um profissional de uma fantasia de hacker. Réguas, coordenadas, relógios, hashes, logs e diagramas só existem quando mostram algo verdadeiro e conferível.

| Elemento | Dado real que ele mostra |
|---|---|
| Cantos da moldura | A seção atual e a rolagem, em pixels; FPS, nível de qualidade e tema |
| FPS e nível de qualidade | Os da máquina do visitante, medidos pelo controlador de quadros |
| Boot log do hero | Os passos de carregamento desta visita, com os tempos de `performance.now` |
| Hexdump de Sobre | O UTF-8 do parágrafo ao lado, calculado no build |
| Faixa binária e código de barras | O hash do build |
| Fingerprint de certificado | O SHA-256 do registro do curso, calculado no build |
| Registro da sessão | Os eventos que de fato aconteceram nesta visita, só no navegador |
| Tempo no cargo, estudo desde 2022, % da FIAP | Calculados das datas de `src/conteudo/` |
| Cabeçalhos no terminal | Os cabeçalhos reais da resposta do próprio site |

**Proibido, sem exceção:** alerta falso, IP falso, "invasão" ou varredura simulada, contador inventado, gráfico de métrica sem fonte, dado do VPS e dado do visitante, incluindo o IP. Se não houver dado real, o elemento não existe.

Isso também vale para a veracidade de [01](01-veracidade-e-fontes.md): **um efeito visual nunca vira competência.** Um feed com estética de SOC mostra eventos da visita e jamais sugere experiência profissional em SOC.

## Referências

O titular pediu poucas referências. Cada uma entra como linguagem própria, sem copiar imagem, logo, personagem ou fonte oficial.

| Referência | O que levamos | Onde aparece | O que fica de fora |
|---|---|---|---|
| **Matrix** | Chuva de glifos, decodificação de texto, cabeça incandescente da coluna, "siga o coelho branco" | Cena inteira, títulos, CTF, tema Fósforo | Logo, tipografia e conjunto exato de glifos do filme; glifos espelhados |
| **Vermelho e vermelho-escuro** | Rampa tonal de luz vermelha de operação | Paleta Rubro, chuva, cena | Vermelho como "sangue" ou terror |
| **Hardware** | Trilhas de placa de circuito, LEDs de rack, fibra e conectores, die de processador | Fundos de seção, cena B, Formação, Competências | Fotos e marcas de fabricantes |
| **Kali e pentest** | As ferramentas reais dos laboratórios (Kali, Nmap, Wireshark, Burp Suite) como texto, prompt de terminal em duas linhas | Competências, terminal | Logo do dragão, imitação da identidade visual do Kali, prompt copiado |
| **Binário e baixo nível** | Hexdump, offsets, bits do hash, endereços | Sobre, rodapé, `/seguranca` | Binário decorativo sem significado |
| **Cyber e SOC** | Fila de eventos com carimbo de hora, linguagem de escopo e autorização, CSP real | Registro da sessão, `/seguranca`, CTF | Alertas inventados, qualquer sugestão de experiência em SOC |
| **Redes** | Topologia GPON, traceroute, handshake TCP, pacotes | Agora, Trajetória, Contato | Dados de qualquer rede real |

## Inventário do tema

Itens que pertencem a este titular e a mais ninguém, usados como fonte de composição:

1. **Fibra óptica e GPON:** luz em vidro, OLT, divisores 1:N e ONUs. O trabalho diário dele.
2. **NOC remoto:** monitorar uma rede de casa, longe dos grandes centros.
3. **Do caixa ao NOC:** dez empregos com data. Um traceroute de dez saltos até o destino.
4. **Estudo formal desde 2022:** UNIASSELVI (2.600 h), pós em DevOps (420 h), FIAP até 02/2028.
5. **Servidores próprios:** Ubuntu, Nginx, Docker, deploy com rollback. O próprio site é prova disso.
6. **Laboratórios de segurança:** Hack The Box, TryHackMe, PortSwigger. Treino declarado, sem cargo.
7. **Certificados verificáveis:** 36, com link oficial de validação.
8. **O próprio site como prova:** CSP real, cabeçalhos reais, SBOM, contêiner sem privilégios.

## Hierarquia de atenção

O site é **rico**, como pediu o titular. A riqueza está na **camada de instrumento**: moldura com dados, microtipografia, trilhas de placa, registro da sessão. Cada seção tem **um único momento autoral** ([tabela](#tom-visual-por-seção)), e o hero recebe o maior orçamento de impacto.

Densidade no detalhe, nunca empilhamento de efeitos. Dois momentos grandes nunca disputam a mesma tela.

## Regras de composição

- **O conteúdo é a base, e a cena é camada.** Todo fato vive no HTML. O WebGL decora, com `aria-hidden`.
- **Formas próprias por seção.** Ficha com hexdump, traceroute, régua de carga horária, degraus de evidência, registro de certificados, handshake. Sem carrossel nem cards iguais.
- **Alinhamento à esquerda, com a cena à direita** no desktop. No celular, a forma da seção fica acima ou atrás do texto, sempre abaixo do teto de luminância.
- **Escala com contraste extremo:** um tipo muito grande (o nome, os títulos) e um pequeno (dados), com pouco no meio.
- **Linhas só onde medem algo.** Réguas, eixos, fios de topologia. Sem grade decorativa.
- **Monoespaçada só em dado real:** hora, hash, código, comando, offset, endereço.
- **Brilho só em luz emitida pela cena.** A interface parada não brilha.
- **Interface do navegador na paleta:** seleção, cursor de texto, barra de rolagem, foco e numerais.

## Tom visual por seção

| Seção | Forma no DOM | Momento único |
|---|---|---|
| Início | Nome enorme em largura expandida, cargo, estudo e ações à esquerda | Os glifos da chuva travam e formam o nome. A moldura liga com o boot log real |
| Sobre | Ficha em duas colunas: texto e hexdump do próprio texto | O offset do hexdump acompanha a linha em leitura |
| Agora | Atividades e ferramentas; a árvore de fibra é a forma da chuva, em tela larga | A luz percorre a fibra: 1:2, 1:4, 1:8 |
| Trajetória | Traceroute com dez saltos, o último no NOC | Um pacote anda de salto em salto com a rolagem |
| Formação | Blocos proporcionais à carga horária real | Os blocos se preenchem. A FIAP vai até a fração de tempo decorrido |
| Competências | Quatro degraus de evidência | O peso cai no tamanho e no tom do texto; filtrar por área esconde o que não casa |
| Certificados | Registro em tabela, com código e link oficial | As linhas do filtro mostram o fingerprint em sequência |
| Contato | Ações de contato | Handshake TCP: SYN, SYN-ACK, ACK, e as ações acendem |

Detalhes de cada momento em [06](06-motion-e-webgl.md#storyboard-da-rolagem).

## A cena: tudo é código

O titular comparou duas direções em 07/11/2026 e escolheu **"Tudo é código"**: uma única grade de glifos cobre a tela, e os objetos 3D são desenhados pela própria chuva, em contorno de traços de caixa. A alternativa com modelos 3D convencionais foi descartada e removida ([decisão 81](decisoes.md)). Especificação técnica em [06](06-motion-e-webgl.md#as-formas-das-seções).

## Os três temas

| Tema | Base | Chuva | Como se chega |
|---|---|---|---|
| **Rubro** (padrão) | Preto avermelhado, rampa de vermelhos, tinta clara | Vermelha, cabeça branco-quente | Padrão |
| **Claro** | Papel frio, tinta escura, vermelho profundo | Tinta a 8%, cabeça em vermelho | `prefers-color-scheme: light`, trocador e impressão de `/cv` |
| **Fósforo** | Preto esverdeado e verde | Verde, a homenagem direta a Matrix | Escondido. Liberado pelo comando `matrix` no terminal ou pelo CTF completo |

Valores e contraste em [05](05-design-system.md#os-três-temas).

## Anti-referências

Se o resultado lembrar qualquer um destes, está errado:

- Template de portfólio "hacker" com terminal verde em tela cheia.
- Painel de SaaS escuro com cards e gráficos de barras cinza.
- Painel falso de NOC ou SOC com números inventados.
- Glitch permanente, ruído que atrapalha a leitura, texto que treme.
- Filme de ação: caveira, capuz, cadeado gigante, "ACCESS GRANTED".
- Todos os efeitos ligados na mesma tela.

## Limites

- Sem logos, personagens ou identidades de terceiros: Matrix, Kali, fabricantes, plataformas de CTF.
- Sem iconografia religiosa. Texto em linguagem neutra, como prefere o titular ([decisão 34](decisoes.md)).
- Sem caveira, sangue, armas ou estética de ameaça. Vermelho é luz de operação.
- Sem flashes acima de três por segundo (WCAG 2.3.1), inclusive na troca de tema e nas decodificações.

## Revisão contra padrões genéricos

O plano é conferido contra os padrões que fazem uma página parecer feita em série. Fundo quase preto com um único acento vermelho é um deles, e aqui ele vem do pedido do titular. Por isso o vermelho é uma rampa inteira de luz, e não um acento.

| Padrão comum | Decisão aqui |
|---|---|
| Preto com um acento vermelho ou verde neon | Rampa tonal inteira em vermelho, com profundidade de superfícies |
| Etiqueta em caixa alta acima de cada título | Eliminada. A posição da seção vive na barra de navegação |
| Numeração 01/02/03 como enfeite | Só onde a sequência é real: os saltos do traceroute |
| Monoespaçada para parecer técnico | Só em dado real. A tipografia de leitura é a grotesca |
| Réguas, cruzes de mira e grade como figurino | Só quando medem algo real ([princípio](#princípio-inegociável-todo-enfeite-técnico-mostra-um-dado-real)) |
| Cards iguais com ícone | Eliminados. Cada seção tem forma própria |
| Vidro e desfoque como enfeite | Só na navegação, a pedido do titular (vidro líquido). O resto usa superfícies opacas em degraus de tom |
| Métrica grande com legenda | Só números reais com função: horas de curso, tempo decorrido |
| Gradiente em texto, palavra destacada em cor | Eliminados |
| Seta em botão, ponto médio entre metadados | Eliminados |
