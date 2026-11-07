# 00 — Briefing

O que o titular pediu, para quem o site existe e como saberemos que deu certo. Em caso de dúvida sobre intenção, este documento prevalece sobre os demais.

## Em uma frase

Um portfólio em `https://warley.ferzion.com.br` que seja referência de design em 2027 e diga a verdade sobre um profissional de redes que está começando em cibersegurança.

## Pedido de redesign (06/11/2026)

O titular publicou a primeira versão em 05/11/2026, avaliou e não gostou do design: "achei muito tosco", "ficou horrível". Pediu para **refazer do zero tudo o que é design** e **esquecer completamente as referências** passadas antes. Ficam os dados, a stack, as tecnologias e o uso das skills. Este pedido prevalece sobre as seções mais antigas deste documento no que diz respeito a design.

| Requisito | Palavras ou sentido do pedido |
|---|---|
| Escopo | "Refazer completamente o design system, o projeto de design, tudo relacionado ao design." Manter "apenas os dados, as stacks, as tecnologias usadas" |
| Referências | "Esquecer completamente as referências." As poucas que ficam: **Matrix** e cores **vermelho, vermelho-escuro** |
| Identidade | Parecer de "alguém de tecnologia, de cibersegurança, de redes e de infraestrutura". Profissional de tecnologia, ainda iniciante, que estuda formalmente há mais de quatro anos e se interessa por tecnologia desde muito cedo |
| Ambição | "Um portfólio foda de um profissional de tecnologia do mais alto nível da atualidade", "completamente atual", usado ao longo de 2027, que "surpreenda" e seja "referência de design" |
| Leitura sem palavras | "Uma pessoa olhe e fale: rapaz, essa pessoa aqui é boa com tecnologia. Não precisa nem ler nenhuma palavra para deduzir isso" |
| Riqueza | "Muitos elementos", "design rico, profissional, moderno", "cada mínimo detalhe, cada pixel" pensado |
| Recursos | Tendências de 2027, as stacks mais potentes, as skills. Mantém terminal, CTF, simulação GPON e som, e acrescenta elementos de **hardware, Kali, binário, cyber e SOC**: "vamos colocar bastantes elementos e recursos" |
| Cena 3D | Prototipou as duas direções ("Tudo é código" e "Objetos 3D reais"). **Escolheu "Tudo é código" em 07/11/2026** e pediu para remover a outra |
| Temas | Rubro como padrão, Claro e Fósforo, este escondido |
| Ajustes de 07/11/2026 | Tirar o "W" solto depois de Sobre, o efeito de cursor na chuva e a Formação em janelas de igreja. Chuva mais lenta. Vidro líquido do iOS na barra de navegação |

