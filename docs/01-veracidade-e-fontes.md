# 01 — Veracidade e fontes

Regras para qualquer texto público do site, incluindo terminal, CTF, metadados, imagens de compartilhamento e PDF. Elas herdam as regras de `../curriculo/CLAUDE.md`.

## Regra principal

Só é publicado o que está nas fontes abaixo, com o peso de evidência que a fonte dá. Competência desejada, plano de estudo ou efeito visual não viram fato. Em conflito, vale a confirmação mais recente do titular.

## Fontes

| Código | Arquivo | Usado para |
|---|---|---|
| BM | `../curriculo/curriculo_mestre.md` | Cargos, datas, formação, competências e limites |
| CA | `../curriculo/certificados/catalogo.md` | Cursos, datas, cargas e credenciais |
| DI | `../curriculo/certificados/formacao/disciplinas.md` | Disciplinas cursadas |
| OB | `../curriculo/carreira/objetivo.md` | Posicionamento e palavras permitidas |
| TP | `../curriculo/plataformas/textos_prontos.md` | Frases já aprovadas como base |
| PE | `../curriculo/pendencias.md` | O que ainda está em aberto |
| TI | Conversa de 05/11/2026 | Decisões do titular para este site e fatos que ele confirmou: prática em laboratórios (Kali, Nmap, Wireshark, Burp Suite, Hack The Box, TryHackMe, PortSwigger Academy, CTFs). Ainda não registrados em BM |

`../curriculo` é somente leitura neste projeto. Fato novo entra primeiro lá e depois aqui.

## O que nunca é publicado

| Item | Motivo | Controle |
|---|---|---|
| PDFs e XMLs de `certificados/` | Contêm CPF, RG e data de nascimento | Só nome, emissor, data e link oficial de validação. Nenhum arquivo copiado para `public/` |
| CPF, RG, data de nascimento, endereço completo | Regra da base | Busca automática no build |
| Pretensão salarial, contrato, disponibilidade de escala | Assunto de negociação | Fora do conteúdo |
| Notas internas e "Declaração antiga" sem reconfirmação | Regra da base | Fora do conteúdo |
| Bolsa ProUni | Menção opcional; nada a ganhar aqui | Fora do conteúdo |
| Notas das disciplinas e média 8,64 | A média não é dado oficial e a nota não mede competência | Só nomes de disciplinas |
| Links de repositórios individuais | Regra da base: no GitHub, só o perfil | Busca automática |
| Conteúdo de `plano_desenvolvimento.md` | "Nada aqui vai para currículos ou perfis até virar realidade" | Fora do conteúdo |
| Nomes de projetos e menção a "projeto acadêmico" | Pedido do titular. O Byakugan não é citado nem sem nome | Busca automática, com lista em [13-projetos-futuros.md](13-projetos-futuros.md) |
| Detalhes do VPS: IP, porta, outros sistemas hospedados | O servidor é compartilhado com clientes | Fora do conteúdo e do `/seguranca` |

## Palavras que não podem aparecer como afirmação

