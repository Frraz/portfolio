# 02 — Conteúdo

Texto final do site, em pt-BR e em primeira pessoa. É a matéria-prima de `src/conteudo/` e precisa da aprovação do titular antes do lançamento ([pendências](pendencias.md)).

**Situação:** aprovado pelo titular para desenvolvimento, com revisão final ao rodar localmente. Este texto é a versão pt-BR, idioma principal do site.

**Diagnóstico:** Diagnóstico da skill Copywriting: situação A (sem texto próprio para este site), com latitude de ângulo e nenhuma sobre fatos.

**Regras de redação usadas**

- Toda frase passa em três perguntas: dá para imaginar? Dá para provar verdadeira ou falsa? Outra pessoa poderia escrever igual?
- Sem as marcas de texto de IA da skill Copywriting: revelação por contraste, listas de negação, oração final colada por vírgula, pergunta retórica com resposta, revelação com dois-pontos.
- Rótulos são simples. O nome poético fica na margem e nunca substitui o rótulo.
- Códigos de origem estão em [01-veracidade-e-fontes.md](01-veracidade-e-fontes.md#fontes).

## Argumento da página

Cada seção existe porque sustenta uma afirmação.

| Seção | Afirmação | Prova |
|---|---|---|
| Início | Trabalho com redes e estudo segurança | Cargo e curso atuais |
| Sobre | Sei onde estou e digo isso com clareza | O parágrafo do que ainda não tenho |
| Agora | Faço trabalho técnico real em um NOC | Atividades e ferramentas da Linknet |
| Trajetória | Cheguei à TI trabalhando, sem atalho | Dez experiências com datas |
| Formação | Estudo com método e continuidade | Dois cursos concluídos e um em andamento |
| Competências | Separo o que uso do que estudo | Quatro fileiras por evidência |
| Certificados | Tudo aqui pode ser conferido | Links oficiais de validação |
| Contato | Falar comigo é simples | E-mail, LinkedIn, GitHub e WhatsApp |

## Início (Portal)

**Origem:** BM Contatos, Linknet, Formação.

**H1:** Warley Ferraz Almeida

**Subtítulo:** Analista de Redes N2 em NOC. Estudante de Segurança Cibernética na FIAP.

**Frase de apoio:** Monitoro uma rede de fibra óptica em um provedor de internet e estudo para proteger redes como essa.

**Local:** Rondon do Pará, PA. Disponível para trabalho remoto.

**Ações:** `Ver currículo` é a ação principal e leva a `/cv`. `Falar comigo` é um link secundário e leva a `#contato`.

**Hierarquia da primeira tela:** H1 em até duas linhas ("Warley Ferraz / Almeida" no celular), subtítulo logo abaixo em tamanho de destaque, frase de apoio menor, e a ação principal. Local em tamanho de legenda. Tudo visível sem esperar animação.

**Canvas:** decorativo, com `aria-hidden`. Nenhuma informação vive só nele.

## Sobre (Noviço)

**Origem:** BM Resumo e Objetivos; OB Como se apresentar; TP Sobre.

**H2:** Sobre

Na segurança cibernética, estou no começo: iniciei o tecnólogo na FIAP em fevereiro de 2026 e estudo do fundamento para cima.

Nas redes, já estou em campo. Desde agosto de 2026 sou Analista de Redes N2 em um NOC, onde acompanho a rede pelo Zabbix e pelo Grafana e investigo o que para de funcionar.

Fora do NOC, implanto e mantenho sistemas próprios em servidores Linux. Essa prática me ensinou Ubuntu Server, systemd, Nginx, Docker Compose, HTTPS, firewall, backup de PostgreSQL e deploy em Bash com healthcheck e rollback.

**Bloco "O que ainda não tenho"**

Nunca trabalhei em cargo de segurança, SOC ou pentest. O que sei de segurança vem da faculdade, de cursos e de laboratórios como Hack The Box, TryHackMe e PortSwigger Academy. Busco a minha primeira oportunidade na área.

**Bloco "O que procuro"**

Função técnica em redes, NOC, infraestrutura Linux, DevOps, DevSecOps ou segurança, de preferência remota.

**Momento em tela branca:** apenas a letra W em Grenze Gotisch, sem frase e com `aria-hidden`. No tema Pergaminho, a tela fica preta. O conteúdo textual continua no fluxo.

## Agora (Vigília)

**Origem:** BM Linknet.

**H2:** Agora

**Cargo:** Analista de Redes N2, NOC

**Empresa:** Linknet Telecomunicações

**Período:** desde agosto de 2026. Trabalho de casa.

**Atividades**

- Monitoro indicadores e anomalias da rede com Zabbix e Grafana.
- Diagnostico e resolvo incidentes de conectividade, comunicação e acesso a serviços e aplicações.
- Investigo autenticação, provisionamento e conectividade de ONUs e ONTs em redes GPON/FTTH, com sistemas de gerenciamento e plataformas ACS.
- Configuro e gerencio remotamente roteadores e dispositivos de clientes, e consulto OLTs, switches e roteadores para localizar falhas.
- Acompanho demandas no IXC Provedor e organizo ordens de serviço e prioridades das equipes técnicas de campo.
- Identifico problemas recorrentes e colaboro na melhoria dos processos.

**Ferramentas:** Zabbix, Grafana, IXC Provedor, plataformas ACS, OLTs, switches, roteadores, ONUs e ONTs.

**Bloco sobre luz e vidro**

Uma rede GPON leva luz por fibra de vidro. O sinal sai de uma OLT, passa por divisores e chega à ONU de cada casa. Uma rosácea faz um percurso parecido: a luz entra pelo centro e se divide pelo rendilhado de pedra.

**Legenda do diagrama:** Desenho ilustrativo. Sem dados de nenhuma rede real.

**Espaço reservado:** se o titular quiser informar fabricantes e protocolos que usa, eles entram nesta seção ([pendências](pendencias.md#opcionais-sem-prazo)). Até lá, nada é estimado.

## Trajetória (Peregrinação)

**Origem:** BM Experiência profissional. Só atividades confirmadas; "Declaração antiga" fica de fora.

**H2:** Trajetória

**Introdução:** Comecei como jovem aprendiz em 2020. Passei pelo varejo, pelo agronegócio e pelo crédito rural antes de chegar ao NOC.

Ordem cronológica na página inicial e inversa em `/cv`.

| Período | Empresa | Cargo | Descrição |
|---|---|---|---|
| 09/2020 – 07/2021 | Magazine Luiza | Jovem Aprendiz | Apoio administrativo e operacional, organização de documentos, estoque e atendimento. |
| 11/2021 – 06/2022 | Americanas S.A. | Auxiliar de Loja | Reposição, precificação, organização, estoque e rotinas de frente de loja. |
| 09/2022 – 01/2023 | IBL Net | Atendente (suporte N1) | Suporte inicial em provedor de internet, com registro de demandas técnicas e escalonamento de ocorrências mais complexas. |
| 04/2023 – 01/2024 | Grupo Mateus | Operador de Caixa | Sistemas de frente de caixa e conferência de valores. Apoio temporário ao CPD/TI: um mês de treinamento e um mês de substituição durante férias da responsável. |
| 01/2024 – 07/2024 | Agro São José & Sagrada Família | Assistente Administrativo | Rotinas administrativas, conferência de movimentações bancárias, notas fiscais e documentação ambiental e operacional no SSCrop. |
| 08/2024 – 09/2024 | Alfa Projetos | Assistente Administrativo | Organização de documentos, planilhas e sistemas, com apoio às rotinas técnicas e comerciais. |
| 10/2024 – 03/2025 | Alfa Projetos | Gerente de Negócios | Carteira de clientes, negociação de projetos, operações e limites de crédito, propostas e dossiês financeiros. |
| 03/2025 – 03/2026 | Alfa Projetos | Projetista de Crédito Rural | Projetos de crédito rural, análise de viabilidade técnica e financeira e conferência de documentos. |
| 02/2026 – 08/2026 | Agro São José & Sagrada Família | Assistente Administrativo | Controle de fretes e colheita de soja e milho, romaneios no Scadiagro, fechamentos financeiros e conferência de abastecimento. |
| 08/2026 – atual | Linknet Telecomunicações | Analista de Redes N2, NOC | Monitoramento e diagnóstico em rede GPON/FTTH. Detalhes na seção Agora. |

**Regras de exibição**

- A sobreposição entre Alfa e Agro em 2026 aparece como está. Não ajuste datas nem publique a explicação ([BM, nota interna](../../curriculo/curriculo_mestre.md)).
- Atividades comerciais e panfletagem da IBL Net ficam de fora, como a base permite em textos de TI.
- As passagens por TI têm mais destaque visual que varejo e administrativo, sem esconder nenhuma data.

## Formação (Noviciado)

**Origem:** BM Formação; DI.

**H2:** Formação

| Curso | Instituição | Período | Situação | Destaques |
|---|---|---|---|---|
| Tecnólogo em Segurança Cibernética | FIAP | 02/2026 – 02/2028 (previsão) | Em andamento | |
| Pós-graduação Lato Sensu em Engenharia DevOps | Faculdade Focus | 07/2025 – 11/2025 | Concluída, 420 h | Infraestrutura de TI, Cloud Computing, DevOps, Introdução à Virtualização, Cybersecurity, Desenvolvimento de Soluções com Python |
| Tecnólogo em Análise e Desenvolvimento de Sistemas | UNIASSELVI | 02/2022 – 07/2025 | Concluído, 2.600 h | Segurança em Tecnologia da Informação, Fundamentos de Redes de Computadores, Sistemas e Aplicações Distribuídas, Princípios de Banco de Dados |

**Idiomas:** Português fluente. Inglês básico, com leitura de documentação técnica.

**Legenda da lanceta da FIAP:** a luz da janela mostra o tempo decorrido do curso, calculado por data, e não aproveitamento.

**Estudo em andamento:** continuo o programa Google Cybersecurity Certificate, com quatro cursos concluídos (CA). O programa completo ainda não foi concluído.

## Competências (Iconóstase)

**Origem:** BM Competências, pela coluna de evidência. A base não valida níveis, então nada aqui tem nota ou barra.

**H2:** Competências

**Introdução:** Separei o que sei pela origem de cada conhecimento. A primeira fileira é o que uso no trabalho. As seguintes pesam menos, nesta ordem.

### Fileira 1: uso no trabalho

GPON e FTTH. ONUs e ONTs. Consulta a OLTs, switches e roteadores. Configuração remota de roteadores e dispositivos de clientes. Plataformas ACS. IXC Provedor. Zabbix e Grafana, em uso operacional. Diagnóstico de conectividade. Gestão de incidentes. Coordenação operacional de equipes de campo.

### Fileira 2: prática em projetos próprios

| Área | Competências |
|---|---|
| Linux e servidores | Ubuntu Server, linha de comando, SSH, systemd, Nginx, Gunicorn, UFW, acesso por chave, exposição mínima de portas, HTTPS com Let's Encrypt, HSTS, Bash, backup e restauração de PostgreSQL |
| DevOps | Docker, Docker Compose, deploy com rollback e healthcheck, GitHub Actions (CI), Git, GitHub, smoke tests, logs de aplicação |
| Segurança aplicada | OWASP Top 10, CWE, MITRE ATT&CK e regras Sigma. JWT, RBAC, trilha de auditoria, hash de integridade, proteção CSRF, cookies seguros, detecção de XSS e SQL Injection |
| Programação | Python, Django, Django REST Framework, APIs REST, PostgreSQL e SQL, Celery, Redis, pytest, HTMX, Alpine.js, Tailwind CSS, React, TypeScript, Next.js, HTML, CSS, JavaScript |

**Nota:** a existência desses controles em um projeto não certifica ausência de vulnerabilidades, e os projetos em si ainda não estão publicados aqui.

### Fileira 3: formação

Fundamentos de segurança, gestão de riscos e segurança de redes. LGPD. Camadas, protocolos, endereçamento IP, ping e traceroute. VLANs, sub-redes, switches e roteadores em redes locais. Wireshark e análise de tráfego, em curso introdutório. Scripts de monitoramento e análise de logs em Linux. Fundamentos de DevOps, virtualização e cloud.

### Fileira 4: laboratórios e estudo

Kali Linux, Nmap, Wireshark e Burp Suite, usados em laboratórios. Prática em Hack The Box, TryHackMe, PortSwigger Academy e outros CTFs. Reconhecimento e fundamentos de teste de intrusão. Programa Google Cybersecurity Certificate, em andamento.

**Nota:** são ambientes de treino, com autorização própria das plataformas. Não equivalem a experiência profissional.

**Filtros:** Redes, Linux, DevOps, Segurança e Programação. O filtro fica na URL (`?area=seguranca`).

## Certificados (Relicário)

**Origem:** CA. A tabela abaixo é gerada por script a partir do catálogo.

**H2:** Certificados

**Introdução:** São 36 cursos e atividades. Sempre que o emissor oferece validação, o link leva à página oficial dele. Certificado comprova conclusão ou participação, e o que sei de fato aparece melhor em Competências.

**Exibição:** as prioridades A e B aparecem por padrão (21 cursos). `Ver todos os 36` revela a prioridade C. Filtros por área ficam na URL.

**Regras**

- Nenhum PDF é publicado, pois os documentos trazem dados pessoais.
- Antes do lançamento, cada link é testado, e a página de validação é conferida para garantir que não exponha CPF ou RG ([pendências](pendencias.md)). Link com problema vira só o nome do curso.
- Sem código público de validação, o curso aparece apenas com emissor e data.
- A chave de um curso FIAP é exibida com o endereço do validador.

### Prioridade A

| Curso | Emissor | Conclusão | Carga | Validação | Área |
|---|---|---|---|---|---|
| Connect and Protect: Networks and Network Security | Google / Coursera | 28/07/2026 | Não informada | [JUX7TXEM61CX](https://coursera.org/verify/JUX7TXEM61CX) | Redes |
| Estrutura e Funcionamento das Redes de Computadores | Google / Coursera | 19/07/2023 | Não informada | [AYB8EBSNJH72](https://coursera.org/verify/AYB8EBSNJH72) | Redes |
| Redes: construindo um projeto com VLANs, políticas de acesso e conexão com internet | Alura | 25/11/2025 | 8 h estimadas | [c086962e-623f-4b54-84ac-7319c093365b](https://cursos.alura.com.br/certificate/c086962e-623f-4b54-84ac-7319c093365b) | Redes |
| Redes: dos conceitos iniciais à criação de uma intranet | Alura | 25/11/2025 | 12 h estimadas | [1d27e5a0-e6ad-4501-83f5-aba58da44b30](https://cursos.alura.com.br/certificate/1d27e5a0-e6ad-4501-83f5-aba58da44b30) | Redes |
| Tools of the Trade: Linux and SQL | Google / Coursera | 12/08/2026 | Não informada | [PLVSWQGQQZT2](https://coursera.org/verify/PLVSWQGQQZT2) | Linux e sistemas operacionais |
| DevOps: explorando conceitos, comandos e scripts no Linux CLI | Alura | 26/11/2025 | 8 h estimadas | [d9254ff6-5355-4266-a0c1-191173a92d73](https://cursos.alura.com.br/certificate/d9254ff6-5355-4266-a0c1-191173a92d73) | Linux e sistemas operacionais |
| Linux: criando script de monitoramento de sistema | Alura | 23/11/2025 | 10 h estimadas | [f93df044-799a-43eb-8873-4d2c481270ca](https://cursos.alura.com.br/certificate/f93df044-799a-43eb-8873-4d2c481270ca) | Linux e sistemas operacionais |
| Linux: criando script para processamento de arquivos de logs | Alura | 06/11/2025 | 10 h estimadas | [b91f3d4c-d989-41af-9079-0e349d36eac5](https://cursos.alura.com.br/certificate/b91f3d4c-d989-41af-9079-0e349d36eac5) | Linux e sistemas operacionais |
| Imersão Digital — Trilha de Aprofundamento: DevOps Administração, Operação e Monitoramento de Sistemas | ALUN Business | 08/12/2025 a 20/04/2026; emitido em 05/06/2026 | 126 h | Sem código no texto do documento | DevOps, cloud e versionamento |
| Cloud Fundamentals, Administration and Solution Architect | FIAP — Nano Course | 09/12/2025 | 80 h | Chave 53efaf0555a7875d4100e073c1086239 em on.fiap.com.br/validar-certificado | DevOps, cloud e versionamento |
| Foundations of Cybersecurity | Google / Coursera | 12/06/2026 | Não informada | [PXM70QMGEB95](https://coursera.org/verify/PXM70QMGEB95) | Segurança da informação |
| Play It Safe: Manage Security Risks | Google / Coursera | 11/07/2026 | Não informada | [M2F29BB5BTG9](https://coursera.org/verify/M2F29BB5BTG9) | Segurança da informação |
| Cybersecurity | FIAP — Nano Course | 08/04/2025 | 120 h | Chave 873bf077c2c5c43c7f2e0545d2a62639 em on.fiap.com.br/local/nanocourses/validar-certificado | Segurança da informação |

### Prioridade B

| Curso | Emissor | Conclusão | Carga | Validação | Área |
|---|---|---|---|---|---|
| Começando com o Cisco Packet Tracer | Cisco Networking Academy | 24/11/2025 | Não informada | Sem código no documento | Redes |
| Wireshark | Learncafe | 15/03/2026 | 1 h | 3670618.4253856.23230 | Redes |
| Linux: gerenciando diretórios, arquivos, permissões e processos | Alura | 05/11/2025 | 8 h estimadas | [8e2e564d-7187-4397-bf29-2a7351dbf710](https://cursos.alura.com.br/certificate/8e2e564d-7187-4397-bf29-2a7351dbf710) | Linux e sistemas operacionais |
| Sistemas Operacionais e Você: Tornando-se um Usuário Avançado | Google / Coursera | 17/09/2023 | Não informada | [TYXNEKCGPMXE](https://coursera.org/verify/TYXNEKCGPMXE) | Linux e sistemas operacionais |
| DevOps & Agile Culture | FIAP — Nano Course | 29/11/2025 | 60 h | Chave 369fd0f9acc8a2bcfa4ab0bace05fb76 em on.fiap.com.br/validar-certificado | DevOps, cloud e versionamento |
| Versionamento de Código com Git e GitHub | DIO | 28/06/2025 | 2 h | PPZTUQLZ | DevOps, cloud e versionamento |
| Segurança em Tecnologia da Informação | Fundação Bradesco / Escola Virtual | 28/07/2025 | 12 h | 22E14F78-B3B2-4EAB-B3EF-FC37F7B62DD5 | Segurança da informação |
| Lei Geral de Proteção de Dados (LGPD) | Fundação Bradesco / Escola Virtual | 28/07/2025 | 2 h | 00B6300D-601C-4ACB-8D77-4952C5132747 | Segurança da informação |

### Prioridade C

| Curso | Emissor | Conclusão | Carga | Validação | Área |
|---|---|---|---|---|---|
| Fundamentos do Suporte Técnico | Google / Coursera | 05/07/2023 | Não informada | [HS9G5GA9HPRY](https://coursera.org/verify/HS9G5GA9HPRY) | Suporte e informática |
| Informática Básica e Avançada | Geração Cursos Profissionalizantes | 10/10/2019 | 90 h | Sem código no documento | Suporte e informática |
| Pensamento Computacional: Fundamentos da Computação e Lógica de Programação | Alura | 22/05/2026 | 8 h estimadas | [2f8b4e50-a029-4453-84e2-fd8cb0a36eae](https://cursos.alura.com.br/certificate/2f8b4e50-a029-4453-84e2-fd8cb0a36eae) | Programação |
| Lógica de programação: explore funções e listas | Alura | 17/10/2025 | 6 h estimadas | [df032b2b-cadf-4f47-a266-6003eb85649d](https://cursos.alura.com.br/certificate/df032b2b-cadf-4f47-a266-6003eb85649d) | Programação |
| Lógica de programação: mergulhe em programação com JavaScript | Alura | 29/09/2025 | 6 h estimadas | [c30f71c3-5814-4a7d-8092-538fbc474a15](https://cursos.alura.com.br/certificate/c30f71c3-5814-4a7d-8092-538fbc474a15) | Programação |
| Começando em Programação: carreira e primeiros passos | Alura | 29/09/2025 | 1 h estimada | [4c856a05-dafa-4411-80fd-9896fe4a77d2](https://cursos.alura.com.br/certificate/4c856a05-dafa-4411-80fd-9896fe4a77d2) | Programação |
| Estruturas de Controle em Java | DIO | 28/07/2025 | 2 h | UMQEQMDX | Programação |
| Simulando Uma Conta Bancária Através do Terminal/Console | DIO | 11/07/2025 | 1 h | YUFBGH0W | Programação |
| Fundamentos da Linguagem de Programação Java | DIO | 10/07/2025 | 2 h | OU144KJY | Programação |
| Introdução ao Java e seu Ambiente de Desenvolvimento | DIO | 27/06/2025 | 2 h | UYJIFGYZ | Programação |
| Crédito Rural | SENAR / Senar Play | 11/07/2025 | 20 h | af80f0d6-b7ac-4c9b-a66a-1df3f66f5052 | Outros |
| Contribuindo em um Projeto Open Source no GitHub | DIO | 28/06/2025 | 1 h | PACJBUNZ | Outros |
| Desafios de Projetos: Crie Um Portfólio Vencedor | DIO | 28/06/2025 | 1 h | ZVWJ3YO1 | Outros |
| Introdução à Experiência Santander 2025 | DIO / Santander | 10/06/2025 | 1 h | WJK1GNLU | Outros |
| Trilha #BIP | Academia do Universitário | Emissão em 20/12/2022 | 6 h | 05hetidbnm | Outros |

## Contato (Chamado)

**Origem:** BM Contatos; TI.

**H2:** Contato

**Texto:** Procuro função técnica em redes, NOC, infraestrutura Linux, DevOps ou segurança, de preferência remota. Se a sua equipe tem uma vaga assim, me escreva.

| Canal | Exibição |
|---|---|
| E-mail | warley.ferraz.wf@gmail.com, com link `mailto:` e botão `Copiar e-mail` |
| LinkedIn | linkedin.com/in/warley-ferraz-almeida |
| GitHub | github.com/Frraz |
| WhatsApp | Botão `Mostrar WhatsApp`. Especificação em [07-recursos-interativos.md](07-recursos-interativos.md#revelação-do-whatsapp) |

**Download:** `Baixar currículo em PDF`.

## `/cv`

Versão direta, em HTML semântico, sem WebGL, pronta para impressão. Usa os mesmos dados da página inicial.

**Título:** Warley Ferraz Almeida

**Subtítulo:** Redes, NOC, Infraestrutura Linux e Segurança da Informação em formação

**Objetivo:** Atuar em função técnica de TI, de preferência remota, nas áreas de redes, infraestrutura Linux, DevOps e segurança da informação.

**Resumo:** Analista de Redes N2 em NOC de provedor de internet, com monitoramento em Zabbix e Grafana, diagnóstico de incidentes e redes GPON/FTTH. Implanto e mantenho sistemas próprios em VPS Linux, com Docker, Nginx, HTTPS, firewall, backup e deploy automatizado. Graduado em Análise e Desenvolvimento de Sistemas, pós-graduado em Engenharia DevOps e estudante de Segurança Cibernética na FIAP. Sem experiência profissional anterior em cargo de segurança.

**Ordem:** experiência em TI, formação, competências por fileira, cursos de prioridade A, experiências anteriores e idiomas.

**PDF:** gerado a partir desta rota, com uma coluna, sem foto nem tabelas e sem seção de projetos. **O PDF público não traz telefone**, pois um número em arquivo aberto anularia a revelação ao clicar. Traz e-mail, LinkedIn, GitHub e a linha `WhatsApp disponível em warley.ferzion.com.br`. Para candidaturas, o titular continua enviando os PDFs de `../curriculo/curriculos/`, com telefone. A rota `/cv` usa o mesmo botão de revelação da seção Contato.

## `/seguranca` (Cânone)

**H1:** Segurança deste site

**Abertura:** Tudo nesta página pode ser conferido no seu navegador. Estou aprendendo segurança, e este site é um dos lugares onde pratico. Se encontrar um problema, me avise pelo [security.txt](https://warley.ferzion.com.br/.well-known/security.txt).

**Bloco "O que está aplicado"**, publicado só depois de cada item ser testado em produção:

| Controle | O que significa | Como conferir |
|---|---|---|
| Site estático | Sem banco, login ou aplicação no servidor | Nenhuma rota recebe dados pessoais |
| Política de conteúdo (CSP) estrita | Só rodam scripts cujo hash foi calculado no build | Ver cabeçalho `Content-Security-Policy` |
| HTTPS e HSTS | Conexão cifrada e forçada | Ver cabeçalho `Strict-Transport-Security` |
| Contêiner só leitura, sem privilégios | Em caso de falha, há pouco o que alterar | Descrito no repositório, se público |
| Lista de componentes (SBOM) | Registro das dependências deste build | `/sbom.json` |
| Sem cookies | Nenhum identificador fica salvo no seu navegador | Ferramentas do navegador |

**Bloco "O que não posso garantir":** Estes controles reduzem riscos e não provam ausência de falhas. O site ainda não passou por auditoria independente.

**Bloco "Minhas regras":** escritas à mão no estilo de caderno, sujeitas à aprovação do titular.

1. Só testo o que tenho autorização escrita para testar.
2. Antes de começar, defino escopo, prazo e como parar.
3. Registro o que faço para que outra pessoa possa conferir.
4. Encontrei uma falha, aviso o responsável primeiro.
5. Não exponho dados de ninguém para provar um ponto.
6. Quando não sei, digo que não sei.

**Bloco "Privacidade"** (`#privacidade`): Este site não usa cookies. As estatísticas de visita, quando ativas, passam pelo próprio domínio, sem identificar você entre visitas. Os erros técnicos, quando ativos, são enviados sem seu endereço IP. Fale comigo pelo e-mail acima para qualquer pedido ligado à LGPD.

## `/sistema`

**H1:** Sistema de design

**Abertura:** Tudo o que compõe este site: cores, tipos, ornamentos e movimento. Está aqui porque um design system também é trabalho a mostrar, e foi construído com apoio de IA.

Conteúdo: tokens vivos dos cinco temas, escala tipográfica, ornamentos e componentes.

## Rodapé

Warley Ferraz Almeida, Rondon do Pará.

Site feito com Next.js, Three.js e GSAP, com apoio do Claude Code. Os textos foram revisados por mim, e os efeitos visuais não representam competências minhas em computação gráfica.

Links: Currículo, Segurança, Sistema de design, Privacidade.

## Páginas de estado

| Estado | Texto |
|---|---|
| 404 | **Esta página não existe.** Confira o endereço ou volte ao início. |
| Sem conexão | **Sem conexão.** O currículo continua disponível neste aparelho. |
| WebGL indisponível | Sem aviso. Aparece a imagem estática, e nada se perde |
| Terminal: comando desconhecido | `comando não encontrado: x. Digite ajuda para ver a lista.` |

## SEO

**Título da página inicial:** Warley Ferraz Almeida | Analista de Redes N2, NOC e Segurança

**Descrição:** Analista de Redes N2 em NOC, com Zabbix, Grafana e GPON/FTTH. Pós em Engenharia DevOps e estudante de Segurança Cibernética na FIAP.

| Rota | Título | Descrição |
|---|---|---|
| `/cv` | Currículo de Warley Ferraz Almeida | Experiência em redes e NOC, formação em DevOps e Segurança Cibernética, competências e certificados. PDF disponível. |
| `/seguranca` | Segurança deste site, por Warley Ferraz Almeida | Os controles aplicados neste portfólio, como conferir cada um e o que eles não garantem. |
| `/sistema` | Sistema de design da Nave Digital | Cores, tipografia, ornamentos e movimento do portfólio de Warley Ferraz Almeida. |

**JSON-LD `Person`:** nome, `jobTitle`, `worksFor` (Linknet Telecomunicações), `alumniOf` (UNIASSELVI, Faculdade Focus), `address` com localidade e estado, `url`, `sameAs` (LinkedIn e GitHub). Sem telefone.
