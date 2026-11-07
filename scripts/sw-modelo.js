/*
 * Service worker do site. Versão e lista são preenchidas no pós-build.
 * O pré-cache leva só o que a primeira tela usa (HTML, CSS, fontes e os scripts da página inicial). A cena 3D e o
 * resto entram no cache quando o navegador pede, na primeira vez que forem usados.
 * HTML: rede primeiro, cache como reserva e /offline por último. Arquivos com hash: cache primeiro.
 * Só cuida do próprio domínio. Não guarda dados do visitante.
 */
const VERSAO = "__VERSAO__";
const PRECACHE = ["__PRECACHE__"];
const CACHE = `sinal-${VERSAO}`;
// Prefixos de caches deste site, inclusive os de versões antigas, apagados quando uma versão nova assume.
const PREFIXOS = ["sinal-", "nave-"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      // Um arquivo que falhe não pode impedir a instalação.
      await Promise.all(PRECACHE.map((u) => c.add(u).catch(() => {})));
      await self.skipWaiting();
    }),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => PREFIXOS.some((p) => k.startsWith(p)) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const imutavel = (url) => url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/gl/");

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((r) => {
          if (r.ok) {
            const copia = r.clone();
            caches.open(CACHE).then((c) => c.put(req, copia));
          }
          return r;
        })
        .catch(async () => (await caches.match(req)) ?? (await caches.match("/offline")) ?? Response.error()),
    );
    return;
  }
  if (imutavel(url)) {
    e.respondWith(
      caches.match(req).then(
        (a) =>
          a ??
          fetch(req).then((r) => {
            if (r.ok) {
              const copia = r.clone();
              caches.open(CACHE).then((c) => c.put(req, copia));
            }
            return r;
          }),
      ),
    );
  }
});
