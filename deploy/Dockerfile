FROM node:24-slim AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG SITE_URL
ARG WHATSAPP_NUMERO=""
RUN SITE_URL=$SITE_URL WHATSAPP_NUMERO=$WHATSAPP_NUMERO pnpm build

FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY --from=build /app/deploy/nginx-container.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/deploy/csp-map.conf         /etc/nginx/conf.d/00-csp-map.conf
COPY --from=build /app/deploy/cabecalhos.conf      /etc/nginx/snippets/cabecalhos.conf
COPY --from=build /app/out/                        /usr/share/nginx/html/
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/saude.txt || exit 1
