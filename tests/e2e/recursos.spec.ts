import { expect, test, type Page } from "@playwright/test";

// O atalho nasce num useEffect da barra. Sob carga (testes de WebGL em paralelo), a hidratação pode chegar depois
// do `networkidle`: repete o atalho até o terminal abrir. Abrir de novo não muda nada.
async function abrirTerminal(page: Page) {
  const entrada = page.getByRole("textbox", { name: "Comando" });
  await expect(async () => {
    await page.keyboard.press("Control+k");
    await expect(entrada).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 30_000 });
  return entrada;
}

test.describe("terminal", () => {
  test("abre por teclado, responde e devolve o foco", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const entrada = await abrirTerminal(page);
    await expect(entrada).toBeFocused();
    await entrada.fill("whoami");
    await entrada.press("Enter");
    await expect(page.getByRole("log")).toContainText("Analista de Redes N2");
    await entrada.fill("cabecalhos");
    await entrada.press("Enter");
    await expect(page.getByRole("log")).toContainText("content-security-policy: default-src 'none'");
    await expect(page.getByRole("log")).toContainText("x-selo: CABECALHO-HTTP");
    await page.keyboard.press("Escape");
    await expect(entrada).toBeHidden();
  });

  test("tema pelo terminal e histórico por seta", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const entrada = await abrirTerminal(page);
    await entrada.fill("tema rubro");
    await entrada.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-tema", "rubro");
    await entrada.press("ArrowUp");
    await expect(entrada).toHaveValue("tema rubro");
  });

  test("não expõe o telefone nem em certificados nem em contato", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const entrada = await abrirTerminal(page);
    for (const cmd of ["contato", "sobre", "agora"]) {
      await entrada.fill(cmd);
      await entrada.press("Enter");
    }
    await expect(page.getByRole("log")).not.toContainText(/\(\d{2}\) \d{5}/);
    await expect(page.getByRole("log")).toContainText("seção Contato");
  });
});

test.describe("CTF", () => {
  test("os selos estão nos lugares públicos e o progresso fica só no navegador", async ({ page, request }) => {
    const r = await page.goto("/", { waitUntil: "networkidle" });
    expect(r!.headers()["x-selo"]).toBe("CABECALHO-HTTP");
    expect(await (await request.get("/")).text()).toContain("selo 0: FONTE-VISTA");
    expect(await (await request.get("/robots.txt")).text()).toContain("selo 2: ROBOS-LEEM");
    expect(await (await request.get("/.well-known/security.txt")).text()).toContain("selo 4: SECURITY-TXT");
    expect(await page.content()).toContain("selo 6: METADADO-SVG");
    const entrada = await abrirTerminal(page);
    await entrada.fill("selo lumen");
    await entrada.press("Enter");
    await expect(page.getByRole("log")).toContainText("selo 7 confirmado");
    expect(await page.evaluate(() => localStorage.getItem("selos"))).toBe("[7]");
  });

  test("o console traz a assinatura e o selo 1", async ({ page }) => {
    const mensagens: string[] = [];
    page.on("console", (m) => mensagens.push(m.text()));
    await page.goto("/", { waitUntil: "networkidle" });
    await expect.poll(() => mensagens.join("\n")).toContain("selo 1: CONSOLE-ABERTO");
  });

  test("o aviso de selo aparece sem erro sob a CSP real", async ({ page }) => {
    const erros: string[] = [];
    page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
    page.on("pageerror", (e) => erros.push(String(e)));
    await page.goto("/", { waitUntil: "networkidle" });
    const entrada = await abrirTerminal(page);
    await entrada.fill("selo fonte-vista");
    await entrada.press("Enter");
    await expect(page.locator(".selo-aviso")).toContainText("selo 0");
    expect(erros).toEqual([]);
  });

  test("os nove selos liberam o tema Fósforo", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("selos", "[0,1,2,3,4,5,6,7,8]"));
    await page.goto("/", { waitUntil: "networkidle" });
    const entrada = await abrirTerminal(page);
    await entrada.fill("tema fosforo");
    await entrada.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-tema", "fosforo");
    // O tema liberado continua depois de recarregar (public/tema.js lê a lista de selos).
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("data-tema", "fosforo");
  });
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("sem Lenis e com todo o conteúdo no estado final", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("data-movimento", "pronto");
    expect(await page.locator("html").getAttribute("class")).not.toContain("lenis");
    // O nome já está na largura final e os blocos de Formação já estão cheios, sem transição.
    const largura = await page.locator(".hero h1").evaluate((e) => getComputedStyle(e).fontStretch);
    expect(largura).toBe("112%");
    const fim = await page.locator(".bloco-enchimento").first().evaluate((e) => getComputedStyle(e.closest(".bloco")!).getPropertyValue("--preenche"));
    expect(Number(fim)).toBeGreaterThan(0);
  });
});

test.describe("rolagem", () => {
  test("âncora do Índice para abaixo da barra", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Formação", exact: true }).click();
    await expect(page.locator("#formacao")).toBeInViewport();
    await expect.poll(async () => page.locator("#formacao").evaluate((e) => Math.round(e.getBoundingClientRect().top)), { timeout: 5000 }).toBeLessThan(120);
  });
});

test.describe("barra", () => {
  test("só tem chuva, terminal e tema ao lado da navegação", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    const barra = page.locator("header.barra");
    await expect(barra.getByRole("button", { name: "Terminal" })).toBeVisible();
    await expect(barra.getByRole("button", { name: "Tema" })).toBeVisible();
    await expect(barra.getByRole("button", { name: /chuva/i })).toBeVisible();
    await expect(barra.getByRole("link", { name: "Currículo" })).toHaveCount(0);
    await expect(barra.getByRole("button", { name: /som/i })).toHaveCount(0);
  });

  test("o nome volta ao topo na página inicial", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Competências", exact: true }).click();
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBeGreaterThan(1000);
    await page.locator(".barra-nome").click();
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBe(0);
    expect(new URL(page.url()).hash).toBe("");
  });

  test("o Fósforo aparece bloqueado no menu até o CTF terminar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Tema" }).click();
    await expect(page.getByRole("menuitem", { name: "Rubro" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Claro" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Fósforo (bloqueado)" })).toHaveAttribute("aria-disabled", "true");
  });
});

test.describe("service worker e offline", () => {
  test.use({ serviceWorkers: "allow" });

  test("registra, faz o pré-cache e cai em /offline sem rede", async ({ page, context }) => {
    await page.goto("/cv", { waitUntil: "networkidle" });
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
    await expect.poll(() => page.evaluate(async () => (await caches.keys()).some((k) => k.startsWith("sinal-"))), { timeout: 20000 }).toBe(true);
    await expect.poll(() => page.evaluate(async () => !!(await caches.match("/offline"))), { timeout: 20000 }).toBe(true);
    await page.reload({ waitUntil: "networkidle" }); // o controlador assume
    await context.setOffline(true);
    await page.goto("/cv");
    await expect(page.locator("main")).toContainText("Linknet Telecomunicações");
    await page.goto("/seguranca").catch(() => {});
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Sem conexão|Segurança/);
    await context.setOffline(false);
  });
});

test("manifesto e transição de rota não violam a CSP", async ({ page, request }) => {
  const erros: string[] = [];
  page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  page.on("pageerror", (e) => erros.push(String(e)));
  expect((await request.get("/manifest.webmanifest")).status()).toBe(200);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Ver currículo" }).click();
  await expect(page).toHaveURL(/\/cv$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(erros).toEqual([]);
});
