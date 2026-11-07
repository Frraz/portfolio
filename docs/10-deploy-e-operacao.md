# 10 — Deploy e operação

Segue o padrão dos outros sistemas do servidor. **O titular faz o Git e o deploy manualmente:** `git init`, commits, push, comandos no VPS, certificado HTTPS e criação de contas. Os arquivos e o passo a passo ficam neste repositório.

## O servidor

| Item | Valor |
|---|---|
| Domínio | `warley.ferzion.com.br` |
| DNS | Registro A para o IP do VPS, resolvendo desde 05/11/2026. O IP fica fora do repositório |
| Acesso | `ssh deploy@<IP do VPS>`, usuário no grupo `docker`, sem `sudo` sem senha |
| Sistema compartilhado | **Sim**, com vários sistemas, incluindo de clientes |
| Certificado | Emitido em 05/11/2026 pelo Certbot, válido até 03/02/2027, com renovação automática. Falta confirmar com `sudo certbot renew --dry-run` |

### Regras do servidor

Vêm de `/var/www/docker-instances/README.md`, no próprio servidor.

1. Nenhum contêiner publica 80 ou 443. Só o nginx do host.
2. O site publica apenas em `127.0.0.1:<porta>`.
3. `container_name` com prefixo: `portfolio_web`.
4. Diretório: `/var/www/docker-instances/portfolio`.
5. O Compose tem `name: portfolio`. Sem isso, o projeto herdaria o nome da pasta `deploy` e poderia recriar o serviço `web` de outro sistema.

### Reserva

| Recurso | Valor |
|---|---|
| Porta loopback | **8030**, em uso por este site desde 05/11/2026 |
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

O arquivo é `deploy/nginx-container.conf`. Como o `add_header` não herda de níveis acima, todo `location` repete o include dos cabeçalhos.

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    server_tokens off;
    access_log off;
    gzip_static on;
    gzip_vary on; # caches intermediários guardam a versão comprimida e a crua separadas
    absolute_redirect off;

    error_page 404 /404.html;

    location / {
        include /etc/nginx/snippets/cabecalhos.conf;
        add_header Cache-Control "no-cache" always;
        try_files $uri $uri.html $uri/ =404;
    }
    location = /404.html {
        internal;
        include /etc/nginx/snippets/cabecalhos.conf;
        add_header Cache-Control "no-cache" always;
    }
    location /_next/static/ {
        include /etc/nginx/snippets/cabecalhos.conf;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }
    location = /manifest.webmanifest {
        include /etc/nginx/snippets/cabecalhos.conf;
        types { }
        default_type application/manifest+json;
        add_header Cache-Control "no-cache" always;
    }
    location /gl/ {
        types { model/gltf-binary glb; application/json json; image/png png; }
        include /etc/nginx/snippets/cabecalhos.conf;
        add_header Cache-Control "public, max-age=86400" always; # nomes sem hash: um dia, para o deploy chegar logo
    }
    # Imagem de compartilhamento e ícones: nomes sem hash, mudam raramente. Uma semana, com revalidação depois.
    location ~ ^/(og/|icone|apple-touch-icon) {
        include /etc/nginx/snippets/cabecalhos.conf;
        add_header Cache-Control "public, max-age=604800" always;
    }
    location = /saude.txt {
        add_header Cache-Control "no-store" always;
    }
}
```

**A CSP por rota** vem de `map $uri $csp { ... }`. Como o `add_header` é avaliado no fim da requisição, `$uri` já tem o arquivo final: as chaves do mapa usam `/index.html`, `/cv.html` e assim por diante. Um teste de Playwright confirma cada rota.

**Compressão:** `gzip_static` serve os `.gz` gerados no build, com `gzip_vary`. Brotli exige módulo que a imagem oficial não traz, e o ganho não justifica uma imagem de terceiros.

**Cache:** HTML, `sw.js`, `tema.js` e o manifesto revalidam a cada visita (`no-cache`), para um deploy chegar na hora. Os arquivos de `/_next/static/` têm hash no nome e ficam um ano (`immutable`). O atlas da chuva fica um dia; ícones e imagem de compartilhamento, uma semana. O service worker guarda só o que a primeira tela usa e o resto conforme a visita pede ([08](08-arquitetura-tecnica.md#desempenho-de-carregamento)).

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
    # Durante o desenvolvimento: o texto ainda não foi aprovado. Remover no lançamento (Fase 11).
    add_header X-Robots-Tag "noindex, nofollow" always;

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

**Avisos conhecidos:** o nginx 1.24 usa `http2` no `listen` (a diretiva `http2 on` veio depois). Os avisos `protocol options redefined` são inofensivos: aparecem para vários sites do servidor, e este também gera um, em `[::]:443`, igual aos demais.

## Primeiro deploy

Com o titular executando os passos marcados com `sudo`.

```bash
# 1. No servidor: conferir folga
ss -ltn | grep 8030   # não deve retornar nada
free -h

