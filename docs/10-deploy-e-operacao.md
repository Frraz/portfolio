# 10 — Deploy e operação

Segue o padrão já usado no servidor, descrito em `../bibliotheon/docs/06-deploy.md`. **O titular faz o Git e o deploy manualmente:** `git init`, commits, push, comandos no VPS, certificado HTTPS e criação de contas. O agente prepara os arquivos e o passo a passo.

## O servidor

| Item | Valor |
|---|---|
| Domínio | `warley.ferzion.com.br` |
| DNS | Registro A → `147.93.15.214`, resolvendo em 05/11/2026 |
| Acesso | `ssh deploy@147.93.15.214`, usuário no grupo `docker`, sem `sudo` sem senha |
| Sistema compartilhado | **Sim**, com vários sistemas, incluindo de clientes |
| Certificado | **Ainda não existe** para este domínio. O acesso HTTPS falha na verificação |

### Regras do servidor

Vêm de `/var/www/docker-instances/README.md`, citadas em `../byakugan/DEPLOY.md`.

1. Nenhum contêiner publica 80 ou 443. Só o nginx do host.
2. O site publica apenas em `127.0.0.1:<porta>`.
3. `container_name` com prefixo: `portfolio_web`.
4. Diretório: `/var/www/docker-instances/Portfolio`.

### Reserva

| Recurso | Valor |
|---|---|
| Porta loopback | **8030 (candidata)**. Portas registradas como ocupadas: 3000, 8001–8007, 8010–8013, 8020, 8080, 8110, 8120, 9000. Confirmar antes: `ss -ltn | grep 8030` |
| Compose | `deploy/docker-compose.prod.yml` |
| Vhost | `/etc/nginx/sites-available/portfolio` |
| Memória | 96 MB em execução. Conferir `free -h` antes do primeiro build |

## Dockerfile

```dockerfile
FROM node:24-slim AS build
RUN corepack enable
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG SITE_URL
ARG NEXT_PUBLIC_POSTHOG_KEY=""
ARG NEXT_PUBLIC_SENTRY_DSN=""
ARG WHATSAPP_NUMERO=""
RUN SITE_URL=$SITE_URL WHATSAPP_NUMERO=$WHATSAPP_NUMERO pnpm build

FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY --from=build /app/deploy/nginx-container.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/deploy/csp-map.conf         /etc/nginx/conf.d/00-csp-map.conf
COPY --from=build /app/deploy/cabecalhos.conf      /etc/nginx/snippets/cabecalhos.conf
COPY --from=build /app/out/                        /usr/share/nginx/html/
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/saude.txt
```

`csp-map.conf` e `out/` nascem no pós-build, por isso tudo vem do estágio de build. O `WHATSAPP_NUMERO` entra como argumento de build e não fica no contêiner final, só no chunk gerado.

## nginx do contêiner

```nginx
limit_req_zone $binary_remote_addr zone=proxy_v:1m rate=5r/s;
limit_req_zone $binary_remote_addr zone=proxy_e:1m rate=2r/s;

server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    server_tokens off;
    access_log off;
    gzip_static on;

    error_page 404 /404.html;

    # add_header não herda de níveis acima: todo location repete o include.
    location / {
        include /etc/nginx/snippets/cabecalhos.conf;
        add_header Cache-Control "no-cache";
        try_files $uri $uri.html $uri/ =404;
    }
    location /_next/static/ {
        include /etc/nginx/snippets/cabecalhos.conf;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location ~ ^/(gl|fontes)/ {
        include /etc/nginx/snippets/cabecalhos.conf;
        add_header Cache-Control "public, max-age=2592000";
    }
    location = /sw.js {
        include /etc/nginx/snippets/cabecalhos.conf;
        add_header Cache-Control "no-cache";
    }
    location = /saude.txt { access_log off; add_header Cache-Control "no-store"; }
}
```

**A CSP por rota** vem de `map $uri $csp { ... }`. Como o `add_header` é avaliado no fim da requisição, `$uri` já tem o arquivo final: as chaves do mapa usam `/index.html`, `/cv.html` e assim por diante. Um teste de Playwright confirma cada rota.

**Compressão:** `gzip_static` serve os `.gz` gerados no build. Brotli exige módulo que a imagem oficial não traz, e o ganho não justifica uma imagem de terceiros.

## nginx do host

Salvar em `deploy/nginx-host.conf`. O próprio `nginx -t` é a trava antes do reload.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name warley.ferzion.com.br;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name warley.ferzion.com.br;

    ssl_certificate     /etc/letsencrypt/live/warley.ferzion.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/warley.ferzion.com.br/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    access_log off;
    client_max_body_size 256k;

    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://127.0.0.1:8030;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_read_timeout 15s;
    }
}
```

**Avisos conhecidos:** o nginx 1.24 usa `http2` no `listen` (a diretiva `http2 on` veio depois). Os avisos `protocol options redefined`, já registrados pelo Bibliotheon, vêm de outros sites e são inofensivos. Conferir se este site não introduz outros.

## Primeiro deploy

Com o titular executando os passos marcados com `sudo`.

```bash
# 1. No servidor: conferir folga
ss -ltn | grep 8030   # não deve retornar nada
free -h

