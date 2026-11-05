# Pendências

O que ainda depende do Warley. Atualizada em 05/11/2026, depois das respostas dele.

## Para o lançamento (o titular faz, no momento do deploy)

| Item | O que fazer |
|---|---|
| **Revisar os textos** | Ler o site rodando localmente, incluindo as regras de `/seguranca`, que falam em seu nome |
| **Git** | `git init`, repositório e commits. Decidir antes do primeiro commit se `docs/` vai junto, caso o repositório seja público: ela traz IP, porta e detalhes do VPS |
| **HTTPS** | Certificado e vhost, conforme [10-deploy-e-operacao.md](10-deploy-e-operacao.md#primeiro-deploy) |
| **`WHATSAPP_NUMERO` no servidor** | Copiar a variável para o `.env` do VPS. Localmente, já está em `.env.local`, fora do Git |

## Fase de blindagem

| Item | O que é |
|---|---|
| **`server_tokens off`** | Ajuste no nginx do VPS para esconder a versão. Requer `sudo` |
| **Entender os controles** | Faremos uma sessão explicando cada proteção de `/seguranca`, para você responder em uma entrevista |

## Decisões para o final, só anotadas

| Item | O que é | Se não fizer |
|---|---|---|
| **Sanity** | Painel para editar textos sem mexer em código | O conteúdo continua em arquivos, editados por sessão de agente |
| **PostHog** | Mede o uso do site: cliques, downloads do PDF | Sem métricas de uso |
| **Sentry** | Avisa quando o site quebra no navegador de alguém | Sem esse alerta |
| **Uptime** | Avisa se o site sair do ar. Você já usa | Sem esse alerta |

## Opcionais, sem prazo

| Item | O que é |
|---|---|
| **Detalhes da Linknet** | Se quiser, informe fabricantes de equipamento (Huawei, ZTE, etc.) e protocolos que usa no NOC (PPPoE, TR-069, VLAN, etc.). Enriquece a seção Agora e o currículo. Sem isso, a seção segue sem esses detalhes |
| **Registrar os laboratórios na base** | Kali, Nmap, Wireshark, Burp Suite, Hack The Box, TryHackMe e PortSwigger foram confirmados nesta conversa e ainda não constam de `../curriculo`. Vale registrar lá |
| **Foto** | Pode entrar em Sobre no futuro |
| **Atualizar GitHub** | Você já planeja. O site só aponta para o perfil |
| **Premiações** | Deixadas de lado por enquanto |