# 2. Clonar e configurar
cd /var/www/docker-instances && git clone <repo> portfolio && cd portfolio
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

## Lançamento: indexação

O vhost do host ainda manda `X-Robots-Tag: noindex, nofollow`, de propósito, enquanto o titular revisa o site. Para o Google indexar:

```bash
# No VPS (sudo): apagar a linha do X-Robots-Tag em /etc/nginx/sites-available/portfolio
sudo nano /etc/nginx/sites-available/portfolio
sudo nginx -t && sudo systemctl reload nginx
curl -sI https://warley.ferzion.com.br | grep -i robots   # não deve retornar nada
```

Apagar a mesma linha em `deploy/nginx-host.conf` no repositório. Depois, no [Google Search Console](https://search.google.com/search-console): adicionar a propriedade de domínio `warley.ferzion.com.br` (verificação por registro TXT no DNS), enviar `https://warley.ferzion.com.br/sitemap.xml` e pedir a indexação da página inicial. O Bing Webmaster Tools importa a propriedade do Search Console.

Para conferir o compartilhamento: colar o endereço no LinkedIn (Post Inspector) e no validador de dados estruturados do Google (Rich Results Test).

## Atualizar (todo deploy)

**Fluxo:** commit e push na máquina local; no servidor, `./deploy/atualizar.sh`, no mesmo fluxo dos outros sistemas do servidor:

1. Recusa rodar se houver alteração local no servidor.
2. `git fetch`; informa se há versão nova ou se o servidor está à frente (falta push).
3. Sai sem fazer nada se a versão já estiver no ar, salvo `--forcar`.
4. Guarda a imagem atual e constrói `portfolio:<commit>`.
5. Sobe a imagem nova e testa `/saude.txt` por 60 s.
6. Se falhar, **volta sozinho à imagem anterior** e sai com erro.
7. Se passar, grava `IMAGE_TAG` no `.env` e testa o domínio público.

```bash
ssh deploy@<IP do VPS> 'cd /var/www/docker-instances/portfolio && ./deploy/atualizar.sh'
```

Use `--forcar` depois de mudar o `.env`, pois os valores entram no build.

## Git

O titular cria o repositório. O `.gitignore` exclui `.env*`, `node_modules/`, `.next/`, `out/`, os mapas de CSP gerados e os relatórios de teste. `docs/` vai no repositório, sem IP; ainda assim descreve portas e regras do VPS, por isso o repositório fica **privado**, e o VPS o lê por uma chave de implantação somente leitura.

Arquivos de configuração local de editor e de ferramentas ficam fora do Git por `.git/info/exclude`, que não é versionado.

### Repositório limpo

O primeiro repositório, público, guardou no histórico arquivos que não fazem parte do site e o IP do VPS em `docs/`. Apagar agora não os tira do histórico. Em 07/11/2026 o titular decidiu recriar o repositório com um único commit limpo:

```bash
# 1. No GitHub: apagar o repositório antigo (Settings → Delete) ou criar um novo, privado.
# 2. Na máquina local, na pasta do portfólio:
rm -rf .git
git init -b main
# Antes do primeiro add: listar em .git/info/exclude os arquivos locais de editor e de ferramentas
nano .git/info/exclude
git status --short | head -50       # conferir: só arquivos do site, da documentação e dos testes
git add -A && git commit -m "Portfólio Sinal"
git remote add origin git@github.com:Frraz/portfolio.git
git push -u origin main
# 3. No VPS: o clone antigo aponta para o histórico apagado. Clonar de novo:
#    cd /var/www/docker-instances && mv portfolio portfolio-antigo && git clone <repo> portfolio
#    cp portfolio-antigo/.env portfolio/.env && cd portfolio && ./deploy/atualizar.sh --forcar
#    Depois de conferir o site: rm -rf ../portfolio-antigo
```

Forks e cópias que alguém tenha feito enquanto o repositório era público não são alcançados por isso.

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

Sem backup de dados, pois tudo está no repositório. O repositório precisa ter uma cópia fora do VPS, no GitHub. Os assets gerados (atlas da chuva, trilhas, imagem de compartilhamento, ícones e PDF) também vão no Git, para o build não depender dos scripts de geração.

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
| `SITE_URL` fixada no build | Sem ela, vale o domínio real, nunca `localhost` (`src/site.ts`). O compose exige `${SITE_URL:?}` |
| `add_header` não herda entre níveis do nginx | Include em todo `location`, com teste E2E de cabeçalhos |
| CSP defasada depois de editar HTML à mão | HTML nunca é editado depois do pós-build |
| Service worker antigo prendendo versão velha | `sw.js` sem cache, com `skipWaiting` e versão por build |
| Build sem memória no VPS compartilhado | Conferir `free -h`. Se faltar, construir a imagem no CI e publicar no GHCR |
| Porta do `.env` diferente do `proxy_pass` | Checagem no `atualizar.sh` |
