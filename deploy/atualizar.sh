#!/usr/bin/env bash
# Coloca a versão mais recente no ar. Rode NO SERVIDOR, depois do push:
#   cd /var/www/docker-instances/portfolio && ./deploy/atualizar.sh [--forcar]
# Constrói a imagem, troca o contêiner e confere /saude.txt por 60 s. Se falhar, volta à imagem anterior.
set -euo pipefail
cd "$(dirname "$0")/.."

FORCAR=0
case "${1:-}" in
  --forcar) FORCAR=1 ;;
  "") ;;
  *) echo "Uso: ./deploy/atualizar.sh [--forcar]"; exit 2 ;;
esac

[ -f .env ] || { echo "✗ Falta o .env (copie de .env.example)"; exit 1; }
set -a; . ./.env; set +a
COMPOSE="docker compose --env-file .env -f deploy/docker-compose.prod.yml"

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "✗ Há alterações locais no servidor:"; git status --short --untracked-files=no; exit 1
fi
git fetch --quiet origin
RAMO="$(git rev-parse --abbrev-ref HEAD)"
if [ "$(git rev-parse HEAD)" != "$(git rev-parse "origin/$RAMO")" ]; then
  if git merge-base --is-ancestor "origin/$RAMO" HEAD; then
    echo "  O servidor está à frente do GitHub: falta o push na sua máquina."
  else
    git pull --ff-only --quiet origin "$RAMO"
  fi
fi

TAG="$(git rev-parse --short HEAD)"
ANTERIOR="$(docker inspect --format '{{.Config.Image}}' portfolio_web 2>/dev/null || true)"
if [ "$FORCAR" = 0 ] && [ "$ANTERIOR" = "portfolio:$TAG" ] && curl -fsS "http://127.0.0.1:${PORTA}/saude.txt" >/dev/null 2>&1; then
  echo "✓ O site já roda a versão $TAG."; exit 0
fi

export IMAGE_TAG="$TAG"
echo "▸ Build da imagem portfolio:$TAG"
$COMPOSE build
echo "▸ Subindo"
$COMPOSE up -d

for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${PORTA}/saude.txt" >/dev/null 2>&1; then
    echo "✓ No ar: portfolio:$TAG"
    grep -q '^IMAGE_TAG=' .env && sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$TAG/" .env || echo "IMAGE_TAG=$TAG" >> .env
    curl -fsS "${SITE_URL}/saude.txt" >/dev/null 2>&1 && echo "✓ Também responde em ${SITE_URL}" || echo "  ! ${SITE_URL} não respondeu: confira nginx e DNS."
    exit 0
  fi
  sleep 2
done

echo "✗ Não respondeu. Voltando para: ${ANTERIOR:-nenhuma}"
$COMPOSE logs --tail 40 web || true
if [ -n "$ANTERIOR" ]; then
  export IMAGE_TAG="${ANTERIOR##*:}"
  $COMPOSE up -d --no-build
fi
exit 1