A verificação de [Automação](#automação) falha se algum destes termos surgir em texto público, salvo a exceção indicada.

| Termo | Motivo |
|---|---|
| AWS, Azure, GCP, Kubernetes, Terraform, Ansible, Prometheus, ELK | Seção "Sem prática confirmada" da base |
| SIEM, Splunk, Wazuh, QRadar | Idem |
| BGP, OSPF, MPLS, Mikrotik, Cisco IOS, firewall corporativo | Idem |
| Spring Boot | Idem |
| "Fundador", "CEO", "empresa" associado à Ferzion | A Ferzion não é empregadora nem empresa ativa no currículo |
| SafraLog | Descontinuado |
| "Especialista", "sênior", "avançado", "expert", "hacker", "pentester", "analista de SOC", "red teamer" como título do titular | Sem cargo nem nível validado |
| "100%", "satisfação", contagens de clientes ou vendas | Afirmações antigas sem sustentação |

**Exceção:** "red team" e "SOC" podem aparecer em objetivo profissional ou no vocabulário de estudo, como em "busco minha primeira oportunidade em segurança". O verificador usa uma lista de frases permitidas, mantida no próprio script.

## Níveis de evidência

| Nível no site | Nível na base | Como é apresentado |
|---|---|---|
| **Uso no trabalho** | Profissional | Primeira fileira da Iconóstase, com menção à Linknet |
| **Prática em projetos próprios** | Projetos | Segunda fileira. Sem nomes de projetos |
| **Formação** | Formação | Terceira fileira, com indicação de curso quando for introdutório |
| **Laboratórios e estudo** | Estudo, mais TI | Quarta fileira. Prática em plataformas de treino, sem peso de experiência profissional |
| Não exibido | Declarada | Fora do site até reconfirmação |

**Sem barras, porcentagens ou notas de habilidade.** A base afirma: "Nenhum nível foi validado".

## Regras por área

| Área | Pode dizer | Não pode dizer ou sugerir |
|---|---|---|
| Segurança | Estudante na FIAP; fundamentos em formação; OWASP Top 10, CWE, MITRE ATT&CK e Sigma em projetos próprios; Kali, Nmap, Wireshark e Burp Suite em laboratórios (Hack The Box, TryHackMe, PortSwigger Academy, CTFs); início de carreira na área | Experiência profissional em SOC, pentest ou resposta a incidentes. Rankings, posições ou resultados de CTF sem dado real do titular |
| DevOps | Docker, Compose, CI, deploy com rollback em projetos próprios; pós concluída | Cargo em DevOps. "CI/CD" para o que é deploy por script: use "CI" e "deploy automatizado" |
| Redes | NOC N2 real, GPON/FTTH, Zabbix, Grafana, desde 08/2026 | Tempo maior que o real; roteamento avançado; métricas de rede |
| Desenvolvimento | Presente como prática em projetos | Título "Desenvolvedor Full Stack". É plano B em OB |
| Certificados | "Comprova conclusão ou participação" | Domínio técnico, programa completo do Google, CCNA |

## O visual e a verdade

A estética pode evocar red team, mas o conteúdo exibido nela é real ou claramente decorativo.

| Proibido | Permitido |
|---|---|
| Mapa de ataques, "ataques bloqueados", contador de ameaças fictício | Cabeçalhos HTTP reais do próprio site |
| Painel de NOC com números inventados | Diagrama genérico de GPON, com o aviso "desenho ilustrativo" |
| Mostrar IP, cidade ou aparelho do visitante para assustar | Comandos do terminal que devolvem dados do currículo |
| Saída de ferramenta falsa como se fosse resultado real | Chuva de glifos, sem significado de dado |
| Depoimentos ou logos de clientes | Links oficiais de validação de certificados |
| Linguagem de glória hacker | Regras éticas em primeira pessoa, aprovadas pelo titular |

## Mapa fato → origem

Cada bloco de [02-conteudo.md](02-conteudo.md) traz seu código de origem na linha "Origem". Ao mudar um fato, procure o código para saber onde conferir.

| Bloco | Fonte |
|---|---|
| Contatos | BM, seção Contatos profissionais |
| Cargo atual e atividades | BM, seção Linknet |
| Linha do tempo | BM, seção Experiência profissional, ignorando "Versões antigas" |
| Formação | BM, seção Formação acadêmica; DI |
| Competências | BM, seção Competências, colunas de evidência |
| Certificados | CA, gerado por script a partir das tabelas |
| Posicionamento | OB, seção Como se apresentar; TP |
| Idiomas | BM, seção Cursos e idiomas |

## Automação

`scripts/verificar-conteudo.ts`, detalhado em [08-arquitetura-tecnica.md](08-arquitetura-tecnica.md#verificação-de-conteúdo), roda em todo build e no CI:

1. Valida o conteúdo contra os esquemas Zod.
2. Procura termos proibidos em todo o HTML gerado, nos metadados, no PDF e nos comandos do terminal.
3. Procura padrões de documento pessoal e confere se o telefone completo não está em nenhum arquivo estático.
4. Confere se não existe PDF de certificado em `public/`.
5. Quando `../curriculo` está disponível, compara datas e credenciais com a base e o catálogo.

## Ao atualizar

1. Atualize `../curriculo` e rode o `verificar.py` de lá.
2. Atualize o conteúdo aqui, seja no Sanity ou na cópia local.
3. Rode `pnpm verificar` e o build.
4. Quando surgir prática nova, como um laboratório concluído, registre-a na base antes de citá-la no site.