**Resultado:** conceito **Sinal** em [04](04-direcao-criativa.md), design system em [05](05-design-system.md), plano em [12](12-roteiro.md#redesign) e decisões a partir da [56](decisoes.md).

**Fatos ditos nesta conversa e a base:** "estudo formal há mais de quatro anos" é confirmado pela base (UNIASSELVI desde 02/2022) e pode ser exibido calculado. "Interesse por tecnologia desde muito cedo" ainda não está em `../curriculo`: só entra no site depois de o titular registrar lá ([pendências](pendencias.md)).

## O pedido original do titular

Resumo fiel da conversa de 05/11/2026. **No que se refere a design, foi substituído pelo [pedido de redesign](#pedido-de-redesign-06112026).**

| Requisito | Palavras ou sentido do pedido |
|---|---|
| Ambição de design | "Vencer campeonatos de design", "referência de design em 2027", "encantador, extremamente robusto esteticamente" |
| Recursos | "Todos os recursos que pudermos usar", "literalmente tudo o que tenho direito", "as melhores stacks, as melhores skills" |
| Conteúdo | Reflete o estado profissional e acadêmico atual. Iniciante em cibersegurança, com visão realista |
| Visual × experiência | A falta de experiência limita o texto e nunca o design. Muitos elementos de cibersegurança são bem-vindos |
| Chuva Matrix | "Muito bem feita", sem ser a base de tudo. No redesign, a chuva vira o material da cena, e as formas de cada seção nascem dela |
| Cores | Aberto a sugestões na primeira versão. No redesign: vermelho e vermelho-escuro |
| Projetos de desenvolvimento | Fora por enquanto. Estrutura pronta para adicionar projetos com demo no futuro |
| Publicação | No ar assim que estiver pronto |
| Ordem de trabalho | Primeiro toda a documentação, depois o desenvolvimento |
| Domínio | Registro A: `warley.ferzion.com.br` → `147.93.15.214` |

### Decisões tomadas pelo titular

| Tema | Decisão |
|---|---|
| Conceito | ~~Nave Digital~~, substituído em 06/11/2026 pelo conceito Sinal |
| Iconografia cristã | ~~Arquitetura, vitrais, ouro e cruz~~. Saiu com o redesign: o site novo não usa iconografia religiosa |
| Limites | Sem símbolos invertidos, paródia do sagrado, nonagrama, pentagrama, logos ou personagens de terceiros |
| Telefone | Revelado ao clicar, fora do HTML estático |
| Stack | Tudo da lista entra, salvo alternativas excludentes ou conflito com instrução do titular |

### Respostas do titular às pendências (05/11/2026)

| Tema | Resposta |
|---|---|
| "O que ainda não tenho" | Fica como está por enquanto |
| Nomes poéticos | Prefere não focar em linguagem religiosa. Ficam como estão, só na margem. Em texto novo, usar linguagem neutra sempre que houver oportunidade |
| GitHub | Desatualizado, o titular atualiza depois. Ignorar o conteúdo de lá e usar só `../curriculo` |
| Ferzion | Projeto descontinuado. O nome existe aqui só como domínio |
| WhatsApp | O mesmo número do currículo, com +55 |
| Git e GitHub | **O titular faz `git init`, repositório e commits manualmente** |
| HTTPS | O titular emite o certificado no deploy |
| Blender e scripts das skills | Autorizados |
| Sanity, PostHog, Sentry, monitor externo | Tudo o que é externo ao portfólio fica para o final, apenas anotado |
| Foto | Fora da versão inicial, talvez no futuro |
| Byakugan | Fora. Não é citado, nem sem nome |
| Prática em segurança | **Usa Kali, Nmap, Wireshark e Burp Suite em laboratórios: Hack The Box, TryHackMe, PortSwigger Academy e outros CTFs** |
| FIAP | Matrícula confirmada. Assunto encerrado |
| Segurança do site | Tratada toda no final: o mais blindado possível, com easter eggs para quem tentar explorar |
| Idiomas | pt-BR é o principal. Quer também inglês, espanhol, alemão, francês e outros dos principais |
| Premiações | Deixadas de lado por enquanto |
| Portfólio antigo | Retirado do ar de propósito. Não será usado |
| Pretensão salarial e disponibilidade | Fora do site |

### Referências de estilo

**Substituídas em 06/11/2026.** As referências da primeira versão estão em [referenciasdeestilo.md](../referenciasdeestilo.md), arquivo do titular mantido só como histórico: gótico cristão, ortodoxo, Matrix, cyberpunk, Mr. Robot, Bunnyland, red team, Slipknot e Death Note. Do conjunto, ficou apenas Matrix. As referências atuais e sua tradução estão em [04](04-direcao-criativa.md#referências).

### O prompt original

Texto usado pelo titular no ChatGPT para gerar [skills-stacks.md](../skills-stacks.md) e [skills-stacks2.md](../skills-stacks2.md). Mantido na íntegra, como requisito do projeto:

> quais as melhores 10 skills (quero links) de desing para o claude code?
>
> Quero fazer uma página extremamente completa e profissional, com animações, motions, 3d, todos os melhores e mais mordernos recuros, mais profissionais e elegantes, com literalmente tudo o que tenho direito, quero que faça uma lista com 10 skills de desing/ui-ux/copywrite/seo/frontend/animação/transparencias/transição/fundo3d e etc, todos os melhores recursos possiveis.
>
> Além disso liste um lista de stacks para usar em um projeto que usarei essas skills, quero usar as melhores skills, melhores recursos, melhores stacks, esse projeto deverá ser referência de desing em 2027, vamos usar o melhor de tudo.

## Públicos

| Público | Tempo | O que precisa fazer | Como o site responde |
|---|---|---|---|
| Recrutador | 30 segundos | Saber cargo, área e como contatar | Nome, cargo e estudo visíveis sem esperar animação. Atalho para `/cv` e contato |
| Líder técnico | 3 minutos | Medir profundidade e honestidade | Competências por tipo de evidência, certificados verificáveis, `/seguranca` |
| Júri de premiação | 5 a 10 minutos | Avaliar design, usabilidade, criatividade e conteúdo | A experiência completa, em desktop e celular |
| O próprio titular | Anos | Atualizar o conteúdo e adicionar projetos | Conteúdo validado e [projetos em uma etapa](13-projetos-futuros.md) |

## Objetivos

1. **Abrir conversas sobre vagas técnicas** em redes, NOC, infraestrutura Linux, DevOps, DevSecOps e segurança, de preferência remotas. Este é o objetivo de carreira, definido em `../curriculo/carreira/objetivo.md`.
2. **Ter nível de premiação.** A rubrica de [11-qualidade.md](11-qualidade.md) orienta a qualidade. A inscrição em premiações fica de lado por enquanto, por decisão do titular.
3. **Servir de prova prática.** A infraestrutura e a segurança do próprio site são reais, conferíveis por qualquer visitante e explicáveis em entrevista.

## Critérios de sucesso

| Critério | Medida |
|---|---|
| Entendimento | Em teste com 5 pessoas fora da área, todas dizem cargo e área em até 10 segundos |
| Leitura sem palavras | Com o texto borrado, 4 de 5 pessoas dizem que é um profissional de tecnologia em 5 segundos ([teste](11-qualidade.md#teste-sem-palavras)) |
| Veracidade | Cada fato de [02-conteudo.md](02-conteudo.md) tem origem em [01-veracidade-e-fontes.md](01-veracidade-e-fontes.md) e passa pela verificação automática |
| Design | Autoavaliação na rubrica de [11-qualidade.md](11-qualidade.md) com média 8 ou mais em cada eixo, feita por quem não construiu a tela |
| Desempenho | LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 em celular intermediário |
| Acessibilidade | WCAG 2.2 AA, teclado completo, movimento reduzido útil |
| Segurança | CSP estrita em produção, sem `unsafe-inline` em scripts, e nota máxima no Mozilla Observatory |
| Resiliência | O site inteiro é legível sem WebGL e sem JavaScript |

Vaga, entrevista e prêmio são desejados, porém dependem de terceiros e ficam fora dos critérios de pronto.

## Escopo

**Entra no lançamento:** as seções e rotas de [03-ux-e-navegacao.md](03-ux-e-navegacao.md), os recursos de [07-recursos-interativos.md](07-recursos-interativos.md), a stack de [14-skills-e-stack.md](14-skills-e-stack.md), as versões em outros idiomas e a blindagem de segurança.

**Fica de fora por ordem do titular:** Byakugan, que não é citado de nenhuma forma, e os demais projetos de desenvolvimento, como ConfTech, Rebanho, Rebanho360, RH, Romaneios, Bibliotheon e Wallstreet.

**Fica para o final, apenas anotado:** Sanity, PostHog, Sentry e monitor externo, por serem externos ao portfólio. Decisão do titular.

**Vem depois do lançamento:** ativação de "Obras" e foto em Sobre.

## Princípios de trabalho

1. **Tudo entra, e cada recurso tem função.** O inventário é máximo. Em cada tela, escolhemos o que orienta, responde, hierarquiza ou conta a história, como orienta o próprio `skills-stacks.md`.
2. **O texto nunca acompanha o visual em ousadia.** Um visual de red team convive com a frase "ainda não trabalhei em cargo de segurança".
3. **A experiência é camada, e o conteúdo é base.** Todo fato vive no HTML. O WebGL decora.
4. **O titular precisa saber explicar.** O site é feito com apoio de IA, e isso é dito no rodapé. Técnicas do site não viram competências no currículo sem aprendizado real.
5. **Git é do titular.** O agente nunca executa `git init`, commit ou push neste projeto.