# 2. Clonar e configurar
cd /var/www/docker-instances && git clone <repo> Portfolio && cd Portfolio
cp .env.example .env && nano .env      # SITE_URL, PORTA, WHATSAPP_NUMERO, chaves opcionais

# 3. Subir
docker compose --env-file .env -f deploy/docker-compose.prod.yml up -d --build
curl -fsS http://127.0.0.1:8030/saude.txt

# 4. Certificado e vhost (sudo)
sudo certbot certonly --nginx -d warley.ferzion.com.br
sudo cp deploy/nginx-host.conf /etc/nginx/sites-available/portfolio   # confira a porta no proxy_pass
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo nginx -t && sudo systemctl reload nginx

# 5. Ocultar a versão do nginx, um ajuste global de baixo risco (sudo)
#    em /etc/nginx/nginx.conf, no bloco http: server_tokens off;
sudo nginx -t && sudo systemctl reload nginx

# 6. Conferir
curl -sI https://warley.ferzion.com.br | head -20
docker ps    # os outros sistemas continuam intactos
```

A renovação do certificado é a do Certbot já instalado. Depois do primeiro deploy, confirmar com `sudo certbot renew --dry-run`.

## Atualizar (todo deploy)

**Fluxo:** commit e push na máquina local; no servidor, `./deploy/atualizar.sh`. O script é uma adaptação de `../bibliotheon/atualizar.sh`:

1. Recusa rodar se houver alteração local no servidor.
2. `git fetch`; informa se há versão nova ou se o servidor está à frente (falta push).
3. Sai sem fazer nada se a versão já estiver no ar, salvo `--forcar`.
4. Guarda a imagem atual e constrói `portfolio:<commit>`.
5. Sobe a imagem nova e testa `/saude.txt` por 60 s.
6. Se falhar, **volta sozinho à imagem anterior** e sai com erro.
7. Se passar, grava `IMAGE_TAG` no `.env` e testa o domínio público.

```bash
ssh deploy@147.93.15.214 'cd /var/www/docker-instances/Portfolio && ./deploy/atualizar.sh'
```

Use `--forcar` depois de mudar o `.env`, pois os valores entram no build.

## Git

O titular cria o repositório. O `.gitignore` já exclui `.env*`, `node_modules/`, `.next/`, `out/` e relatórios de teste. **`docs/` não é excluída:** se o repositório for público, decida antes do primeiro commit, porque ela traz IP, porta e detalhes do VPS.

## Antes de cada push

```bash
pnpm verificar && pnpm build && pnpm test && pnpm test:e2e
```

## Rollback manual

```bash
git checkout <sha-anterior>
IMAGE_TAG=<sha-anterior> docker compose --env-file .env -f deploy/docker-compose.prod.yml up -d --build
```

O site não tem dados, então não há banco a restaurar. Tudo se recupera pelo Git.

## Backup

Sem backup de dados, pois tudo está no repositório. O repositório precisa ter uma cópia fora do VPS, no GitHub. Os assets gerados (GLB, pôsteres, PDF) também vão no Git, para o build não depender de Blender.

## Monitoramento

| O quê | Como | Frequência |
|---|---|---|
| Saúde do contêiner | `HEALTHCHECK` e `restart: unless-stopped` | 30 s |
| Disponibilidade externa | Uptime, que o titular já usa. Para decidir no final | 5 min |
| Erros de navegador | Sentry, quando ligado | Contínuo |
| Certificado | Certbot e alerta do monitor externo | Diário |
| `security.txt` | Teste de validade no CI | Por build |

O titular monitora redes no trabalho, e um laboratório próprio com Zabbix ou Prometheus olhando este site seria evidência legítima, se for feito por ele.

## Limites de operação

- Nada neste projeto mexe em outro sistema do VPS.
- Mudanças em `/etc/nginx` usam sempre `nginx -t` antes do reload.
- Não subir nada sem o titular confirmar. O deploy para produção é sempre decisão dele.

## Armadilhas previstas

| Armadilha | Prevenção |
|---|---|
| `SITE_URL` fixada no build; ausência leva a `localhost` em canonical e sitemap | O compose usa `${SITE_URL:?}` e o pós-build verifica |
| `add_header` não herda entre níveis do nginx | Include em todo `location`, com teste E2E de cabeçalhos |
| CSP defasada depois de editar HTML à mão | HTML nunca é editado depois do pós-build |
| Service worker antigo prendendo versão velha | `sw.js` sem cache, com `skipWaiting` e versão por build |
| Build sem memória no VPS compartilhado | Conferir `free -h`. Se faltar, construir a imagem no CI e publicar no GHCR |
| Porta do `.env` diferente do `proxy_pass` | Checagem no `atualizar.sh` |
