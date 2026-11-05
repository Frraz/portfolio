# 09 — Segurança e privacidade

O site é a prova mais pública de um estudante de segurança, e o que `/seguranca` afirma precisa ser verdade. Regra: **nada é anunciado em `/seguranca` antes de ser testado em produção.**

**Momento:** o titular quer o site o mais blindado possível, tratado na fase final ([roteiro](../ROADMAP.md)). Os controles que moldam a arquitetura (site estático, CSP sem `unsafe-inline`) valem desde o início. Ajustes no VPS, armadilhas e auditoria ficam para o final.

## Modelo de ameaças

| Ativo | Por quê | Ameaça | Controle |
|---|---|---|---|
| Reputação do titular | Um defeito aqui contradiz o tema do site | Injeção de conteúdo, desfiguração | Site estático, CSP, contêiner só leitura |
| Dados pessoais | O acervo de origem tem CPF e RG | Publicação por engano | Nada copiado de `certificados/`; verificação no build |
| Telefone | Coletado por robôs | Spam | Revelação ao clicar, fora dos arquivos estáticos |
| **Sistemas no mesmo VPS** | Há sistemas de clientes no servidor | Curiosos varrendo o IP por causa do CTF | Sem IP em lugar nenhum; regra explícita no CTF; hardening do contêiner |
| Cadeia de suprimentos | Muitas dependências | Pacote malicioso | Lockfile, scripts bloqueados, revisão, SBOM, auditoria |
| Segredos | Chaves de serviços | Vazamento no Git ou no bundle | Gitleaks; só variáveis públicas por natureza no cliente |
| Disponibilidade | Pode afetar vizinhos no VPS | Abuso de proxies | Limite de taxa, limite de tamanho, memória limitada |
| Visitantes | Privacidade | Rastreamento | Sem cookies, proxies próprios e sem terceiros no navegador |

**Fora de escopo:** defesa contra atacante com acesso ao VPS ou à conta do GitHub, DDoS volumétrico (sem CDN) e robôs dedicados a extrair o telefone.

## Cabeçalhos

Definidos no nginx do contêiner, exceto HSTS, no nginx do host.

| Cabeçalho | Valor |
|---|---|
| `Content-Security-Policy` | Veja a seção abaixo |
| `Strict-Transport-Security` | `max-age=31536000` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `X-Selo` | Um dos selos do CTF |

**Sobre HSTS:** sem `includeSubDomains`, porque `warley.` é subdomínio de `ferzion.com.br`, e sem `preload`, que exige o domínio raiz. Isso limita a nota em algumas ferramentas e é uma decisão consciente, que `/seguranca` pode explicar.

**COEP:** só entra se `SharedArrayBuffer` for necessário. Não é previsto.

## Política de conteúdo

```text
default-src 'none';
script-src 'self' 'sha256-…' 'sha256-…';
style-src 'self';
style-src-attr 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
worker-src 'self';
manifest-src 'self';
media-src 'none';
object-src 'none';
frame-src 'none';
frame-ancestors 'none';
base-uri 'none';
form-action 'none';
```

### Decisões

| Diretiva | Motivo |
|---|---|
| `script-src` com hashes | Nonce exige renderização em servidor. Os scripts inline do Next (`self.__next_f.push`) precisam de hash |
| Sem `unsafe-inline` nem `unsafe-eval` em script | Objetivo central. `lottie_light` foi escolhido por não usar `eval` |
| `style-src-attr 'unsafe-inline'` | React e Motion podem renderizar `style=""`. Risco menor que script. Remover se os testes permitirem. CSSOM não precisa dessa permissão |
| `wasm-unsafe-eval` | **Fora por padrão.** Só entra se meshopt ou KTX2 forem adotados, registrando o motivo |
| `worker-src 'self'` | Só o `/sw.js`. Sem `blob:`: a cena não usa workers, e o `lottie_light` roda sem eles nem `eval` |
| `connect-src 'self'` | Terminal, proxies e cena. Nada de terceiros |

### Geração dos hashes

`scripts/pos-build.ts`:

1. Percorre cada HTML de `out/`, extrai cada `<script>` inline e calcula SHA-256.
2. Produz a CSP daquela rota.
3. Escreve `deploy/csp-map.conf`, um `map $uri $csp` para o nginx.
4. Falha se um cabeçalho passar de 6 KB.

**Plano B, se os cabeçalhos ficarem grandes:** transformar os scripts inline em arquivos externos, como faz a abordagem relatada pela comunidade, com nova verificação.

**Riscos conhecidos:**

- Os scripts inline do Next mudam entre versões, e por isso os hashes são gerados a cada build, nunca fixos.
- Fontes comunitárias relatam que hashes globais não cabem em um único cabeçalho, daí a CSP por rota.
- Conferir a [documentação oficial de CSP do Next](https://nextjs.org/docs/app/guides/content-security-policy) na versão instalada. `experimental.sri` é experimental, e sua combinação com `output: "export"` não está confirmada: testar na Fase 5.

**Validação:** Playwright abre todas as rotas e falha com qualquer violação de CSP no console. Primeiro em `Content-Security-Policy-Report-Only`; depois, em modo de bloqueio.

**Trusted Types:** `require-trusted-types-for 'script'` será testado em modo de relatório. Entra se Next, Three e GSAP funcionarem sem exceção.

**Dados e links de saída:** certificados abrem páginas externas com `rel="noopener noreferrer"`. Links externos não precisam de `connect-src`.

## Contêiner

```yaml
services:
  web:
    image: portfolio:${IMAGE_TAG:?}
    container_name: portfolio_web
    read_only: true
    tmpfs: ["/tmp:size=16m"]   # a imagem sem privilégios grava pid e temporários em /tmp
    cap_drop: [ALL]
    security_opt: ["no-new-privileges:true"]
    mem_limit: 96m
    pids_limit: 64
    ports: ["127.0.0.1:${PORTA:?}:8080"]
```

- **Imagem:** `nginxinc/nginx-unprivileged:1.29-alpine`. Roda sem root. Fixar o digest na fase de blindagem.
- **Testado em 05/11/2026** com todas essas restrições: 8 MB de memória em repouso, usuário `nginx`, CSP por rota e 404 correto.
- **Apenas leitura** com tmpfs mínimo.
- **Sem shell de deploy dentro do contêiner:** nada é executado em produção além do nginx.
- **Trivy** varre a imagem no CI e barra achados críticos.

## Proxies

Ficam no nginx do contêiner, com destino fixo no arquivo de configuração, para nunca virar proxy aberto.

| Caminho | Destino | Limite |
|---|---|---|
| `/_v/` | Hosts do PostHog, conforme a [documentação de proxy](https://posthog.com/docs/advanced/proxy/nginx) | 5 req/s por IP, corpo ≤ 64 KB |
| `/_e` | `POST` para o endpoint de envelope do projeto do Sentry | 2 req/s por IP, corpo ≤ 256 KB, só POST |

**Ao chamar o Sentry por nginx:** como o destino é fixo, um envelope de outro projeto não muda o caminho. A documentação do `tunnelRoute` do `@sentry/nextjs` não serve aqui, pois depende de servidor, então usamos a opção `tunnel` do `@sentry/browser`.

**Sem variável, sem proxy:** o build só inclui esses blocos se a chave existir. O IP do visitante não é repassado ao Sentry: `proxy_set_header X-Forwarded-For ""`.

## Cadeia de suprimentos

| Medida | Onde |
|---|---|
| `pnpm` bloqueia scripts de instalação por padrão; aprovar um a um | `pnpm-workspace.yaml` |
| Atraso mínimo para versões novas (`minimumReleaseAge`, 7 dias) | Na fase de blindagem: ativá-lo agora bloqueou a instalação |
| Lockfile obrigatório: `--frozen-lockfile` | CI e Docker |
| `pnpm audit` barra crítico ou alto | CI |
| Gitleaks | CI e, se possível, pré-commit |
| Trivy em imagem e sistema de arquivos | CI |
| zizmor para os workflows; ações fixadas por SHA | CI |
| SBOM CycloneDX em `/sbom.json` | Pós-build |
| Skills de terceiros: lock em `skills-lock.json`, revisar ao atualizar | Repositório |

## Segredos

- `.env` nunca vai para o Git. `.env.example` lista só nomes.
- O telefone é tratado como segredo: fica em `WHATSAPP_NUMERO`, fora do código e dos documentos.
- **Antes de um repositório público:** `docs/` traz IP, porta, caminhos do servidor, descrição dos vizinhos no VPS e pendências pessoais. Ver [pendências](pendencias.md#para-o-lançamento-o-titular-faz-no-momento-do-deploy).
- Chave do PostHog e DSN do Sentry são públicas por natureza, mas seguem por variável para facilitar a troca.
- Nenhum outro segredo existe em produção, já que o site não tem servidor de aplicação.
- Os scripts locais do Sanity, se usarem token, leem do ambiente.

## Exposição do servidor

Achados de 05/11/2026, tratados na fase de blindagem ([pendências](pendencias.md)).

| Achado | Como resolver |
|---|---|
| `Server: nginx/1.24.0 (Ubuntu)` nas respostas | `server_tokens off;` no bloco `http` do nginx do host |
| Certificado ausente para `warley.ferzion.com.br` | Certbot |

A resposta do proxy `Server` continua revelando `nginx`, sem versão, o que é normal.

## Arquivos públicos

**`/.well-known/security.txt`** (RFC 9116), com `Expires` gerado a cada build, sem o comentário acima no arquivo final, e validade verificada no CI:

```text
Contact: mailto:warley.ferraz.wf@gmail.com
Expires: 2027-05-05T00:00:00.000Z   # gerado no build: data de hoje + 6 meses
Preferred-Languages: pt, en
Canonical: https://warley.ferzion.com.br/.well-known/security.txt
Policy: https://warley.ferzion.com.br/seguranca
```

**`/robots.txt`:** permite tudo e aponta para o sitemap.

**`/humans.txt`:** créditos, stack e apoio de IA.

## Privacidade e LGPD

| Item | Decisão |
|---|---|
| Cookies | Nenhum. Sem banner |
| `localStorage` | Só preferências e selos, sem identificador, e nada enviado |
| PostHog | Via proxy, em memória, sem gravação e com IP descartado |
| Sentry | Sem dados pessoais e sem IP |
| Logs do nginx | Sem `access_log`, como no padrão do servidor; só erros |
| Fontes e scripts | Tudo do próprio domínio |
| Dados do titular | Só os publicados por decisão dele |
| Aviso | `/seguranca#privacidade` |

**Atenção:** mesmo sem cookies, PostHog e Sentry fazem tratamento de dados técnicos. O texto de privacidade precisa ser conferido quando forem ligados, e o titular pode decidir mantê-los desligados.

## Verificação em produção

Publicar em `/seguranca` só depois de confirmar:

```bash
curl -sI https://warley.ferzion.com.br | grep -iE 'content-security|strict-transport|x-content|referrer|permissions|cross-origin'
curl -s https://warley.ferzion.com.br/.well-known/security.txt
```

Depois:

- [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory): meta de A+.
- [SSL Labs](https://www.ssllabs.com/ssltest/): meta de A ou A+.
- [SecurityHeaders](https://securityheaders.com/): meta de A+, sabendo que a pontuação pode variar com `style-src-attr`.
- Testar uma alteração de `Host`, confirmar que só o domínio certo é servido e que nada do VPS vaza.

## Armadilhas

Respostas temáticas para quem sonda o site, especificadas em [07-recursos-interativos.md](07-recursos-interativos.md#armadilhas-para-quem-tenta-explorar). Implementadas em `location` específicos do nginx do contêiner, com limite de taxa, sem log e sem nenhum segredo real. Qualquer arquivo-isca é verificado para garantir que não pareça credencial válida a um scanner automatizado de terceiros.

## Relato ao currículo

A infraestrutura e o pipeline deste site, depois de reais, são evidência legítima para a base do currículo em `../curriculo`. O registro é feito lá, pelo titular, somente após ele saber explicar cada controle em uma entrevista.
